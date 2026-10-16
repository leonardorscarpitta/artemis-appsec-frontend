# Frontend

Angular 22 app in `frontend/`, standalone components, signals, lazy-loaded routes.

## Structure

- `src/app/core/i18n.ts` — translations (`en-US`, `pt-BR`); use `i18n.t('key')` in templates. Selected language is kept in `localStorage`.
- `src/app/core/theme.ts` — light/dark theme; sets `data-theme` on `<html>`, persisted in `localStorage`, defaults to the OS preference. An inline script in `index.html` applies it before boot to avoid a flash.
- `src/app/core/pipeline.ts` — DevSecOps pipeline model: stages, phases, presets, fail thresholds and YAML generation (GitHub Actions / GitLab CI).
- `src/app/core/mock-data.ts` — placeholder findings and repositories until the API exists.
- `src/app/layout/shell.ts` — authenticated layout. Sidebar navigation is defined in the `groups` array (Overview / Security / Configuration); counts come from mock data. Bottom area: scan usage meter, help link, organization switcher (visual only).
- `src/app/shared/` — reusable components: logo, language switch, theme toggle, severity badge, `scan-settings` (schedule, automatic actions, Dockerfile, AI triage) and `pipeline-editor` (two-way bound with `[(stages)]`). The last two are used both in onboarding and in repository settings.
- `src/app/features/` — pages: `login`, `dashboard`, `repositories`, `repo-settings`, `onboarding`.

## Routes

| Path | Page |
| --- | --- |
| `/login` | SSO sign-in (Authelia OIDC, not wired yet) |
| `/dashboard` | CVE overview with CVSS severities |
| `/repositories` | Connected repositories |
| `/repositories/:name` | Repository settings (General / Pipeline tabs) |
| `/vulnerabilities`, `/pipelines`, `/reports`, `/integrations`, `/policies`, `/team`, `/settings`, `/help` | "Coming soon" placeholder (`shared/coming-soon.ts`, title via route `data`) |
| `/onboarding` | 5-step flow: SSH key → repository → settings → pipeline → stack detection |

## Styling

Enterprise-style light and dark themes. Design tokens live as CSS variables in `src/styles.scss` (`:root` for light, `:root[data-theme='dark']` overrides for dark); components must use tokens, not hard-coded colors:

- Brand: `--primary` (navy blue), `--primary-soft`, `--primary-contrast`
- Navigation (dark sidebar): `--nav-bg`, `--nav-text`, `--nav-hover`
- Severity: `--sev-{critical,high,medium,low}` (text) and `--sev-*-bg` (tag background)
- Fonts: IBM Plex Sans / IBM Plex Mono

Global primitives: `.card` (+ `.card-header`, `.table-card`), `.btn` (`.primary`, `.ghost`), `.input`, `.field`, `.tag`, `.table` (`.num` for numeric columns).

The logo (`shared/logo.ts`) reads `--logo-color`; the favicon is `public/favicon.svg`.

CVSS → severity follows NVD v3 ranges (`severityOf` in `mock-data.ts`).

## DevSecOps pipeline

Stages are grouped in three phases, each with a selectable tool and a fail threshold:

| Phase | Stages |
| --- | --- |
| Source | Secret scanning, SAST, SCA, License compliance |
| Build | Dockerfile audit, Container image scan, SBOM generation |
| Pre-deploy | Infrastructure as code, DAST |

Presets (`Essential`, `Recommended`, `Complete`) toggle stages in bulk; any manual change shows as `Custom`. Each stage's description and "why it matters" text lives in `i18n.ts` under `stage.<id>.*`. The generated YAML calls an `artemis` runner CLI that does not exist yet.
