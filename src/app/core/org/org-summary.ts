import { httpResource } from '@angular/common/http';
import { Service, computed, inject } from '@angular/core';
import { DashboardSummary, dashboardUrl } from '../api/findings';
import { OrgContext } from './org-context';

/** Counts of the current organization, shared by the sidebar badges and the empty states. Reloaded by the shell on every navigation. */
@Service()
export class OrgSummary {
  private readonly org = inject(OrgContext);

  readonly summary = httpResource<DashboardSummary>(() => (this.org.slug() ? dashboardUrl() : undefined));
  readonly noRepositories = computed(() => this.summary.value()?.repositories === 0);

  reload(): void {
    this.summary.reload();
  }
}
