import { Component, computed, inject, input } from '@angular/core';
import { I18n } from '../../core/i18n';
import { RunStatus, StageStatus } from '../../core/api/pipeline-runs';

type Tone = 'ok' | 'bad' | 'warn' | 'live' | 'idle';

const TONES: Record<RunStatus | StageStatus, Tone> = {
  success: 'ok',
  passed: 'ok',
  failed: 'bad',
  warning: 'warn',
  running: 'live',
  queued: 'idle',
  pending: 'idle',
  cancelled: 'idle',
  skipped: 'idle',
};

@Component({
  selector: 'app-run-status',
  host: { '[class]': 'tone()' },
  template: `<span class="dot" aria-hidden="true"></span>{{ label() }}`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.1rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.78rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }

    :host(.ok) {
      color: var(--sev-low);
      background: var(--sev-low-bg);
    }

    :host(.bad) {
      color: var(--sev-critical);
      background: var(--sev-critical-bg);
    }

    :host(.warn) {
      color: var(--sev-medium);
      background: var(--sev-medium-bg);
    }

    :host(.live) {
      color: var(--primary);
      background: var(--primary-soft);
    }

    :host(.live) .dot {
      animation: blink 1.2s ease-in-out infinite;
    }

    @keyframes blink {
      50% {
        opacity: 0.25;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host(.live) .dot {
        animation: none;
      }
    }

    :host(.idle) {
      color: var(--text-muted);
      background: var(--surface-hover);
    }

    @media (prefers-reduced-motion: no-preference) {
      :host(.live) .dot {
        animation: pulse 1.4s ease-in-out infinite;
      }
    }

    @keyframes pulse {
      50% {
        opacity: 0.25;
      }
    }
  `,
})
export class RunStatusBadge {
  private readonly i18n = inject(I18n);

  readonly status = input<RunStatus>();
  // Stage statuses use their own wording ("Passed" vs "Success").
  readonly stage = input<StageStatus>();

  protected readonly tone = computed(() => TONES[this.stage() ?? this.status() ?? 'queued']);
  protected readonly label = computed(() => {
    const stage = this.stage();
    if (stage) return this.i18n.t(`runs.stage.${stage}`);
    return this.i18n.t(`runs.status.${this.status() ?? 'queued'}`);
  });
}
