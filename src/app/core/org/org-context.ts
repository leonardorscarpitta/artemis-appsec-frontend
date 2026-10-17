import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OrganizationSummary, Permission, myOrganizationsUrl } from '../api/organization';
import { I18n, TranslationKey } from '../i18n';

/** Header that scopes an API request to one organization. */
export const ORG_HEADER = 'X-Artemis-Organization';

/**
 * The organizations the signed-in user belongs to and the one in the URL (/<slug>/<page>),
 * with the user's role and permissions in it.
 */
@Service()
export class OrgContext {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18n);
  private loading: Promise<OrganizationSummary[]> | null = null;

  readonly slug = signal<string | null>(null);
  readonly organizations = signal<OrganizationSummary[] | null>(null);
  readonly current = computed(() => this.organizations()?.find((o) => o.slug === this.slug()) ?? null);

  /** Loads the user's memberships once; `refresh` fetches them again. */
  load(refresh = false): Promise<OrganizationSummary[]> {
    const known = this.organizations();
    if (known && !refresh) return Promise.resolve(known);
    this.loading ??= firstValueFrom(this.http.get<OrganizationSummary[]>(myOrganizationsUrl()))
      .then((orgs) => {
        this.organizations.set(orgs);
        return orgs;
      })
      .finally(() => (this.loading = null));
    return this.loading;
  }

  can(permission: Permission): boolean {
    return this.current()?.permissions.includes(permission) ?? false;
  }

  /** Why the current role cannot do something, e.g. "Your role (Viewer) can't run scans." */
  reason(permission: Permission): string {
    const role = this.current()?.role;
    const label = role ? this.i18n.t(`team.role.${role}` as TranslationKey) : '';
    return this.i18n.t(`perm.denied.${permission}` as TranslationKey).replace('{role}', label);
  }

  upsert(org: OrganizationSummary): void {
    this.organizations.update((orgs) =>
      [...(orgs ?? []).filter((o) => o.slug !== org.slug), org].sort((a, b) => a.name.localeCompare(b.name)),
    );
  }

  remove(slug: string): void {
    this.organizations.update((orgs) => orgs?.filter((o) => o.slug !== slug) ?? null);
    if (this.slug() === slug) this.slug.set(null);
  }

  /** Applies a rename of the current organization (settings save). */
  rename(slug: string, name: string): void {
    const previous = this.slug();
    this.organizations.update((orgs) => orgs?.map((o) => (o.slug === previous ? { ...o, slug, name } : o)) ?? null);
    this.slug.set(slug);
  }

  clear(): void {
    this.organizations.set(null);
    this.slug.set(null);
  }

  /** Absolute in-app URL for a page path such as `/vulnerabilities/CVE-1`. */
  url(path: string): string {
    return `/${this.slug()}${path.startsWith('/') ? path : `/${path}`}`;
  }
}

export const INVITE_LINK = /^\/invite\/[\w-]{16,200}$/;

/** Where to go after signing in: the requested page when allowed, the only organization, or the picker. */
export function landingUrl(orgs: OrganizationSummary[], returnUrl: string | null): string {
  const first = returnUrl?.split(/[/?#]/).filter(Boolean)[0];
  if (returnUrl && (first === 'organizations' || orgs.some((o) => o.slug === first))) return returnUrl;
  // Invitation links must survive sign-in or registration.
  if (returnUrl && INVITE_LINK.test(returnUrl)) return returnUrl;
  return orgs.length === 1 ? `/${orgs[0].slug}/dashboard` : '/organizations';
}
