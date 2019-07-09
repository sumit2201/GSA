import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleBracketComponent } from './view-single-bracket.component';

describe('ViewBracketComponent', () => {
  let component: ViewSingleBracketComponent;
  let fixture: ComponentFixture<ViewSingleBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSingleBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSingleBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
