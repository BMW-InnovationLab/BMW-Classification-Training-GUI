import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSettingsComponent } from './container-settings.component';

describe('ContainerSettingsComponent', () => {
  let component: ContainerSettingsComponent;
  let fixture: ComponentFixture<ContainerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
