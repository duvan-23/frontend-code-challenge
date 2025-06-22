import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CsvPreview } from './pages/csv-preview/csv-preview';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'csv-preview', component: CsvPreview },
    ],
  },
  { path: '**', redirectTo: '' },
];
