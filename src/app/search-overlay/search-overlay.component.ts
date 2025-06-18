import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonSearchCardComponent } from '../pokemon-search-card/pokemon-search-card.component';
import { POKEMON_TYPE_COLORS } from '../shared/pokemon-type-colors';


@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    PokemonSearchCardComponent 
  ],
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.scss']
})
export class SearchOverlayComponent implements OnChanges {
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() addPokemonToPokedex = new EventEmitter<any>();
  @Input() pokedexPokemonIds: Set<string | number> = new Set();

  searchTerm: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    // หาก pokedexPokemonIds เปลี่ยนแปลง และมี searchTerm อยู่ ให้ทำการค้นหาใหม่
    // เพื่อกรองการ์ดที่ถูกเพิ่มไปแล้วออกไปทันที
    if (changes['pokedexPokemonIds'] && this.searchTerm.trim()) {
        this.searchPokemon(); // <-- เรียก searchPokemon อีกครั้งเมื่อ pokedexPokemonIds เปลี่ยนแปลง
    }
  }

  ngOnInit() {
      this.resetSearchOverlay();
  }

  // ***** เมธอดสำหรับรีเซ็ตสถานะของ Search Overlay *****
  private resetSearchOverlay() {
    this.searchTerm = '';
    this.searchResults = [];
    this.isLoading = false;
  }
  
  async searchPokemon() {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.searchResults = [];

    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    const baseUrl = 'http://localhost:3030/api/cards?limit=30'; 

    let apiUrl = '';
    const isTypeSearch = POKEMON_TYPE_COLORS.some(type => type.name === lowerCaseSearchTerm);

    if (isTypeSearch) {
     
      apiUrl = `${baseUrl}&type=${encodeURIComponent(lowerCaseSearchTerm)}`;
    } else {
      
      apiUrl = `${baseUrl}&name=${encodeURIComponent(lowerCaseSearchTerm)}`;
    }

    try {
      // เรียก API ใหม่ของคุณ
      const response: any = await this.http.get(apiUrl).toPromise();

      let cardsToProcess: any[] = [];
      // ตรวจสอบว่า Response เป็น Array โดยตรง หรือเป็น Object ที่มี property ชื่อ 'cards' ที่เป็น Array
      if (Array.isArray(response)) {
        cardsToProcess = response; // เช่น ถ้า API ตอบกลับมาเป็น [ {card1}, {card2} ]
      } else if (response && Array.isArray(response.cards)) {
        cardsToProcess = response.cards; // เช่น ถ้า API ตอบกลับมาเป็น { data: ..., cards: [ {card1}, {card2} ] }
      }

      for (const cardData of cardsToProcess) {
        if (cardData.id && !this.pokedexPokemonIds.has(cardData.id)) {
          this.addPokemonToSearchResults(cardData);
        }
      }

      if (this.searchResults.length === 0) {
        console.log('No Pokemon cards found for the given search term from your API.');
      }

    } catch (error) {
      console.error('Error searching Pokemon cards from your local API:', error);
      this.searchResults = [];
    } finally {
      this.isLoading = false;
    }
  }


  private addPokemonToSearchResults(cardData: any) {
  const id = cardData.id || null;
  const name = (cardData.name || '').toUpperCase();
  const imageUrl = cardData.imageUrl || cardData.images?.small || '';

  const hp = parseInt(cardData.hp || '0', 10);

  let totalDamage = 0;
  if (cardData.attacks && Array.isArray(cardData.attacks)) {
      cardData.attacks.forEach((attack: any) => {
          if (attack.damage) {
              const damageValue = parseInt(attack.damage.replace(/[^0-9]/g, ''), 10);
              if (!isNaN(damageValue)) {
                  totalDamage += damageValue;
              }
          }
      });
  }
  
  let weaknessCount = 0;
  if (cardData.weaknesses && Array.isArray(cardData.weaknesses)) {
      weaknessCount = cardData.weaknesses.length;
  }

  const types = cardData.types || []; 

  let weaknessText = 'Unknown';
  if (cardData.weaknesses && Array.isArray(cardData.weaknesses) && cardData.weaknesses.length > 0) {
    weaknessText = cardData.weaknesses.map((w: any) => w.type || w).join(', ');
  } else if (types.length > 0) {
    const primaryType = types[0].toLowerCase();
    const typeInfo = POKEMON_TYPE_COLORS.find(t => t.name === primaryType);
    if (typeInfo && typeInfo.weakness) {
      weaknessText = typeInfo.weakness.join(', ');
    }
  }

  const happinessLevel = this.calculateHappiness(hp, totalDamage, weaknessCount);

  // ***** เพิ่มการคำนวณ STR และ WeaknessValue เป็นเปอร์เซ็นต์ *****
  const maxHp = 300; // สมมติค่า HP สูงสุดที่เป็นไปได้
  const maxStr = 200; // สมมติค่า Damage/Attack สูงสุดที่เป็นไปได้ (จาก attacks array รวมกัน)
  const maxWeaknessCount = 3; // สมมติจำนวนจุดอ่อนสูงสุดที่เป็นไปได้

  const hpPercentage = Math.min(100, Math.round((hp / maxHp) * 100));
  const strPercentage = Math.min(100, Math.round((totalDamage / maxStr) * 100)); // ใช้ totalDamage
  const weaknessPercentage = Math.min(100, Math.round((weaknessCount / maxWeaknessCount) * 100));


  this.searchResults.push({
    id: id,
    name: name,
    imageUrl: imageUrl,
    hp: hpPercentage, // ใช้ค่าเปอร์เซ็นต์สำหรับ bar
    str: strPercentage, // ใช้ค่าเปอร์เซ็นต์สำหรับ bar
    weaknessValue: weaknessPercentage, // ใช้ค่าเปอร์เซ็นต์สำหรับ bar
    weak: weaknessText, // ยังคงเก็บข้อความไว้เผื่อใช้
    types: types,
    smiles: happinessLevel
  });
}

  private calculateHappiness(hp: number, damage: number, weakness: number): number {
      // สูตร: ((HP / 10) + (Damage /10 ) + 10 - (Weakness)) / 5
      let calculatedSmiles = ((hp / 10) + (damage / 10) + 10 - (weakness)) / 5;

      // ปรับค่าให้เป็นจำนวนเต็ม และไม่ให้ต่ำกว่า 0 หรือสูงเกินไป
      calculatedSmiles = Math.max(0, Math.floor(calculatedSmiles));
      // กำหนดค่าสูงสุดของ smiles (เช่น ไม่เกิน 7 หรือตามที่คุณต้องการ)
      // สามารถปรับค่าสูงสุดได้ตามความเหมาะสมในการแสดงผล
      const maxSmiles = 7; // ตัวอย่าง: สูงสุด 7 ไอคอน
      return Math.min(calculatedSmiles, maxSmiles);
  }
  
  onAddPokemon(pokemon: any) {
    this.addPokemonToPokedex.emit(pokemon);
    this.searchResults = this.searchResults.filter(p => p.id !== pokemon.id);
  }
}


