import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestFoodDeliveryComponent } from './guest-food-delivery.component';

describe('GuestFoodDeliveryComponent', () => {
  let component: GuestFoodDeliveryComponent;
  let fixture: ComponentFixture<GuestFoodDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestFoodDeliveryComponent]
    });
    fixture = TestBed.createComponent(GuestFoodDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
