import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRailComponent } from './app-rail.component';

describe('AppRailComponent', () => {
  let component: AppRailComponent;
  let fixture: ComponentFixture<AppRailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppRailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppRailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
