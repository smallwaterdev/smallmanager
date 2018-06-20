import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastNextBtnComponent } from './last-next-btn.component';

describe('LastNextBtnComponent', () => {
  let component: LastNextBtnComponent;
  let fixture: ComponentFixture<LastNextBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastNextBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastNextBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
