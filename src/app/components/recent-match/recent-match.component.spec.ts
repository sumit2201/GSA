import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentMatchComponent } from './recent-match.component';

describe('RecentMatchComponent', () => {
  let component: RecentMatchComponent;
  let fixture: ComponentFixture<RecentMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
