import { TestBed } from '@angular/core/testing';

import { ConfigFileManagerService } from './config-file-manager.service';

describe('ConfigFileManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigFileManagerService = TestBed.get(ConfigFileManagerService);
    expect(service).toBeTruthy();
  });
});
