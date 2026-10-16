import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PipelineStage } from '../pipeline';
import { Stack } from '../domain';
import { apiUrl } from './api';
import { RunDetails } from './pipeline-runs';

export type ScanSchedule = 'push' | '6h' | '24h' | '7d';
export type AutomaticAction = 'issue' | 'email' | 'block';
export type DockerfileMode = 'recommended' | 'custom';

export interface ProjectSummary {
  id: string;
  name: string;
  url: string;
  branch: string;
  stack: Stack;
  /** Monorepo folders scanned on their own stack; empty scans the whole repository. */
  folders: ProjectFolder[];
  schedule: ScanSchedule;
  lastScanAt: string | null;
  openFindings?: number;
}

export interface ProjectSettings {
  schedule: ScanSchedule;
  automaticActions: AutomaticAction[];
  dockerfileMode: DockerfileMode;
  customDockerfile: string | null;
  folders: ProjectFolder[];
}

/** `stack` is null only while the user has not picked one in the form. */
export interface ProjectFolder {
  path: string;
  stack: Stack | null;
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
  folders: [],
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

  /** Queues a scan of the repository's default branch; 409 when the monthly scan limit is reached. */
  runScan(name: string): Observable<RunDetails> {
    return this.http.post<RunDetails>(`${repositoryUrl(name)}/scans`, null);
  }

  /** Removes the repository with its findings, runs and reports. */
  remove(name: string): Observable<void> {
    return this.http.delete<void>(repositoryUrl(name));
  }

  updatePipeline(name: string, stages: PipelineStage[]): Observable<ProjectDetails> {
    return this.http.put<ProjectDetails>(`${repositoryUrl(name)}/pipeline`, stages.map(toStageUpdate));
  }
}

export function toStageUpdate({ id, enabled, tool, failOn }: PipelineStage): StageUpdate {
  return { id, enabled, tool, failOn };
}
