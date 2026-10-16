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
      comingSoon('reports', 'nav.reports'),
      {
        path: 'integrations',
        loadComponent: () =>
          import('./features/integrations/integrations').then((m) => m.Integrations),
      },
      comingSoon('policies', 'nav.policies'),
      { path: 'team', loadComponent: () => import('./features/team/team').then((m) => m.Team) },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
      { path: 'help', loadComponent: () => import('./features/help/help').then((m) => m.Help) },
    ],
  },
  { path: '**', redirectTo: '' },
];
