import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFoodComponent } from './order-food.component';

describe('OrderFoodComponent', () => {
  let component: OrderFoodComponent;
  let fixture: ComponentFixture<OrderFoodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderFoodComponent]
    });
    fixture = TestBed.createComponent(OrderFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
