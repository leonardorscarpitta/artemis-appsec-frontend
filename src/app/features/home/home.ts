import { ViewportScroller } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n';
import { FINDINGS, REPOSITORIES, severityOf } from '../../core/mock-data';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { SeverityBadge } from '../../shared/severity-badge';
import { ThemeToggle } from '../../shared/theme-toggle';
import { HOME } from './home-content';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Logo, LangSwitch, ThemeToggle, SeverityBadge],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly i18n = inject(I18n);
  protected readonly c = computed(() => HOME[this.i18n.lang()]);

  private readonly open = FINDINGS.filter((f) => f.status === 'open' || f.status === 'triaged');
  protected readonly preview = {
    open: this.open.length,
    critical: this.open.filter((f) => severityOf(f.cvss) === 'critical').length,
    avg: (this.open.reduce((sum, f) => sum + f.cvss, 0) / (this.open.length || 1)).toFixed(1),
    repos: REPOSITORIES.length,
    rows: [...this.open].sort((a, b) => b.cvss - a.cvss).slice(0, 4),
  };

  constructor() {
    inject(ViewportScroller).setOffset([0, 80]);
  }
}
