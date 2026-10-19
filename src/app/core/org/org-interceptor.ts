import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { apiPath, problemCode } from '../api/api';
import { ORG_HEADER, OrgContext } from './org-context';

const UNSCOPED = /^\/(me|organizations|admin)(\/|$|\?)/;

/** Scopes API calls to the organization in the URL and reacts when the membership changed meanwhile. */
export const orgInterceptor: HttpInterceptorFn = (req, next) => {
  const path = apiPath(req.url);
  if (path === null) return next(req);
  const org = inject(OrgContext);
  const router = inject(Router);
  const slug = org.slug();
  if (!slug || UNSCOPED.test(path) || req.headers.has(ORG_HEADER)) return next(req);
  return next(req.clone({ setHeaders: { [ORG_HEADER]: slug } })).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (problemCode(error) === 'organization-not-found') {
          org.remove(slug);
          void router.navigateByUrl('/organizations');
        } else if (error.status === 403) {
          // The role may have changed since the memberships were loaded.
          void org.load(true).catch(() => undefined);
        }
      }
      return throwError(() => error);
    }),
  );
};
