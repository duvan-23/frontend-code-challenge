import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SummaryData } from '@shared/models/summary.interface';
import { SessionStorage } from '@shared/services/session-storage';

export const summaryGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const sessionStorageService = inject(SessionStorage);
  const data:SummaryData | null = sessionStorageService.getItem("formData");

  if (!data || !data.email) {
    router.navigate(['/']);
    return false;
  }

  if (typeof data.email === 'string' && data.email.trim().length > 0) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
