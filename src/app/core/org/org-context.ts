import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OrganizationSettings, organizationSettingsUrl } from '../api/organization';

/** The organization the app is scoped to; its slug prefixes every in-app URL (/<slug>/<page>). */
@Service()
export class OrgContext {
  private readonly http = inject(HttpClient);
  readonly slug = signal<string | null>(null);

  async resolve(): Promise<string> {
    const known = this.slug();
    if (known) return known;
    const settings = await firstValueFrom(this.http.get<OrganizationSettings>(organizationSettingsUrl()));
    this.slug.set(settings.general.slug);
    return settings.general.slug;
  }

  /** Absolute in-app URL for a page path such as `/vulnerabilities/CVE-1`. */
  url(path: string): string {
    return `/${this.slug()}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
