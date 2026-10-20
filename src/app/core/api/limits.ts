import { httpResource } from '@angular/common/http';
import { Service, computed } from '@angular/core';
import { apiUrl } from './api';

/** Limits every organization gets (public endpoint, no sign-in); 40 until the API answers. */
@Service()
export class PlatformLimits {
  private readonly limits = httpResource<{ scansPerMonth: number }>(() => apiUrl('/limits'));

  readonly scansPerMonth = computed(() => this.limits.value()?.scansPerMonth ?? 40);

  /** Replaces the `{scans}` placeholder in static page content with the live limit. */
  fill<T>(content: T): T {
    return JSON.parse(JSON.stringify(content).replaceAll('{scans}', String(this.scansPerMonth())));
  }
}
