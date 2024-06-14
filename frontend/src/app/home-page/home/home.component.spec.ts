import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageHeaderComponent } from './home.component';

describe('HomePageHeaderComponent', () => {
  let component: HomePageHeaderComponent;
  let fixture: ComponentFixture<HomePageHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageHeaderComponent]
    });
    fixture = TestBed.createComponent(HomePageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
