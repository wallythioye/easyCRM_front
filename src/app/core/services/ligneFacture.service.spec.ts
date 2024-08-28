/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LigneFactureService } from './ligneFacture.service';

describe('Service: LigneFacture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LigneFactureService]
    });
  });

  it('should ...', inject([LigneFactureService], (service: LigneFactureService) => {
    expect(service).toBeTruthy();
  }));
});
