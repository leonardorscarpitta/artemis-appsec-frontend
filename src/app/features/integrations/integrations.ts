import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
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
import { OrgContext } from '../../core/org/org-context';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { RoleNotice } from '../../shared/role-notice';
import { Unavailable } from '../../shared/unavailable';
import { OrgLink } from '../../shared/org-link';
import { VULN_DATA_SOURCES } from './vuln-data-sources';

const CATEGORIES: IntegrationCategory[] = ['scm', 'ci', 'notifications', 'issues', 'vulnData'];

@Component({
  selector: 'app-integrations',
  imports: [DatePipe, RequestState, RoleNotice, RouterLink, OrgLink, Unavailable],
  templateUrl: './integrations.html',
  styleUrl: './integrations.scss',
})
export class Integrations {
  protected readonly i18n = inject(I18n);
  protected readonly org = inject(OrgContext);
  protected readonly canManage = computed(() => this.org.can('integrations'));
  private readonly api = inject(OrganizationApi);

  protected readonly integrations = httpResource<Integration[]>(() => integrationsUrl(), { defaultValue: [] });
  protected readonly keys = httpResource<DeployKey[]>(() => deployKeysUrl(), { defaultValue: [] });

  protected readonly sources = computed(() => VULN_DATA_SOURCES[this.i18n.lang()]);

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

  protected revoke(id: string): void {
    if (!confirm(this.i18n.t('int.keys.revokeConfirm'))) return;
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
