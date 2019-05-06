import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTextInputComponent } from './plain-text-input.component';

describe('PlainTextInputComponent', () => {
  let component: PlainTextInputComponent;
  let fixture: ComponentFixture<PlainTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlainTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
