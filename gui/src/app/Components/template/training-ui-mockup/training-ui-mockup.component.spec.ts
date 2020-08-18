import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingUIMockupComponent } from './training-ui-mockup.component';

describe('TrainingUIMockupComponent', () => {
  let component: TrainingUIMockupComponent;
  let fixture: ComponentFixture<TrainingUIMockupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingUIMockupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingUIMockupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
