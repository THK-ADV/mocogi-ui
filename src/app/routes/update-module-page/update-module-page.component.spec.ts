import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModulePageComponent } from './update-module-page.component';

describe('UpdateModulePageComponent', () => {
  let component: UpdateModulePageComponent;
  let fixture: ComponentFixture<UpdateModulePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateModulePageComponent]
    });
    fixture = TestBed.createComponent(UpdateModulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
