import { TestBed } from '@angular/core/testing';

import { OpportuniteService } from './opportunite.service';

describe('OpportuniteService', () => {
  let service: OpportuniteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpportuniteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
