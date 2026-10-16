import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { legacyPageGuard, legacyPageMatcher, orgGuard } from './core/org/org-guard';
import { Shell } from './layout/shell';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./features/home/home').then((m) => m.Home) },
  {
    path: 'docs',
    loadComponent: () => import('./features/public-docs/public-docs').then((m) => m.PublicDocs),
  },
  { path: 'login', loadComponent: () => import('./features/login/login').then((m) => m.Login) },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth-callback/auth-callback').then((m) => m.AuthCallback),
  },
  { matcher: legacyPageMatcher, canActivate: [authGuard, legacyPageGuard], children: [] },
  {
    path: ':org',
    component: Shell,
    canActivate: [authGuard, orgGuard],
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
      {
        path: 'vulnerabilities',
        loadComponent: () =>
          import('./features/vulnerabilities/vulnerabilities').then((m) => m.Vulnerabilities),
      },
      {
        path: 'vulnerabilities/:cve',
        loadComponent: () =>
          import('./features/vulnerabilities/vulnerability-detail').then((m) => m.VulnerabilityDetail),
      },
      {
        path: 'pipelines',
        loadComponent: () =>
          import('./features/pipeline-runs/pipeline-runs').then((m) => m.PipelineRuns),
      },
      {
        path: 'pipelines/:id',
        loadComponent: () => import('./features/pipeline-runs/run-detail').then((m) => m.RunDetail),
      },
      { path: 'reports', loadComponent: () => import('./features/reports/reports').then((m) => m.Reports) },
      {
        path: 'reports/:id',
        loadComponent: () => import('./features/reports/report-view').then((m) => m.ReportView),
      },
      {
        path: 'integrations',
        loadComponent: () =>
          import('./features/integrations/integrations').then((m) => m.Integrations),
      },
      { path: 'policies', loadComponent: () => import('./features/policies/policies').then((m) => m.Policies) },
      { path: 'team', loadComponent: () => import('./features/team/team').then((m) => m.Team) },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
      { path: 'help', loadComponent: () => import('./features/help/help').then((m) => m.Help) },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];
