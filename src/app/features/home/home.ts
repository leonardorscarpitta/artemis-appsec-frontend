import { ViewportScroller } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLAN_FEATURES, Plan, PlanId, formatPrice, plansUrl } from '../../core/api/billing';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { SeverityBadge } from '../../shared/severity-badge';
import { ThemeToggle } from '../../shared/theme-toggle';
import { HOME } from './home-content';
import { HomeWorkspace } from './home-workspace';
import { HOME_PREVIEW } from './home-preview';
import { UserBadge } from '../../shared/user-badge';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Logo, LangSwitch, ThemeToggle, SeverityBadge, UserBadge, HomeWorkspace],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);
  protected readonly c = computed(() => HOME[this.i18n.lang()]);
  protected readonly plans = httpResource<Plan[]>(() => plansUrl());
  protected readonly planFeatures = PLAN_FEATURES;

  protected readonly preview = HOME_PREVIEW;

  constructor() {
    inject(ViewportScroller).setOffset([0, 80]);
  }

  protected planName(id: PlanId): string {
    return this.i18n.t(`billing.plan.${id}`);
  }

  protected tagline(id: PlanId): string {
    return this.i18n.t(`billing.plan.${id}.tagline`);
  }

  protected price(plan: Plan): string {
    return formatPrice(plan, this.i18n.lang());
  }

  protected scans(plan: Plan): string {
    return this.i18n.t('billing.f.scans').replace('{n}', String(plan.monthlyScanLimit));
  }
}
