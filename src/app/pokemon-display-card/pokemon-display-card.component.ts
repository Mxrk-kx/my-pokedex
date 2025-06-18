import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-display-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-display-card.component.html',
  styleUrls: ['./pokemon-display-card.component.scss']
})
export class PokemonDisplayCardComponent {
  @Input() pokemonData: any; // รับข้อมูล Pokemon เข้ามา
  @Output() removeCard = new EventEmitter<number>(); // ส่ง Event เมื่อกด X เพื่อลบการ์ด

  constructor() { }

}
