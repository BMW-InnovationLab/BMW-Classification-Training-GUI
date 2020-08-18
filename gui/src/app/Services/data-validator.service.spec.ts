import { TestBed } from '@angular/core/testing';

import { DataValidatorService } from './data-validator.service';

describe('DataValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataValidatorService = TestBed.get(DataValidatorService);
    expect(service).toBeTruthy();
  });
});
