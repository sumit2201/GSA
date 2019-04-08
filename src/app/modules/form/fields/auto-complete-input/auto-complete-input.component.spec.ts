import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteInputComponent } from './auto-complete-input.component';

describe('AutoCompleteInputComponent', () => {
  let component: AutoCompleteInputComponent;
  let fixture: ComponentFixture<AutoCompleteInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
