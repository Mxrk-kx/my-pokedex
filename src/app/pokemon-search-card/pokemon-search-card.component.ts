import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-search-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-search-card.component.html',
  styleUrls: ['./pokemon-search-card.component.scss']
})
export class PokemonSearchCardComponent {
  @Input() pokemonData: any; 
  @Output() addPokemon = new EventEmitter<any>(); 

  constructor() { }
  onAddClick() {
    this.addPokemon.emit(this.pokemonData); 
  }
}
