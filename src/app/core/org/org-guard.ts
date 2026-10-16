import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlMatcher, UrlSegment } from '@angular/router';
import { Auth } from '../auth/auth';
import { OrgContext } from './org-context';

/** Ensures the first URL segment is the organization slug, rewriting unknown or legacy URLs. */
export const orgGuard: CanActivateFn = async (route, state) => {
  // authGuard handles anonymous users; the slug can only be loaded with a token.
  if (!inject(Auth).isAuthenticated()) return true;
  const router = inject(Router);
  const slug = await inject(OrgContext).resolve();
  const requested = route.paramMap.get('org');
  if (requested === slug) return true;
  const [path, query] = state.url.split('?');
  const rest = path.split('/').filter(Boolean).slice(1).join('/');
  return router.parseUrl(`/${slug}/${rest || 'dashboard'}${query ? `?${query}` : ''}`);
};

const APP_PAGES = new Set([
  'dashboard', 'vulnerabilities', 'repositories', 'pipelines', 'reports', 'onboarding',
  'integrations', 'policies', 'team', 'settings', 'billing', 'help',
]);

/** Matches pre-organization URLs such as `/vulnerabilities/CVE-1`. */
export const legacyPageMatcher: UrlMatcher = (segments: UrlSegment[]) =>
  segments.length && APP_PAGES.has(segments[0].path) ? { consumed: segments } : null;

/** Sends legacy URLs to the same page under the organization slug. */
export const legacyPageGuard: CanActivateFn = async (_route, state) => {
  if (!inject(Auth).isAuthenticated()) return true;
  const router = inject(Router);
  const slug = await inject(OrgContext).resolve();
  return router.parseUrl(`/${slug}${state.url}`);
};
