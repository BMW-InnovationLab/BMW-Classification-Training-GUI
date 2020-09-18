import { TestBed } from '@angular/core/testing';

import { DataSenderSecondApiService } from './data-sender-second-api.service';

describe('DataSenderSecondApiService', () => {
  let service: DataSenderSecondApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSenderSecondApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
