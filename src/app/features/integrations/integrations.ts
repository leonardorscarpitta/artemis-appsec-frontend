import { Component, computed, inject, signal } from '@angular/core';
import { I18n } from '../../core/i18n';
import { REPOSITORIES } from '../../core/mock-data';
import {
  DEPLOY_KEYS,
  DeployKey,
  INTEGRATIONS,
  Integration,
  IntegrationCategory,
  IntegrationStatus,
} from '../../core/mock-org';

const CATEGORIES: IntegrationCategory[] = ['scm', 'ci', 'notifications', 'issues', 'vulnData'];

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.html',
  styleUrl: './integrations.scss',
})
export class Integrations {
  protected readonly i18n = inject(I18n);

  protected readonly integrations = signal<Integration[]>(INTEGRATIONS);
  protected readonly keys = signal<DeployKey[]>(DEPLOY_KEYS);
  protected readonly repositories = REPOSITORIES.map((r) => r.name);
  protected readonly adding = signal(false);

  protected readonly groups = computed(() =>
    CATEGORIES.map((category) => ({
      category,
      label: this.i18n.t(`int.cat.${category}`),
      items: this.integrations().filter((i) => i.category === category),
    })),
  );

  protected desc(item: Integration): string {
    return this.i18n.t(`int.desc.${item.id}`);
  }

  protected statusLabel(status: IntegrationStatus): string {
    return this.i18n.t(`int.status.${status}`);
  }

  protected setStatus(id: string, status: IntegrationStatus): void {
    this.integrations.update((list) =>
      list.map((i) => (i.id === id ? { ...i, status, detail: status === 'connected' ? i.detail : undefined } : i)),
    );
  }

  protected addKey(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    if (!name) return;
    this.keys.update((keys) => [
      ...keys,
      {
        id: crypto.randomUUID(),
        name,
        fingerprint: 'SHA256:' + btoa(crypto.randomUUID()).replace(/=/g, '').slice(0, 43),
        repository: String(data.get('repository')),
        added: '2026-10-16',
        lastUsed: '',
      },
    ]);
    form.reset();
    this.adding.set(false);
  }

  protected revoke(id: string): void {
    this.keys.update((keys) => keys.filter((k) => k.id !== id));
  }
}
