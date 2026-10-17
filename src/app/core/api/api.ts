import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { I18n } from '../i18n';

export function apiUrl(path: string): string {
  return `${environment.apiUrl}${path}`;
}

/**
 * The request path relative to the Artemis API (e.g. "/findings?x=1"), or null when the URL is not the API.
 * Compares the parsed origin and a whole path prefix, so look-alike hosts or paths never receive tokens or headers.
 */
export function apiPath(url: string): string | null {
  const base = new URL(environment.apiUrl, location.origin);
  const target = new URL(url, location.origin);
  const prefix = base.pathname.replace(/\/$/, '');
  if (target.origin !== base.origin) return null;
  if (target.pathname !== prefix && !target.pathname.startsWith(`${prefix}/`)) return null;
  return target.pathname.slice(prefix.length) + target.search;
}

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (apiPath(req.url) === null) return next(req);
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
