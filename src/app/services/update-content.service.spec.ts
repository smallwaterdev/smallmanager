import { TestBed, inject } from '@angular/core/testing';

import { UpdateContentService } from './update-content.service';

describe('UpdateContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateContentService]
    });
  });

  it('should be created', inject([UpdateContentService], (service: UpdateContentService) => {
    expect(service).toBeTruthy();
  }));
});
