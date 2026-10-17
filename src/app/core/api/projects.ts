import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PipelineStage } from '../pipeline';
import { Stack } from '../domain';
import { apiUrl } from './api';
import { RunDetails } from './pipeline-runs';

/** `6h`, `24h` and `7d` are timed schedules (PRO); `push` needs webhooks (not available yet). */
export type ScanSchedule = 'manual' | 'push' | '6h' | '24h' | '7d';
export type AutomaticAction = 'issue' | 'email' | 'block';
export type DockerfileMode = 'recommended' | 'custom';

export interface ProjectSummary {
  id: string;
  name: string;
  url: string;
  branch: string;
  /** Null while automatic detection has not run yet (`stackSource: 'pending'`). */
  stack: Stack | null;
  /** `detected` = set from the repository files; `manual` = chosen by a user (never overridden). */
  stackSource: StackSource;
  /** Monorepo folders scanned on their own stack; empty scans the whole repository. */
  folders: ProjectFolder[];
  schedule: ScanSchedule;
  /** Next scheduled scan (UTC) for timed schedules; it runs only on plans with scheduled scans. */
  nextScanAt: string | null;
  lastScanAt: string | null;
  openFindings?: number;
  /** `ssh` = cloned with an Artemis-generated deploy key (every repository since SSH-only). */
  access: RepositoryAccessType;
  /** Result of the last access check (SSH only); `pending` until one succeeds. */
  accessStatus?: AccessStatus | null;
}

export type RepositoryAccessType = 'public' | 'ssh';
export type StackSource = 'pending' | 'detected' | 'manual';
export type AccessStatus = 'pending' | 'verified' | 'failed';
export type AccessCheckStatus = 'queued' | 'running' | 'ok' | 'failed';

export interface ManagedDeployKey {
  id: string;
  publicKey: string;
  fingerprint: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface AccessCheck {
  id: string;
  status: AccessCheckStatus;
  message: string | null;
  requestedAt: string;
  finishedAt: string | null;
}

export interface RepositoryAccess {
  type: RepositoryAccessType;
  deployKey?: ManagedDeployKey | null;
  host?: string;
  hostKeyFingerprint?: string | null;
  hostKeyPinned?: boolean;
  lastCheck?: AccessCheck | null;
}

export interface ProjectSettings {
  schedule: ScanSchedule;
  automaticActions: AutomaticAction[];
  dockerfileMode: DockerfileMode;
  customDockerfile: string | null;
  folders: ProjectFolder[];
  /** Published image scanned by the image stage, e.g. ghcr.io/acme/app:1.4; null skips that stage. */
  containerImage: string | null;
  /** Stack of a non-monorepo repository; changing it makes it a manual choice. */
  stack?: Stack | null;
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
  /** Null = detect automatically after the first successful access check. */
  stack: Stack | null;
  settings: ProjectSettings;
  pipeline: StageUpdate[];
}

type StageUpdate = Pick<PipelineStage, 'id' | 'enabled' | 'tool' | 'failOn'>;

export const DEFAULT_SETTINGS: ProjectSettings = {
  schedule: 'manual',
  automaticActions: ['issue', 'email'],
  dockerfileMode: 'recommended',
  customDockerfile: null,
  folders: [],
  containerImage: null,
};

export const repositoriesUrl = () => apiUrl('/repositories');
export const repositoryUrl = (name: string) => apiUrl(`/repositories/${encodeURIComponent(name)}`);
export const repositoryAccessUrl = (name: string) => `${repositoryUrl(name)}/access`;
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
  runScan(name: string, folders?: string[]): Observable<RunDetails> {
    return this.http.post<RunDetails>(`${repositoryUrl(name)}/scans`, folders ? { folders } : null);
  }

  rotateKey(name: string): Observable<RepositoryAccess> {
    return this.http.post<RepositoryAccess>(`${repositoryUrl(name)}/access/key`, null);
  }

  checkAccess(name: string): Observable<RepositoryAccess> {
    return this.http.post<RepositoryAccess>(`${repositoryUrl(name)}/access/checks`, null);
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
