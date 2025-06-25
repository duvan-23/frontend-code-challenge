import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Summary } from './pages/summary/summary';
import { Layout } from './layout/layout';
import { sessionFormGuard } from '@core/guards/session-form-guard';
import { summaryGuard } from '@core/guards/summary-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home, canActivate: [sessionFormGuard] },
      { path: 'summary', component: Summary, canActivate: [summaryGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
