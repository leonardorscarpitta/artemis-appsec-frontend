# Frontend

Angular 22 app in `frontend/`, standalone components, signals, lazy-loaded routes.

## Structure

- `src/app/core/i18n.ts` — translations (`en-US`, `pt-BR`); use `i18n.t('key')` in templates. Selected language is kept in `localStorage`.
- `src/app/core/mock-data.ts` — placeholder findings and repositories until the API exists.
- `src/app/layout/shell.ts` — authenticated layout (sidebar + top bar).
- `src/app/shared/` — small reusable components (logo, language switch, severity badge).
- `src/app/features/` — pages: `login`, `dashboard`, `repositories`, `onboarding`.

## Routes

| Path | Page |
| --- | --- |
| `/login` | SSO sign-in (Authelia OIDC, not wired yet) |
| `/dashboard` | CVE overview with CVSS severities |
| `/repositories` | Connected repositories |
| `/onboarding` | 4-step flow: SSH key → repository → settings → stack detection |

## Styling

Design tokens (colors, radius, fonts) live as CSS variables in `src/styles.scss`, together with global primitives: `.card`, `.btn` (`.primary`, `.ghost`), `.input`, `.field`, `.badge`, `.table`. Severity colors: `--sev-critical`, `--sev-high`, `--sev-medium`, `--sev-low`.

CVSS → severity follows NVD v3 ranges (`severityOf` in `mock-data.ts`).
