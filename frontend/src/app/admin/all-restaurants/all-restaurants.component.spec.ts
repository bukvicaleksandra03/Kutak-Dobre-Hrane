import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRestaurantsComponent } from './all-restaurants.component';

describe('AllRestaurantsComponent', () => {
  let component: AllRestaurantsComponent;
  let fixture: ComponentFixture<AllRestaurantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllRestaurantsComponent]
    });
    fixture = TestBed.createComponent(AllRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
