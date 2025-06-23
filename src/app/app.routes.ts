import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Summary } from './pages/summary/summary';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'summary', component: Summary },
    ],
  },
  { path: '**', redirectTo: '' },
];
