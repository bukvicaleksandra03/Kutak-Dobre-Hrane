import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRestaurantsComponent } from './guest-restaurants.component';

describe('GuestRestaurantsComponent', () => {
  let component: GuestRestaurantsComponent;
  let fixture: ComponentFixture<GuestRestaurantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuestRestaurantsComponent]
    });
    fixture = TestBed.createComponent(GuestRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
