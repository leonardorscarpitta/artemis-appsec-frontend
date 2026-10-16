import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18n, TranslationKey } from '../core/i18n';
import { FINDINGS, REPOSITORIES } from '../core/mock-data';
import { LangSwitch } from '../shared/lang-switch';
import { Logo } from '../shared/logo';
import { ThemeToggle } from '../shared/theme-toggle';

interface NavItem {
  path: string;
  label: TranslationKey;
  icon: string;
  count?: number;
  alert?: boolean;
}

interface NavGroup {
  label: TranslationKey;
  items: NavItem[];
}

const ICONS = {
  dashboard: 'M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z',
  bug: 'M20 8h-2.8a6 6 0 0 0-1.8-2L17 4.4 15.6 3l-2.2 2.2a6 6 0 0 0-2.8 0L8.4 3 7 4.4 8.6 6a6 6 0 0 0-1.8 2H4v2h2.1a6 6 0 0 0-.1 1v1H4v2h2v1a6 6 0 0 0 .1 1H4v2h2.8a6 6 0 0 0 10.4 0H20v-2h-2.1a6 6 0 0 0 .1-1v-1h2v-2h-2v-1a6 6 0 0 0-.1-1H20zm-6 8h-4v-2h4zm0-4h-4v-2h4z',
  folder: 'M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z',
  pipeline: 'M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z',
  report: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z',
  plug: 'M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5a2.7 2.7 0 0 1 0 5.4H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.7 2.7 0 0 1 5.4 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5',
  shield: 'M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5z',
  team: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6m0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13m8 0-1 .1c1.2.8 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5',
  gear: 'M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L14 3h-4l-.4 2.9a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L5.5 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L10 21h4l.4-2.9a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7',
};

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Logo, LangSwitch, ThemeToggle],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly i18n = inject(I18n);

  protected readonly usage = { used: 142, limit: 500 };

  protected readonly groups: NavGroup[] = [
    {
      label: 'nav.overview',
      items: [{ path: '/dashboard', label: 'nav.dashboard', icon: ICONS.dashboard }],
    },
    {
      label: 'nav.group.security',
      items: [
        {
          path: '/vulnerabilities',
          label: 'nav.vulnerabilities',
          icon: ICONS.bug,
          count: FINDINGS.filter((f) => f.status === 'open').length,
          alert: true,
        },
        { path: '/repositories', label: 'nav.repositories', icon: ICONS.folder, count: REPOSITORIES.length },
        { path: '/pipelines', label: 'nav.pipelines', icon: ICONS.pipeline },
        { path: '/reports', label: 'nav.reports', icon: ICONS.report },
      ],
    },
    {
      label: 'nav.group.config',
      items: [
        { path: '/integrations', label: 'nav.integrations', icon: ICONS.plug },
        { path: '/policies', label: 'nav.policies', icon: ICONS.shield },
        { path: '/team', label: 'nav.team', icon: ICONS.team },
        { path: '/settings', label: 'nav.settings', icon: ICONS.gear },
      ],
    },
  ];
}
