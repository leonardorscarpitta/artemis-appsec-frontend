import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { problemMessage } from '../../core/api/api';
import {
  DeployKey,
  Integration,
  IntegrationCategory,
  IntegrationId,
  IntegrationStatus,
  OrganizationApi,
  deployKeysUrl,
  integrationsUrl,
} from '../../core/api/organization';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';

const CATEGORIES: IntegrationCategory[] = ['scm', 'ci', 'notifications', 'issues', 'vulnData'];

@Component({
  selector: 'app-integrations',
  imports: [DatePipe, RequestState],
  templateUrl: './integrations.html',
  styleUrl: './integrations.scss',
})
export class Integrations {
  protected readonly i18n = inject(I18n);
  private readonly api = inject(OrganizationApi);

  protected readonly integrations = httpResource<Integration[]>(() => integrationsUrl(), { defaultValue: [] });
  protected readonly keys = httpResource<DeployKey[]>(() => deployKeysUrl(), { defaultValue: [] });
  private readonly projects = httpResource<ProjectSummary[]>(() => repositoriesUrl(), { defaultValue: [] });
  protected readonly repositories = computed(() => this.projects.value().map((p) => p.name));

  protected readonly adding = signal(false);
  protected readonly editing = signal<IntegrationId | null>(null);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly keyError = signal<string | null>(null);

  protected readonly groups = computed(() =>
    CATEGORIES.map((category) => ({
      category,
      label: this.i18n.t(`int.cat.${category}`),
      items: this.integrations.value().filter((i) => i.category === category),
    })),
  );

  protected desc(item: Integration): string {
    return this.i18n.t(`int.desc.${item.id}`);
  }

  protected statusLabel(status: IntegrationStatus): string {
    return this.i18n.t(`int.status.${status}`);
  }

  protected connect(id: IntegrationId): void {
    this.apply(this.api.connect(id));
  }

  protected disconnect(id: IntegrationId): void {
    this.apply(this.api.disconnect(id));
  }

  protected saveDetail(id: IntegrationId, event: SubmitEvent): void {
    event.preventDefault();
    const detail = String(new FormData(event.target as HTMLFormElement).get('detail') ?? '');
    this.apply(this.api.configure(id, detail), () => this.editing.set(null));
  }

  protected addKey(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    this.busy.set(true);
    this.keyError.set(null);
    this.api
      .addDeployKey({
        name: String(data.get('name') ?? '').trim(),
        repository: String(data.get('repository') ?? ''),
        publicKey: String(data.get('publicKey') ?? '').trim(),
      })
      .subscribe({
        next: (key) => {
          this.keys.update((keys) => [...keys, key]);
          form.reset();
          this.adding.set(false);
          this.busy.set(false);
        },
        error: (err) => {
          this.busy.set(false);
          this.keyError.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
        },
      });
  }

  protected revoke(id: string): void {
    this.keyError.set(null);
    this.api.revokeDeployKey(id).subscribe({
      next: () => this.keys.update((keys) => keys.filter((k) => k.id !== id)),
      error: (err) => this.keyError.set(problemMessage(err) ?? this.i18n.t('api.saveError')),
    });
  }

  private apply(request: Observable<Integration>, done?: () => void): void {
    this.busy.set(true);
    this.error.set(null);
    request.subscribe({
      next: (updated) => {
        this.integrations.update((list) => list.map((i) => (i.id === updated.id ? updated : i)));
        this.busy.set(false);
        done?.();
      },
      error: (err) => {
        this.busy.set(false);
        this.error.set(problemMessage(err) ?? this.i18n.t('api.saveError'));
      },
    });
  }
}
