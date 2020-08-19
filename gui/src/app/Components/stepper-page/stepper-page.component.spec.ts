import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperPageComponent } from './stepper-page.component';

describe('StepperPageComponent', () => {
  let component: StepperPageComponent;
  let fixture: ComponentFixture<StepperPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
