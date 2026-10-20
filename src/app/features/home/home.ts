import { NgTemplateOutlet, ViewportScroller } from '@angular/common';
import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { OrgContext, landingUrl } from '../../core/org/org-context';
import { LangSwitch } from '../../shared/lang-switch';
import { Logo } from '../../shared/logo';
import { SeverityBadge } from '../../shared/severity-badge';
import { ThemeToggle } from '../../shared/theme-toggle';
import { HOME } from './home-content';
import { PlatformLimits } from '../../core/api/limits';
import { HomeWorkspace } from './home-workspace';
import { HOME_PREVIEW } from './home-preview';
import { UserBadge } from '../../shared/user-badge';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgTemplateOutlet, Logo, LangSwitch, ThemeToggle, SeverityBadge, UserBadge, HomeWorkspace],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);
  private readonly limits = inject(PlatformLimits);
  protected readonly c = computed(() => this.limits.fill(HOME[this.i18n.lang()]));

  protected readonly preview = HOME_PREVIEW;
  private readonly org = inject(OrgContext);
  protected readonly appLink = computed(() => {
    const orgs = this.org.organizations();
    return orgs ? landingUrl(orgs, null) : '/organizations';
  });

  private readonly about = viewChild<ElementRef<HTMLDetailsElement>>('about');

  constructor() {
    const scroller = inject(ViewportScroller);
    scroller.setOffset([0, 80]);
    // Signed-in users see the presentation collapsed: links to its sections (footer, FAQ…) open it first.
    inject(ActivatedRoute)
      .fragment.pipe(takeUntilDestroyed())
      .subscribe((fragment) => {
        const details = this.about()?.nativeElement;
        if (fragment && details && !details.open) {
          details.open = true;
          setTimeout(() => scroller.scrollToAnchor(fragment));
        }
      });
  }

  protected register(): void {
    this.auth.register().catch((error) => console.error('Could not reach the identity provider', error));
  }
}
