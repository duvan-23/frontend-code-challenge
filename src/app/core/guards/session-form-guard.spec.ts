import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sessionFormGuard } from './session-form-guard';

describe('sessionFormGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sessionFormGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
