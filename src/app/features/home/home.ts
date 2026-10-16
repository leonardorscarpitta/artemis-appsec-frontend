import { ViewportScroller } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  protected readonly preview = HOME_PREVIEW;

  constructor() {
    inject(ViewportScroller).setOffset([0, 80]);
  }
}
