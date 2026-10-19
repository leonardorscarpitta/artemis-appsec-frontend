import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { problemCode, problemMessage } from '../../core/api/api';
import { Member, OrganizationApi, OrganizationSettings, membersUrl, organizationSettingsUrl } from '../../core/api/organization';
import { I18n, TranslationKey } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { RoleNotice } from '../../shared/role-notice';
import { FeatureGranted } from '../../shared/feature-granted';
import { Router } from '@angular/router';
import { OrgContext } from '../../core/org/org-context';
import { slugify } from '../../core/org/slug';

type Tab = 'general' | 'danger';

const SAVE_ERRORS: Record<string, TranslationKey> = {
  'feature-not-enabled': 'settings.renameLocked',
  'slug-taken': 'orgs.error.slugTaken',
  'slug-reserved': 'orgs.error.slugReserved',
};

@Component({
  selector: 'app-settings',
  imports: [RequestState, RoleNotice, FeatureGranted],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(OrganizationApi);
  protected readonly org = inject(OrgContext);
  private readonly router = inject(Router);
  protected readonly canEdit = computed(() => this.org.can('team'));
  protected readonly isOwner = computed(() => this.org.current()?.role === 'owner');
  // Only the owner can hand the organization over; candidates are the other active members.
  private readonly members = httpResource<Member[]>(() => (this.isOwner() ? membersUrl() : undefined), { defaultValue: [] });
  protected readonly candidates = computed(() => this.members.value().filter((m) => m.active && m.role !== 'owner'));
  protected readonly newOwner = signal('');
  protected readonly transferring = signal(false);
  protected readonly transferError = signal<string | null>(null);
  protected readonly leaving = signal(false);
  protected readonly leaveError = signal<string | null>(null);

  protected readonly remote = httpResource<OrganizationSettings>(() => organizationSettingsUrl());
  protected readonly form = linkedSignal(() => this.remote.value());
  // Renaming changes the slug (and every URL), so the Artemis administrators enable it per organization.
  protected readonly canRename = computed(() => this.org.hasFeature('organizationRename'));
  protected readonly slugPreview = computed(() => {
    const f = this.form();
    if (!f) return '';
    return f.general.name.trim() === this.remote.value()?.general.name ? f.general.slug : slugify(f.general.name);
  });

  protected readonly tabs: Tab[] = ['general', 'danger'];
  protected readonly tab = signal<Tab>('general');
  // The danger zone acts immediately, so it has no save bar.
  protected readonly hasSaveBar = computed(() => this.canEdit() && this.tab() !== 'danger');
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly timezones = ['America/Sao_Paulo', 'UTC', 'America/New_York', 'Europe/London', 'Europe/Lisbon'];

  protected readonly confirmName = signal('');
  protected readonly deleteMessage = signal<string | null>(null);

  protected selectTab(tab: Tab, event: Event): void {
    this.tab.set(tab);
    (event.currentTarget as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  protected tabLabel(tab: Tab): string {
    return this.i18n.t(`settings.tab.${tab}`);
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected patchGeneral(change: Partial<OrganizationSettings['general']>): void {
    this.form.update((f) => f && { ...f, general: { ...f.general, ...change } });
  }

  protected save(): void {
    const form = this.form();
    if (!form) return;
    this.saving.set(true);
    this.saveError.set(null);
    this.api.updateSettings(form).subscribe({
      next: (updated) => {
        const previousSlug = this.org.slug();
        this.remote.set(updated);
        this.org.rename(updated.general.slug, updated.general.name);
        if (updated.general.slug !== previousSlug) {
          void this.router.navigateByUrl(this.org.url('/settings'), { replaceUrl: true });
        }
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        const key = SAVE_ERRORS[problemCode(err) ?? ''];
        this.saveError.set(key ? this.i18n.t(key) : (problemMessage(err) ?? this.i18n.t('api.saveError')));
      },
    });
  }

  protected cancel(): void {
    this.form.set(this.remote.value());
    this.saveError.set(null);
  }

  protected setConfirmName(event: Event): void {
    this.confirmName.set(this.value(event));
    this.deleteMessage.set(null);
  }

  protected deleteOrganization(): void {
    const slug = this.org.slug();
    this.api.deleteOrganization().subscribe({
      next: () => {
        void this.router.navigateByUrl('/organizations').then(() => slug && this.org.remove(slug));
      },
      error: (err) => this.deleteMessage.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }

  protected transferOwnership(): void {
    const member = this.candidates().find((m) => m.id === this.newOwner());
    if (!member || !confirm(this.i18n.t('team.transferConfirm').replace('{name}', member.name))) return;
    this.transferring.set(true);
    this.transferError.set(null);
    this.api.transferOwnership(member.id).subscribe({
      next: () => {
        this.transferring.set(false);
        this.newOwner.set('');
        void this.org.load(true);
      },
      error: (err) => {
        this.transferring.set(false);
        this.transferError.set(
          problemCode(err) === 'organization-limit'
            ? this.i18n.t('settings.transferLimit')
            : (problemMessage(err) ?? this.i18n.t('api.saveError')),
        );
      },
    });
  }

  protected leave(): void {
    const current = this.org.current();
    if (!current || !confirm(this.i18n.t('settings.leave.confirm').replace('{name}', current.name))) return;
    this.leaving.set(true);
    this.leaveError.set(null);
    this.api.leaveOrganization(current.slug).subscribe({
      next: () => {
        void this.router.navigateByUrl('/organizations').then(() => this.org.remove(current.slug));
      },
      error: (err) => {
        this.leaving.set(false);
        this.leaveError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }
}
