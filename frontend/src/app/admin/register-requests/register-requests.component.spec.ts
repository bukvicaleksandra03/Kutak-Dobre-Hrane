import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRequestsComponent } from './register-requests.component';

describe('RegisterRequestsComponent', () => {
  let component: RegisterRequestsComponent;
  let fixture: ComponentFixture<RegisterRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterRequestsComponent]
    });
    fixture = TestBed.createComponent(RegisterRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
