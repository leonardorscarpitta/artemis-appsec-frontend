import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  host: { class: 'logo' },
  template: `
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="var(--accent)" stroke-width="2" />
      <path d="M20 5a12 12 0 1 0 0 22a10 10 0 0 1 0-22z" fill="var(--accent)" />
    </svg>
    <span>Artemis</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: 0.02em;
    }
  `,
})
export class Logo {}
