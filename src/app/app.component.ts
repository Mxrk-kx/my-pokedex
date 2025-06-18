import { Component } from '@angular/core';
import { SearchOverlayComponent } from './search-overlay/search-overlay.component';
import { PokemonDisplayCardComponent } from './pokemon-display-card/pokemon-display-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

const COLORS = {
  Psychic: '#f8a5c2',
  Fighting: '#f0932b',
  Fairy: '#c44569',
  Normal: '#f6e58d',
  Grass: '#badc58',
  Metal: '#95afc0',
  Water: '#3dc1d3',
  Lightning: '#f9ca24',
  Darkness: '#574b90',
  Colorless: '#FFF',
  Fire: '#eb4d4b',
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,SearchOverlayComponent,PokemonDisplayCardComponent ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bn-pokedex';
  showSearchOverlay: boolean = false;
  myPokedexIds: Set<string | number> = new Set();
  myPokedex: any[] = [];

  constructor() {
    
    const storedPokedex = localStorage.getItem('myPokedex');
    if (storedPokedex) {
      this.myPokedex = JSON.parse(storedPokedex);
    }
  }

  toggleSearchOverlay() {
    this.showSearchOverlay = !this.showSearchOverlay;
  }

  addPokemonToPokedex(pokemon: any) {
    if (!this.myPokedexIds.has(pokemon.id)) {
      this.myPokedex.push(pokemon);
      this.myPokedexIds.add(pokemon.id); // <--- **เพิ่ม ID เข้าไปใน Set**
      console.log('Added to Pokedex:', pokemon.name, this.myPokedexIds);
    } else {
      console.log(pokemon.name, 'is already in Pokedex.');
    }
  }

  removePokemonFromPokedex(pokemonId: number) {
    this.myPokedex = this.myPokedex.filter(p => p.id !== pokemonId);
    this.myPokedexIds.delete(pokemonId); // <--- **ลบ ID ออกจาก Set**
    console.log('Removed from Pokedex. Current IDs:', this.myPokedexIds);

  }
  
  onPokemonAddedFromOverlay(pokemon: any) {
    this.addPokemonToPokedex(pokemon); // เรียกใช้เมธอดที่มีอยู่แล้ว
    // ไม่ต้องทำอะไรพิเศษที่นี่ เพราะ SearchOverlayComponent จะกรองตัวเองเมื่อ onAddPokemon ถูกเรียก
    // และเมื่อ SearchOverlay ถูกปิดและเปิดใหม่ มันจะได้รับ pokedexPokemonIds ที่อัปเดตแล้ว
  }
}
