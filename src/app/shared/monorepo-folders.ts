import { Component, inject, input, linkedSignal, model } from '@angular/core';
import { ProjectFolder } from '../core/api/projects';
import { Stack } from '../core/domain';
import { I18n } from '../core/i18n';

export const STACKS: Stack[] = ['React', 'Angular', 'Java + Spring', 'Python + Flask', 'Python + FastAPI', 'Python + Django'];
const MAX_FOLDERS = 20;
/** Relative folder such as `frontend` or `apps/web`; no `.`/`..` segments (same rule as the API). */
const FOLDER_PATH = /^(?!\.{1,2}(\/|$))(?!.*\/\.{1,2}(\/|$))[\w.-]+(\/[\w.-]+)*$/;

export function normalizeFolder(path: string): string {
  return path.trim().replace(/^(\.\/)+/, '').replace(/^\/+|\/+$/g, '');
}

export function folderPathValid(path: string): boolean {
  const value = normalizeFolder(path);
  return value.length > 0 && value.length <= 120 && FOLDER_PATH.test(value);
}

/** Every folder has a valid, unique path and a stack. */
export function foldersValid(folders: ProjectFolder[]): boolean {
  const paths = folders.map((f) => normalizeFolder(f.path));
  return folders.every((f) => folderPathValid(f.path) && f.stack !== null) && new Set(paths).size === paths.length;
}

/** "This is a monorepo" switch with the list of folders to scan, each with its stack. */
@Component({
  selector: 'app-monorepo-folders',
  templateUrl: './monorepo-folders.html',
  styleUrl: './monorepo-folders.scss',
})
export class MonorepoFolders {
  protected readonly i18n = inject(I18n);
  protected readonly stacks = STACKS;
  protected readonly max = MAX_FOLDERS;

  readonly folders = model.required<ProjectFolder[]>();
  readonly showErrors = input(false);
  protected readonly monorepo = linkedSignal(() => this.folders().length > 0);

  protected setMonorepo(on: boolean): void {
    this.monorepo.set(on);
    this.folders.set(on ? [{ path: '', stack: null }] : []);
  }

  protected add(): void {
    this.folders.update((list) => (list.length < MAX_FOLDERS ? [...list, { path: '', stack: null }] : list));
  }

  protected remove(index: number): void {
    const next = this.folders().filter((_, i) => i !== index);
    this.folders.set(next);
    if (next.length === 0) this.monorepo.set(false);
  }

  protected setPath(index: number, event: Event): void {
    const path = (event.target as HTMLInputElement).value;
    this.folders.update((list) => list.map((f, i) => (i === index ? { ...f, path } : f)));
  }

  protected setStack(index: number, event: Event): void {
    const stack = ((event.target as HTMLSelectElement).value || null) as Stack | null;
    this.folders.update((list) => list.map((f, i) => (i === index ? { ...f, stack } : f)));
  }

  protected pathError(index: number): boolean {
    const folders = this.folders();
    const path = normalizeFolder(folders[index].path);
    return !folderPathValid(path) || folders.findIndex((f) => normalizeFolder(f.path) === path) !== index;
  }
}
