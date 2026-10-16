import { Routes } from '@angular/router';
import { TranslationKey } from './core/i18n';
import { Shell } from './layout/shell';

const comingSoon = (path: string, title: TranslationKey) => ({
  path,
  data: { title },
  loadComponent: () => import('./shared/coming-soon').then((m) => m.ComingSoon),
});

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login').then((m) => m.Login) },
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'repositories',
        loadComponent: () =>
          import('./features/repositories/repositories').then((m) => m.Repositories),
      },
      {
        path: 'repositories/:name',
        loadComponent: () =>
          import('./features/repo-settings/repo-settings').then((m) => m.RepoSettings),
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./features/onboarding/onboarding').then((m) => m.Onboarding),
      },
      comingSoon('vulnerabilities', 'nav.vulnerabilities'),
      comingSoon('pipelines', 'nav.pipelines'),
      { path: 'reports', loadComponent: () => import('./features/reports/reports').then((m) => m.Reports) },
      {
        path: 'reports/:id',
        loadComponent: () => import('./features/reports/report-view').then((m) => m.ReportView),
      },
      comingSoon('integrations', 'nav.integrations'),
      { path: 'policies', loadComponent: () => import('./features/policies/policies').then((m) => m.Policies) },
      comingSoon('team', 'nav.team'),
      comingSoon('settings', 'nav.settings'),
      { path: 'help', loadComponent: () => import('./features/help/help').then((m) => m.Help) },
    ],
  },
  { path: '**', redirectTo: '' },
];
