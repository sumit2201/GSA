import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBracketComponent } from './view-bracket.component';

describe('ViewBracketComponent', () => {
  let component: ViewBracketComponent;
  let fixture: ComponentFixture<ViewBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
