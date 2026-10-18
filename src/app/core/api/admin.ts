import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from './api';
import { Role } from './organization';
import { Feature } from './usage';

export interface AdminOrganization {
  slug: string;
  name: string;
  createdAt: string;
  ownerName: string | null;
  memberCount: number;
  repositoryCount: number;
  features: Feature[];
}

export interface AdminUser {
  /** Keycloak user id. */
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  createdAt: string | null;
  enabled: boolean;
  platformAdmin: boolean;
  organizations: { slug: string; name: string; role: Role }[];
}

export interface AdminUserPage {
  users: AdminUser[];
  /** Accounts matching the search; may exceed `users`. */
  total: number;
}

/** Largest page the API returns. */
export const ADMIN_USERS_MAX = 200;

export const adminUsersUrl = () => apiUrl('/admin/users');

export const adminOrganizationsUrl = () => apiUrl('/admin/organizations');
const adminOrganizationUrl = (slug: string) => `${adminOrganizationsUrl()}/${encodeURIComponent(slug)}`;

@Service()
export class AdminApi {
  private readonly http = inject(HttpClient);

  organization(slug: string): Observable<AdminOrganization> {
    return this.http.get<AdminOrganization>(adminOrganizationUrl(slug));
  }

  setFeatures(slug: string, features: Feature[]): Observable<AdminOrganization> {
    return this.http.put<AdminOrganization>(`${adminOrganizationUrl(slug)}/features`, { features });
  }

  /** Permanently deletes the organization and everything linked to it. */
  deleteOrganization(slug: string): Observable<void> {
    return this.http.delete<void>(adminOrganizationUrl(slug));
  }

  /** Permanently deletes the account at the identity provider and its memberships. */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${adminUsersUrl()}/${encodeURIComponent(id)}`);
  }
}
