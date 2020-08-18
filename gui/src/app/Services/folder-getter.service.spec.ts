import { TestBed } from '@angular/core/testing';

import { FolderGetterService } from './folder-getter.service';

describe('FolderGetterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FolderGetterService = TestBed.get(FolderGetterService);
    expect(service).toBeTruthy();
  });
});
