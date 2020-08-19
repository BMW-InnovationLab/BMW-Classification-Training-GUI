import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareDatasetComponent } from './prepare-dataset.component';

describe('PrepareDatasetComponent', () => {
  let component: PrepareDatasetComponent;
  let fixture: ComponentFixture<PrepareDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
