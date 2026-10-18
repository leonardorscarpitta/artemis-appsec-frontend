import { DatePipe } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { problemMessage } from '../../core/api/api';
import { ADMIN_USERS_MAX, AdminApi, AdminUser, AdminUserPage, adminUsersUrl } from '../../core/api/admin';
import { Role } from '../../core/api/organization';
import { Auth } from '../../core/auth/auth';
import { I18n, TranslationKey } from '../../core/i18n';
import { Paginator, paginate } from '../../shared/paginator';
import { RequestState } from '../../shared/request-state';

/** Platform administration → Users: accounts of the identity provider, their organizations and deletion. */
@Component({
  selector: 'app-admin-users',
  imports: [RouterLink, DatePipe, Paginator, RequestState],
  templateUrl: './admin-users.html',
  styleUrl: './admin.scss',
})
export class AdminUsers {
  protected readonly i18n = inject(I18n);
  private readonly auth = inject(Auth);
  private readonly api = inject(AdminApi);

  /** Search sent to the API (debounced from the input). */
  private readonly search = signal('');
  protected readonly users = httpResource<AdminUserPage>(() => ({
    url: adminUsersUrl(),
    params: { search: this.search(), max: ADMIN_USERS_MAX },
  }));
  protected readonly rows = computed(() => (this.users.hasValue() ? this.users.value().users : []));
  protected readonly truncated = computed(() => this.users.hasValue() && this.users.value().total > this.rows().length);
  protected readonly pager = paginate(this.rows, this.search);
  protected readonly notConfigured = computed(() => {
    const error = this.users.error();
    return error instanceof HttpErrorResponse && error.status === 503 && error.error?.code === 'user-management-disabled';
  });

  protected readonly deleting = signal<AdminUser | null>(null);
  protected readonly confirmName = signal('');
  protected readonly busy = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.search.set(value), 300);
  }

  protected roleName(role: Role): string {
    return this.i18n.t(`team.role.${role}` as TranslationKey);
  }

  protected owned(user: AdminUser): string[] {
    return user.organizations.filter((o) => o.role === 'owner').map((o) => o.slug);
  }

  /** Why the account can't be deleted, or null. */
  protected blocked(user: AdminUser): string | null {
    if (user.id === this.auth.profile()?.subject) return this.i18n.t('admin.users.blockedSelf');
    if (user.platformAdmin) return this.i18n.t('admin.users.blockedAdmin');
    const owned = this.owned(user);
    return owned.length ? this.i18n.t('admin.users.blockedOwner').replace('{orgs}', owned.join(', ')) : null;
  }

  protected openDelete(user: AdminUser, dialog: HTMLDialogElement): void {
    this.deleting.set(user);
    this.confirmName.set('');
    this.deleteError.set(null);
    dialog.showModal();
  }

  protected closeDelete(): void {
    this.deleting.set(null);
  }

  protected setConfirmName(event: Event): void {
    this.confirmName.set((event.target as HTMLInputElement).value.trim());
  }

  protected confirmDelete(dialog: HTMLDialogElement): void {
    const user = this.deleting();
    if (!user || this.confirmName() !== user.username) return;
    this.busy.set(true);
    this.deleteError.set(null);
    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.busy.set(false);
        this.users.update((page) => page && { users: page.users.filter((u) => u.id !== user.id), total: page.total - 1 });
        dialog.close();
      },
      error: (error: unknown) => {
        this.busy.set(false);
        this.deleteError.set(problemMessage(error) ?? this.i18n.t('api.saveError'));
      },
    });
  }
}
