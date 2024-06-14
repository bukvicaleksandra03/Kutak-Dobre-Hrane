import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterDeliveriesComponent } from './waiter-deliveries.component';

describe('WaiterDeliveriesComponent', () => {
  let component: WaiterDeliveriesComponent;
  let fixture: ComponentFixture<WaiterDeliveriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaiterDeliveriesComponent]
    });
    fixture = TestBed.createComponent(WaiterDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
