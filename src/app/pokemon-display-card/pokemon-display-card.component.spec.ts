import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDisplayCardComponent } from './pokemon-display-card.component';

describe('PokemonDisplayCardComponent', () => {
  let component: PokemonDisplayCardComponent;
  let fixture: ComponentFixture<PokemonDisplayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonDisplayCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
