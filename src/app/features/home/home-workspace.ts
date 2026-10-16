import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Member, OrganizationSettings, membersUrl, organizationSettingsUrl } from '../../core/api/organization';
import { ProjectSummary, repositoriesUrl } from '../../core/api/projects';
import { Auth } from '../../core/auth/auth';
import { I18n } from '../../core/i18n';
import { RequestState } from '../../shared/request-state';

/** Shortcuts into the signed-in user's organization and projects, shown on the public home page. */
@Component({
  selector: 'app-home-workspace',
  imports: [RouterLink, DatePipe, RequestState],
  templateUrl: './home-workspace.html',
  styleUrl: './home-workspace.scss',
})
export class HomeWorkspace {
  protected readonly i18n = inject(I18n);
  protected readonly auth = inject(Auth);

  protected readonly org = httpResource<OrganizationSettings>(() => organizationSettingsUrl());
  protected readonly members = httpResource<Member[]>(() => membersUrl());
  protected readonly projects = httpResource<ProjectSummary[]>(() => repositoriesUrl());

  protected readonly firstName = computed(() => this.auth.profile()?.name.split(/\s+/)[0] ?? '');
  protected readonly slug = computed(() => this.org.value()?.general.slug);
  protected readonly activeMembers = computed(() => this.members.value()?.filter((m) => m.active).length ?? 0);
  protected readonly myRole = computed(() => {
    const email = this.auth.profile()?.email?.toLowerCase();
    const role = this.members.value()?.find((m) => m.email.toLowerCase() === email)?.role;
    return role ? this.i18n.t(`team.role.${role}`) : null;
  });
  protected readonly totalOpen = computed(() =>
    (this.projects.value() ?? []).reduce((sum, p) => sum + (p.openFindings ?? 0), 0),
  );
}
