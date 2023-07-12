import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThKoelnBarComponent } from './th-koeln-bar.component';

describe('ThKoelnBarComponent', () => {
  let component: ThKoelnBarComponent;
  let fixture: ComponentFixture<ThKoelnBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThKoelnBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThKoelnBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
