import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDialogueComponent } from './app-dialogue.component';

describe('AppDialogueComponent', () => {
  let component: AppDialogueComponent;
  let fixture: ComponentFixture<AppDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
