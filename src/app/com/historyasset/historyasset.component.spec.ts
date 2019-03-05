import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryassetComponent } from './historyasset.component';

describe('HistoryassetComponent', () => {
  let component: HistoryassetComponent;
  let fixture: ComponentFixture<HistoryassetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryassetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
