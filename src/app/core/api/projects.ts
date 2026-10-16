import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PipelineStage } from '../pipeline';
import { Stack } from '../mock-data';
import { apiUrl } from './api';

export type ScanSchedule = 'push' | '6h' | '24h' | '7d';
export type AutomaticAction = 'issue' | 'email' | 'block';
export type DockerfileMode = 'recommended' | 'custom';

export interface ProjectSummary {
  id: string;
  name: string;
  url: string;
  branch: string;
  stack: Stack;
  schedule: ScanSchedule;
  lastScanAt: string | null;
  openFindings?: number;
}

export interface ProjectSettings {
  schedule: ScanSchedule;
  automaticActions: AutomaticAction[];
  dockerfileMode: DockerfileMode;
  customDockerfile: string | null;
}

export interface ProjectDetails {
  project: ProjectSummary;
  settings: ProjectSettings;
  pipeline: PipelineStage[];
}

export interface CreateProject {
  url: string;
  branch: string;
  stack: Stack;
  settings: ProjectSettings;
  pipeline: StageUpdate[];
}

type StageUpdate = Pick<PipelineStage, 'id' | 'enabled' | 'tool' | 'failOn'>;

export const DEFAULT_SETTINGS: ProjectSettings = {
  schedule: '24h',
  automaticActions: ['issue', 'email'],
  dockerfileMode: 'recommended',
  customDockerfile: null,
};

export const repositoriesUrl = () => apiUrl('/repositories');
export const repositoryUrl = (name: string) => apiUrl(`/repositories/${encodeURIComponent(name)}`);
export const stageCatalogUrl = () => apiUrl('/pipeline/stages');

@Service()
export class ProjectsApi {
  private readonly http = inject(HttpClient);

  create(body: CreateProject): Observable<ProjectDetails> {
    return this.http.post<ProjectDetails>(repositoriesUrl(), body);
  }

  updateSettings(name: string, settings: ProjectSettings): Observable<ProjectDetails> {
    return this.http.put<ProjectDetails>(`${repositoryUrl(name)}/settings`, settings);
  }

  updatePipeline(name: string, stages: PipelineStage[]): Observable<ProjectDetails> {
    return this.http.put<ProjectDetails>(`${repositoryUrl(name)}/pipeline`, stages.map(toStageUpdate));
  }
}

export function toStageUpdate({ id, enabled, tool, failOn }: PipelineStage): StageUpdate {
  return { id, enabled, tool, failOn };
}
