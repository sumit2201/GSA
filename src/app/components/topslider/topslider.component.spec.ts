import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsliderComponent } from './topslider.component';

describe('TopsliderComponent', () => {
  let component: TopsliderComponent;
  let fixture: ComponentFixture<TopsliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopsliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
