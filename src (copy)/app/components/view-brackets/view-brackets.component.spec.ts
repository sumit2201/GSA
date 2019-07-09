import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBracketsComponent } from './view-brackets.component';

describe('ViewBracketsComponent', () => {
  let component: ViewBracketsComponent;
  let fixture: ComponentFixture<ViewBracketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBracketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBracketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
