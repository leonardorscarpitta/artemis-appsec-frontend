import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { problemMessage } from '../../core/api/api';
import { AdminApi, AdminOrganization, adminOrganizationsUrl } from '../../core/api/admin';
import { FEATURES, Feature } from '../../core/api/usage';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { OrgContext } from '../../core/org/org-context';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { Paginator, paginate } from '../../shared/paginator';
import { RequestState } from '../../shared/request-state';
import { ThemeToggle } from '../../shared/theme-toggle';
import { UserBadge } from '../../shared/user-badge';

/**
 * Platform administration (Artemis administrators, not organization admins): every organization's metadata and
 * its optional features. Never shows repositories, findings or members.
 */
@Component({
  selector: 'app-admin',
  imports: [RouterLink, DatePipe, Logo, LangSwitch, ThemeToggle, UserBadge, Paginator, RequestState],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  protected readonly i18n = inject(I18n);
  private readonly auth = inject(Auth);
  private readonly api = inject(AdminApi);

  protected readonly organizations = httpResource<AdminOrganization[]>(() => adminOrganizationsUrl());
  protected readonly features = FEATURES;
  protected readonly query = signal('');
  protected readonly busy = signal<string | null>(null);
  protected readonly message = signal<{ slug: string; ok: boolean; text: string } | null>(null);

  protected readonly filtered = computed(() => {
    const rows = this.organizations.hasValue() ? this.organizations.value() : [];
    const q = this.query().trim().toLowerCase();
    return q ? rows.filter((o) => o.name.toLowerCase().includes(q) || o.slug.includes(q)) : rows;
  });
  protected readonly pager = paginate(this.filtered, this.query);

  constructor() {
    inject(OrgContext).slug.set(null);
  }

  protected featureName(feature: Feature): string {
    return this.i18n.t(`feature.${feature}`);
  }

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggle(org: AdminOrganization, feature: Feature): void {
    const features = org.features.includes(feature) ? org.features.filter((f) => f !== feature) : [...org.features, feature];
    this.busy.set(org.slug);
    this.message.set(null);
    this.api.setFeatures(org.slug, features).subscribe({
      next: (updated) => {
        this.organizations.update((rows) => rows?.map((o) => (o.slug === updated.slug ? updated : o)));
        this.busy.set(null);
        this.message.set({ slug: org.slug, ok: true, text: this.i18n.t('admin.saved').replace('{name}', org.name) });
      },
      error: (error: unknown) => {
        this.busy.set(null);
        this.message.set({ slug: org.slug, ok: false, text: problemMessage(error) ?? this.i18n.t('api.saveError') });
      },
    });
  }

  protected signOut(): void {
    void this.auth.logout();
  }
}
