import { TestBed } from '@angular/core/testing';

import { PalGenService } from './pal-gen.service';

describe('PalGenService', () => {
  let service: PalGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalGenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
