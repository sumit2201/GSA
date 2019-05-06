import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGalleryComponent } from './app-gallery.component';

describe('AppGalleryComponent', () => {
  let component: AppGalleryComponent;
  let fixture: ComponentFixture<AppGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
