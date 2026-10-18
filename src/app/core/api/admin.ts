import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from './api';
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
}
