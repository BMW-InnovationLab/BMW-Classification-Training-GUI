import { TestBed } from '@angular/core/testing';

import { DataGetterFirstApiService } from './data-getter-first-api.service';

describe('DataGetterService', () => {
  let service: DataGetterFirstApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataGetterFirstApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
