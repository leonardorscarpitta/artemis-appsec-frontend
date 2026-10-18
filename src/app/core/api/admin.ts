import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from './api';
import { Feature } from './usage';

/** Metadata only: administrators never see an organization's repositories, findings or members. */
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

@Service()
export class AdminApi {
  private readonly http = inject(HttpClient);

  setFeatures(slug: string, features: Feature[]): Observable<AdminOrganization> {
    return this.http.put<AdminOrganization>(`${adminOrganizationsUrl()}/${encodeURIComponent(slug)}/features`, { features });
  }
}
