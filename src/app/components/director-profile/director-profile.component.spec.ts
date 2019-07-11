import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorProfileComponent } from './director-profile.component';

describe('DirectorProfileComponent', () => {
  let component: DirectorProfileComponent;
  let fixture: ComponentFixture<DirectorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
