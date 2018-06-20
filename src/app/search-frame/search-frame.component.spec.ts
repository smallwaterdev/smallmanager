import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFrameComponent } from './search-frame.component';

describe('SearchFrameComponent', () => {
  let component: SearchFrameComponent;
  let fixture: ComponentFixture<SearchFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
