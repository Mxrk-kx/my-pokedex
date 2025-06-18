import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonSearchCardComponent } from './pokemon-search-card.component';

describe('PokemonSearchCardComponent', () => {
  let component: PokemonSearchCardComponent;
  let fixture: ComponentFixture<PokemonSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonSearchCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
