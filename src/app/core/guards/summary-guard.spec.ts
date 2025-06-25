import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { summaryGuard } from './summary-guard';

describe('summaryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => summaryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
