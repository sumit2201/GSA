import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniWebComponent } from './mini-web.component';

describe('MiniWebComponent', () => {
  let component: MiniWebComponent;
  let fixture: ComponentFixture<MiniWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
