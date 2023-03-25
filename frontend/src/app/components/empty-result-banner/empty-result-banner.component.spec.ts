import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyResultBannerComponent } from './empty-result-banner.component';

describe('EmptyResultBannerComponent', () => {
  let component: EmptyResultBannerComponent;
  let fixture: ComponentFixture<EmptyResultBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyResultBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyResultBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
