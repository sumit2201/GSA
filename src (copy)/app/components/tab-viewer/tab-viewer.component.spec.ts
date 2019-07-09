import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabViewerComponent } from './tab-viewer.component';

describe('TabViewerComponent', () => {
  let component: TabViewerComponent;
  let fixture: ComponentFixture<TabViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
