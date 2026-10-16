import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18n, TranslationKey } from '../core/i18n';
import { LangSwitch } from '../shared/lang-switch';
import { Logo } from '../shared/logo';
import { ThemeToggle } from '../shared/theme-toggle';

interface NavItem {
  path: string;
  label: TranslationKey;
  icon: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo, LangSwitch, ThemeToggle],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly i18n = inject(I18n);

  protected readonly nav: NavItem[] = [
    { path: '/dashboard', label: 'nav.dashboard', icon: 'M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z' },
    { path: '/repositories', label: 'nav.repositories', icon: 'M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z' },
    { path: '/onboarding', label: 'nav.onboarding', icon: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z' },
  ];
}
