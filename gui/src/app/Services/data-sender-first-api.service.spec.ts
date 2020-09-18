import { TestBed } from '@angular/core/testing';

import { DataSenderFirstApiService } from './data-sender-first-api.service';

describe('DataSenderFirstApiService', () => {
  let service: DataSenderFirstApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSenderFirstApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
