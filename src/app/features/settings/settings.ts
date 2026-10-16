import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n, TranslationKey } from '../../core/i18n';
import { API_TOKENS, ApiToken, ORG } from '../../core/mock-org';

type Tab = 'general' | 'auth' | 'notifications' | 'tokens' | 'retention' | 'danger';
type NotifEvent = 'criticalCve' | 'pipelineFailed' | 'weeklyReport' | 'slaBreach';
type RetentionOption = '90' | '180' | '365' | '730' | 'forever';

const SCOPES = ['findings:read', 'scans:write', 'reports:read', 'pipelines:write'];

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected readonly i18n = inject(I18n);

  protected readonly org = ORG;
  protected readonly tabs: Tab[] = ['general', 'auth', 'notifications', 'tokens', 'retention', 'danger'];
  protected readonly tab = signal<Tab>('general');
  // Tokens and deletion act immediately, so they have no save bar.
  protected readonly hasSaveBar = computed(() => !['tokens', 'danger'].includes(this.tab()));
  protected readonly saved = signal(false);

  protected readonly timezones = ['America/Sao_Paulo', 'UTC', 'America/New_York', 'Europe/London', 'Europe/Lisbon'];
  protected readonly sessions: TranslationKey[] = [
    'settings.auth.session.1h',
    'settings.auth.session.8h',
    'settings.auth.session.24h',
    'settings.auth.session.7d',
  ];
  protected readonly enforceSso = signal(true);

  protected readonly events: NotifEvent[] = ['criticalCve', 'pipelineFailed', 'weeklyReport', 'slaBreach'];
  protected readonly channels = ['E-mail', 'Slack', 'Microsoft Teams'];
  protected readonly notifications = signal<Record<string, boolean>>({
    'criticalCve:E-mail': true,
    'criticalCve:Slack': true,
    'pipelineFailed:Slack': true,
    'weeklyReport:E-mail': true,
    'slaBreach:E-mail': true,
    'slaBreach:Slack': true,
  });

  protected readonly scopes = SCOPES;
  protected readonly tokens = signal<ApiToken[]>(API_TOKENS);
  protected readonly creatingToken = signal(false);
  protected readonly newToken = signal<string | null>(null);
  protected readonly copied = signal(false);

  protected readonly retention: { key: TranslationKey; value: string }[] = [
    { key: 'settings.retention.findings', value: '730' },
    { key: 'settings.retention.logs', value: '90' },
    { key: 'settings.retention.reports', value: 'forever' },
  ];
  protected readonly retentionOptions: RetentionOption[] = ['90', '180', '365', '730', 'forever'];

  protected readonly confirmName = signal('');
  protected readonly deleteRequested = signal(false);

  protected selectTab(tab: Tab, event: Event): void {
    this.tab.set(tab);
    (event.currentTarget as HTMLElement).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  protected tabLabel(tab: Tab): string {
    return this.i18n.t(`settings.tab.${tab}`);
  }

  protected eventLabel(event: NotifEvent): string {
    return this.i18n.t(`settings.notif.${event}`);
  }

  protected retentionLabel(option: RetentionOption): string {
    return this.i18n.t(`settings.retention.${option}`);
  }

  protected toggleNotification(key: string): void {
    this.notifications.update((n) => ({ ...n, [key]: !n[key] }));
  }

  protected save(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  protected createToken(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    if (!name) return;
    const days = Number(data.get('expiry'));
    this.tokens.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        name,
        scopes: data.getAll('scopes').map(String),
        created: '2026-10-16',
        expires: days === 30 ? '2026-11-15' : days === 90 ? '2027-01-14' : '2027-10-16',
        lastUsed: '',
      },
    ]);
    this.newToken.set('art_' + crypto.randomUUID().replace(/-/g, ''));
    this.creatingToken.set(false);
    form.reset();
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
    this.tokens.update((list) => list.filter((t) => t.id !== id));
  }

  protected setConfirmName(event: Event): void {
    this.confirmName.set((event.target as HTMLInputElement).value);
    this.deleteRequested.set(false);
  }
}
