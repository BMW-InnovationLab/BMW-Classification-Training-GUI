import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareDatasetsComponent } from './prepare-datasets.component';

describe('PrepareDatasetsComponent', () => {
  let component: PrepareDatasetsComponent;
  let fixture: ComponentFixture<PrepareDatasetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareDatasetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
