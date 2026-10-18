import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FEATURES, Feature, UsageOverview, usageUrl } from '../../core/api/usage';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';
import { LOCK_ICON } from '../../shared/role-notice';

/** Monthly scans of the organization and the optional features enabled for it. */
@Component({
  selector: 'app-usage',
  imports: [DatePipe, RequestState],
  templateUrl: './usage.html',
  styleUrl: './usage.scss',
})
export class Usage {
  protected readonly i18n = inject(I18n);
  protected readonly usage = httpResource<UsageOverview>(() => usageUrl());
  protected readonly features = FEATURES;
  protected readonly lock = LOCK_ICON;

  protected readonly percent = computed(() => {
    const u = this.usage.value();
    return u && u.scanLimit > 0 ? Math.min(100, (u.scansThisMonth / u.scanLimit) * 100) : 0;
  });

  protected name(feature: Feature): string {
    return this.i18n.t(`feature.${feature}`);
  }

  protected description(feature: Feature): string {
    return this.i18n.t(`feature.${feature}.desc`);
  }
}
