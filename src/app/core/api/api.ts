import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { I18n } from '../i18n';

export function apiUrl(path: string): string {
  return `${environment.apiUrl}${path}`;
}

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) return next(req);
  return next(req.clone({ setHeaders: { 'Accept-Language': inject(I18n).lang() } }));
};

/** RFC 7807 body returned by the API on errors. */
export interface ProblemDetail {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string>;
  code?: string;
  permission?: string;
}

export function problemCode(error: unknown): string | null {
  return (error as { error?: ProblemDetail } | null)?.error?.code ?? null;
}

export function problemMessage(error: unknown): string | null {
  const body = (error as { error?: ProblemDetail } | null)?.error;
  return body?.detail ?? null;
}
