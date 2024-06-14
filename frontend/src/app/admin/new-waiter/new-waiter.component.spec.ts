import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWaiterComponent } from './new-waiter.component';

describe('NewWaiterComponent', () => {
  let component: NewWaiterComponent;
  let fixture: ComponentFixture<NewWaiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewWaiterComponent]
    });
    fixture = TestBed.createComponent(NewWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
