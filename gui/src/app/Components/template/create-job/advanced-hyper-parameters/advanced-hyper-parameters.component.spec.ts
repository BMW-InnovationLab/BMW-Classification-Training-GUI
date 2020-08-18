import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedHyperParametersComponent } from './advanced-hyper-parameters.component';

describe('AdvancedHyperParametersComponent', () => {
  let component: AdvancedHyperParametersComponent;
  let fixture: ComponentFixture<AdvancedHyperParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedHyperParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedHyperParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
