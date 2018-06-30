import { TestBed, inject } from '@angular/core/testing';

import { UpdateMetaCacheService } from './update-meta-cache.service';

describe('UpdateMetaCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateMetaCacheService]
    });
  });

  it('should be created', inject([UpdateMetaCacheService], (service: UpdateMetaCacheService) => {
    expect(service).toBeTruthy();
  }));
});
