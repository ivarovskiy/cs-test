import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'contact-list', pathMatch: 'full' },
  {
    path: 'contact-list',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/contact-list/contact-list.component').then((c) => c.ContactListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/contact-list/contact-list.component').then((c) => c.ContactListComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/contact-list/contact-list.component').then((c) => c.ContactListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'contact-list' },
];

