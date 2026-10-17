import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { apiPath } from '../api/api';
import { Auth } from './auth';

/** Sends the access token to the Artemis API and restarts the login when it is rejected. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (apiPath(req.url) === null) return next(req);
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.accessToken();
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        void auth.clearSession().then(() => router.navigate(['/login'], { queryParams: { returnUrl: router.url } }));
      }
      return throwError(() => error);
    }),
  );
};
