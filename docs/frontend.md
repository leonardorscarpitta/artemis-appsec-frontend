# Frontend

Angular 22 app in `frontend/`, standalone components, signals, lazy-loaded routes.

## Structure

- `src/app/core/i18n.ts` — translations (`en-US`, `pt-BR`); use `i18n.t('key')` in templates. Selected language is kept in `localStorage`.
- `src/app/core/theme.ts` — light/dark theme; sets `data-theme` on `<html>`, persisted in `localStorage`, defaults to the OS preference. An inline script in `index.html` applies it before boot to avoid a flash.
- `src/app/core/mock-data.ts` — placeholder findings and repositories until the API exists.
- `src/app/layout/shell.ts` — authenticated layout (sidebar + top bar).
- `src/app/shared/` — small reusable components (logo, language switch, theme toggle, severity badge).
- `src/app/features/` — pages: `login`, `dashboard`, `repositories`, `onboarding`.

## Routes

| Path | Page |
| --- | --- |
| `/login` | SSO sign-in (Authelia OIDC, not wired yet) |
| `/dashboard` | CVE overview with CVSS severities |
| `/repositories` | Connected repositories |
| `/onboarding` | 4-step flow: SSH key → repository → settings → stack detection |

## Styling

Enterprise-style light and dark themes. Design tokens live as CSS variables in `src/styles.scss` (`:root` for light, `:root[data-theme='dark']` overrides for dark); components must use tokens, not hard-coded colors:

- Brand: `--primary` (navy blue), `--primary-soft`, `--primary-contrast`
- Navigation (dark sidebar): `--nav-bg`, `--nav-text`, `--nav-hover`
- Severity: `--sev-{critical,high,medium,low}` (text) and `--sev-*-bg` (tag background)
- Fonts: IBM Plex Sans / IBM Plex Mono

Global primitives: `.card` (+ `.card-header`, `.table-card`), `.btn` (`.primary`, `.ghost`), `.input`, `.field`, `.tag`, `.table` (`.num` for numeric columns).

The logo (`shared/logo.ts`) reads `--logo-color`; the favicon is `public/favicon.svg`.

CVSS → severity follows NVD v3 ranges (`severityOf` in `mock-data.ts`).
