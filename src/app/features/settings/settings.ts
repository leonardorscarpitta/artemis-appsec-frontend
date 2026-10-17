import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { problemCode, problemMessage } from '../../core/api/api';
import { BillingOverview, billingUrl } from '../../core/api/billing';
import {
  ApiToken,
  NotificationChannel,
  NotificationEvent,
  OrganizationApi,
  OrganizationSettings,
  RetentionPeriod,
  SessionTimeout,
  TokenScope,
  Member,
  apiTokensUrl,
  membersUrl,
  organizationSettingsUrl,
} from '../../core/api/organization';
import { I18n, TranslationKey } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { RoleNotice } from '../../shared/role-notice';
import { Unavailable } from '../../shared/unavailable';
import { Router } from '@angular/router';
import { OrgContext } from '../../core/org/org-context';
import { slugify } from '../../core/org/slug';

type Tab = 'general' | 'auth' | 'notifications' | 'tokens' | 'retention' | 'danger';
type RetentionField = keyof OrganizationSettings['retention'];

const SAVE_ERRORS: Record<string, TranslationKey> = {
  'plan-required': 'settings.renamePro',
  'slug-taken': 'orgs.error.slugTaken',
  'slug-reserved': 'orgs.error.slugReserved',
};

const SCOPES: TokenScope[] = ['findings:read', 'scans:write', 'reports:read', 'pipelines:write'];

@Component({
  selector: 'app-settings',
  imports: [DatePipe, RequestState, RoleNotice, Unavailable],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(OrganizationApi);
  protected readonly org = inject(OrgContext);
  private readonly router = inject(Router);
  protected readonly canEdit = computed(() => this.org.can('team'));
  protected readonly canManageTokens = computed(() => this.org.can('integrations'));
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
  // Renaming changes the slug (and every URL), so it is a PRO feature.
  private readonly billing = httpResource<BillingOverview>(() => billingUrl());
  protected readonly canRename = computed(() => this.billing.value()?.entitlements.includes('organizationRename') ?? false);
  protected readonly slugPreview = computed(() => {
    const f = this.form();
    if (!f) return '';
    return f.general.name.trim() === this.remote.value()?.general.name ? f.general.slug : slugify(f.general.name);
  });

  protected readonly tabs: Tab[] = ['general', 'auth', 'notifications', 'tokens', 'retention', 'danger'];
  protected readonly tab = signal<Tab>('general');
  // Tokens and deletion act immediately, so they have no save bar.
  protected readonly hasSaveBar = computed(() => this.canEdit() && !['tokens', 'danger'].includes(this.tab()));
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly timezones = ['America/Sao_Paulo', 'UTC', 'America/New_York', 'Europe/London', 'Europe/Lisbon'];
  protected readonly sessions: SessionTimeout[] = ['1h', '8h', '24h', '7d'];

  protected readonly events: NotificationEvent[] = ['criticalCve', 'pipelineFailed', 'weeklyReport', 'slaBreach'];
  protected readonly channels: { id: NotificationChannel; label: string }[] = [
    { id: 'email', label: 'E-mail' },
    { id: 'slack', label: 'Slack' },
    { id: 'teams', label: 'Microsoft Teams' },
  ];

  protected readonly scopes = SCOPES;
  protected readonly tokens = httpResource<ApiToken[]>(() => apiTokensUrl(), { defaultValue: [] });
  protected readonly creatingToken = signal(false);
  protected readonly newToken = signal<string | null>(null);
  protected readonly copied = signal(false);
  protected readonly tokenError = signal<string | null>(null);

  protected readonly retention: { key: TranslationKey; field: RetentionField }[] = [
    { key: 'settings.retention.findings', field: 'findings' },
    { key: 'settings.retention.logs', field: 'logs' },
    { key: 'settings.retention.reports', field: 'reports' },
  ];
  protected readonly retentionOptions: RetentionPeriod[] = ['90', '180', '365', '730', 'forever'];

  protected readonly confirmName = signal('');
  protected readonly deleteMessage = signal<string | null>(null);

  protected selectTab(tab: Tab, event: Event): void {
    this.tab.set(tab);
    (event.currentTarget as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  protected tabLabel(tab: Tab): string {
    return this.i18n.t(`settings.tab.${tab}`);
  }

  protected eventLabel(event: NotificationEvent): string {
    return this.i18n.t(`settings.notif.${event}`);
  }

  protected sessionLabel(session: SessionTimeout): string {
    return this.i18n.t(`settings.auth.session.${session}`);
  }

  protected retentionLabel(option: RetentionPeriod): string {
    return this.i18n.t(`settings.retention.${option}`);
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected patchGeneral(change: Partial<OrganizationSettings['general']>): void {
    this.form.update((f) => f && { ...f, general: { ...f.general, ...change } });
  }

  protected patchAuth(change: Partial<OrganizationSettings['authentication']>): void {
    this.form.update((f) => f && { ...f, authentication: { ...f.authentication, ...change } });
  }

  protected setRetention(field: RetentionField, event: Event): void {
    const period = this.value(event) as RetentionPeriod;
    this.form.update((f) => f && { ...f, retention: { ...f.retention, [field]: period } });
  }

  protected notifies(event: NotificationEvent, channel: NotificationChannel): boolean {
    return this.form()?.notifications.some((n) => n.event === event && n.channel === channel) ?? false;
  }

  protected toggleNotification(event: NotificationEvent, channel: NotificationChannel): void {
    this.form.update((f) => {
      if (!f) return f;
      const others = f.notifications.filter((n) => !(n.event === event && n.channel === channel));
      const notifications = this.notifies(event, channel) ? others : [...others, { event, channel }];
      return { ...f, notifications };
    });
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

  protected createToken(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    this.tokenError.set(null);
    this.api
      .createToken(
        String(data.get('name') ?? '').trim(),
        data.getAll('scopes').map(String) as TokenScope[],
        Number(data.get('expiry')),
      )
      .subscribe({
        next: (created) => {
          this.tokens.update((list) => [...list, created.token]);
          this.newToken.set(created.secret);
          this.creatingToken.set(false);
          form.reset();
        },
        error: (err) => this.tokenError.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
      });
  }

  protected async copyToken(): Promise<void> {
    await navigator.clipboard.writeText(this.newToken() ?? '');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  protected dismissToken(): void {
    this.newToken.set(null);
    this.copied.set(false);
  }

  protected revokeToken(id: string): void {
    this.tokenError.set(null);
    this.api.revokeToken(id).subscribe({
      next: () => this.tokens.update((list) => list.filter((t) => t.id !== id)),
      error: (err) => this.tokenError.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
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
          problemCode(err) === 'free-organization-limit'
            ? this.i18n.t('settings.transferFreeLimit')
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
