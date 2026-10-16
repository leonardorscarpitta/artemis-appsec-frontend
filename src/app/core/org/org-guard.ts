import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlMatcher, UrlSegment } from '@angular/router';
import { Auth } from '../auth/auth';
import { OrgContext } from './org-context';

/** Lets the user into /<slug>/… only for organizations they belong to. */
export const orgGuard: CanActivateFn = async (route) => {
  // authGuard handles anonymous users; memberships can only be loaded with a token.
  if (!inject(Auth).isAuthenticated()) return true;
  const router = inject(Router);
  const org = inject(OrgContext);
  const requested = route.paramMap.get('org');
  try {
    const orgs = await org.load();
    if (orgs.some((o) => o.slug === requested)) {
      org.slug.set(requested);
      return true;
    }
  } catch (error) {
    console.error('Could not load organizations', error);
  }
  return router.parseUrl('/organizations');
};

const APP_PAGES = new Set([
  'dashboard', 'vulnerabilities', 'repositories', 'pipelines', 'reports', 'onboarding',
  'integrations', 'policies', 'team', 'settings', 'billing', 'help',
]);

/** Matches pre-organization URLs such as `/vulnerabilities/CVE-1`. */
export const legacyPageMatcher: UrlMatcher = (segments: UrlSegment[]) =>
  segments.length && APP_PAGES.has(segments[0].path) ? { consumed: segments } : null;

/** Sends legacy URLs to the same page in the user's first organization, or to the picker. */
export const legacyPageGuard: CanActivateFn = async (_route, state) => {
  if (!inject(Auth).isAuthenticated()) return true;
  const router = inject(Router);
  const orgs = await inject(OrgContext).load().catch(() => []);
  return router.parseUrl(orgs.length ? `/${orgs[0].slug}${state.url}` : '/organizations');
};
