import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsModalComponent } from './logs-modal.component';

describe('LogsModalComponent', () => {
  let component: LogsModalComponent;
  let fixture: ComponentFixture<LogsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
