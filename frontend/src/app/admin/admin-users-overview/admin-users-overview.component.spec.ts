import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersOverviewComponent } from './admin-users-overview.component';

describe('AdminUsersOverviewComponent', () => {
  let component: AdminUsersOverviewComponent;
  let fixture: ComponentFixture<AdminUsersOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUsersOverviewComponent]
    });
    fixture = TestBed.createComponent(AdminUsersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
