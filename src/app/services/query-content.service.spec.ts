import { TestBed, inject } from '@angular/core/testing';

import { QueryContentService } from './query-content.service';

describe('QueryContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryContentService]
    });
  });

  it('should be created', inject([QueryContentService], (service: QueryContentService) => {
    expect(service).toBeTruthy();
  }));
});
