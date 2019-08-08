import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniWebHeaderComponent } from './mini-web-header.component';

describe('MiniWebHeaderComponent', () => {
  let component: MiniWebHeaderComponent;
  let fixture: ComponentFixture<MiniWebHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniWebHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniWebHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
