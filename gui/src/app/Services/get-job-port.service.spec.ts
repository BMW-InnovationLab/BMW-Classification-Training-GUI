import { TestBed } from '@angular/core/testing';

import { GetJobPortService } from './get-job-port.service';

describe('GetJobPortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetJobPortService = TestBed.get(GetJobPortService);
    expect(service).toBeTruthy();
  });
});
