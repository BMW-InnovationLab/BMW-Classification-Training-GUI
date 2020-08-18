import { TestBed } from '@angular/core/testing';

import { DataGetter } from './data-getter.service';

describe('GetGPUsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataGetter = TestBed.get(DataGetter);
    expect(service).toBeTruthy();
  });
});
