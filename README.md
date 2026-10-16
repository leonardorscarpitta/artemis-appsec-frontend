<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
    <img src=".github/assets/logo-light.svg" alt="Artemis" width="232" height="64">
  </picture>
</p>

<p align="center">
  Continuous application security testing — Angular frontend
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22-0b4f8a" alt="Angular 22">
  <img src="https://img.shields.io/badge/i18n-en--US%20%7C%20pt--BR-0b4f8a" alt="Languages: en-US and pt-BR">
  <img src="https://img.shields.io/badge/API-artemis--backend-0b4f8a" alt="API: artemis-backend">
</p>

---

Artemis is a SAST platform: it connects to Git repositories, runs a configurable DevSecOps pipeline and reports vulnerabilities scored with CVSS from the NIST National Vulnerability Database. Supported stacks are React, Angular and Java + Spring.

This repository is the frontend; the API lives in the `artemis` backend repository. Every authenticated screen reads and writes through the API; only the public home page uses static sample data.

## Contents

- [Running locally](#running-locally)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Styling](#styling)
- [DevSecOps pipeline](#devsecops-pipeline)
- [Internationalization](#internationalization)
- [User documentation (Help page)](#user-documentation-help-page)
- [Contributing](#contributing)

## Running locally

Everything runs in Docker — nothing needs to be installed on your machine besides Docker:

```sh
docker compose up -d
```

The app is served at http://localhost:4200 with live reload. It expects the backend stack running (API at http://localhost:8080 and Authelia at https://auth.artemis.localhost:9443); see the backend README. Development logins are in the backend's `authelia/secrets/dev-credentials.txt`. The first time, open https://auth.artemis.localhost:9443 and accept the local certificate (or trust Caddy's root CA), otherwise sign-in cannot reach Authelia. A development build check:

```sh
docker compose exec frontend npx ng build --configuration development
```

## Project structure

Angular 22 with standalone components, signals and lazy-loaded routes.

| Path | Purpose |
| --- | --- |
| `src/app/core/i18n.ts` | Translations (`en-US`, `pt-BR`), grouped by `// --- area ---` comments; use `i18n.t('key')` in templates |
| `src/app/core/theme.ts` | Light/dark theme: sets `data-theme` on `<html>`, persisted in `localStorage`, defaults to the OS preference (an inline script in `index.html` applies it before boot) |
| `src/app/core/pipeline.ts` | DevSecOps pipeline model: stages, phases, presets, fail thresholds and YAML generation |
| `src/environments/` | `apiUrl` and `auth` (OIDC authority, client id, scopes) per build |
| `src/app/core/org/` | `OrgContext` (current organization slug), `orgGuard` and legacy URL redirects; `shared/org-link.ts` is the `orgLink` pipe |
| `src/app/core/auth/` | OpenID Connect with `oidc-client-ts`: `Auth` service (login redirect, callback, profile, account URL, logout), `authGuard` and `authInterceptor` (Bearer token, re-login on 401) |
| `src/app/core/api/` | HTTP layer: `apiUrl()`, `Accept-Language` interceptor, `ProblemDetail` helpers and one typed client per backend module (`projects.ts`, `findings.ts`, `pipeline-runs.ts`, `reports.ts`, `policies.ts`, `organization.ts`) |
| `src/app/core/domain.ts` | Shared domain types (`Severity`, `FindingStatus`, `Stack`) and helpers |
| `src/app/layout/shell.ts` | Authenticated layout: sidebar (`groups` array), top bar, mobile drawer and icon rail |
| `src/app/shared/` | Reusable components: logo, language switch, theme toggle, severity badge, `scan-settings` and `pipeline-editor` (`[(stages)]`) |
| `src/app/features/` | One folder per page: `home`, `login`, `dashboard`, `vulnerabilities`, `repositories`, `repo-settings`, `pipeline-runs`, `reports`, `onboarding`, `integrations`, `policies`, `team`, `settings`, `help` |

## Routes

In-app pages live under the organization slug: `/<org>/<page>` (e.g. `/acme/vulnerabilities`). The slug comes from `GET /organization/settings` (`OrgContext`); `orgGuard` rewrites a wrong slug, and `legacyPageMatcher` sends pre-organization URLs (`/vulnerabilities/...`) to the same page under the slug. Build links with the `orgLink` pipe (`'/reports' | orgLink`) or `OrgContext.url()` — never hard-code the slug. The table below lists page paths relative to `/<org>`; `/`, `/docs`, `/login` and `/auth/callback` are public and unprefixed.

| Path | Page |
| --- | --- |
| `/` | Public home page (text in `features/home/home-content.ts`; product preview uses static sample data from `home-preview.ts`) |
| `/docs` | Public user guide (same content as `/help`) for visitors who are not signed in |
| `/login` | SSO sign-in (redirects to Authelia) |
| `/auth/callback` | OpenID Connect redirect target; completes sign-in and returns to the requested page |
| `/dashboard` | Security overview with CVSS severities |
| `/vulnerabilities`, `/vulnerabilities/:cve` | Findings list (search, filters, sort) and finding detail |
| `/repositories`, `/repositories/:name` | Connected repositories and repository settings (General / Pipeline tabs) |
| `/pipelines`, `/pipelines/:id` | Pipeline runs and run detail (stages, logs) |
| `/reports`, `/reports/:id` | Reports list and printable report view |
| `/onboarding` | 5-step flow: SSH key → repository → settings → pipeline → stack detection |
| `/integrations` | Integrations and SSH deploy keys |
| `/policies` | Pipeline gates, remediation SLAs, license policy, risk acceptances |
| `/team` | Members, invitations, roles and permissions |
| `/settings` | Organization settings (general, authentication, notifications, API tokens, retention, danger zone) |
| `/help` | In-app user guide |

## Styling

Enterprise-style light and dark themes. Design tokens are CSS variables in `src/styles.scss` (`:root` for light, `:root[data-theme='dark']` for dark). Components use tokens, never hard-coded colors.

- **Brand:** `--primary`, `--primary-soft`, `--primary-contrast`
- **Sidebar:** `--nav-bg`, `--nav-text`, `--nav-hover`
- **Severity:** `--sev-{critical,high,medium,low}` (text) and `--sev-*-bg` (tag background)
- **Fonts:** IBM Plex Sans / IBM Plex Mono

Global primitives: `.card` (`.card-header`, `.table-card`), `.btn` (`.primary`, `.ghost`), `.input`, `.field`, `.tag`, `.segmented`, `.switch`, `.table` (`.num`, and `.stack` with `data-label` for stacked rows on phones).

Responsive breakpoints: `599px` (phone), `899px` (tablet — sidebar becomes a drawer), `1199px` (sidebar becomes an icon rail that expands over the page on hover/focus), `1600px` (wide). Grid columns use `minmax(0, 1fr)` to avoid horizontal overflow.

The logo (`shared/logo.ts`) reads `--logo-color` and `--logo-name-display`; the favicon is `public/favicon.svg`. CVSS → severity follows the NVD v3 ranges (`severityOf` in `domain.ts`).

## DevSecOps pipeline

Stages are grouped in three phases, each with a selectable tool and a fail threshold:

| Phase | Stages |
| --- | --- |
| Source | Secret scanning, SAST, SCA, License compliance |
| Build | Dockerfile audit, Container image scan, SBOM generation |
| Pre-deploy | Infrastructure as code, DAST |

Presets (`Essential`, `Recommended`, `Complete`) toggle stages in bulk; any manual change shows as `Custom`. Stage descriptions and "why it matters" texts live in `i18n.ts` under `stage.<id>.*`. The generated YAML (GitHub Actions / GitLab CI) calls an `artemis` runner CLI that does not exist yet.

## Authentication

Sign-in uses Authelia as the OpenID Connect provider (Authorization Code + PKCE, public client `artemis-web`). Every route under the app shell is protected by `authGuard`; the access token is kept in `localStorage` (shared by all tabs, so the public home page can show the signed-in user) and sent as a Bearer token to the API only. The user badge (`shared/user-badge.ts`) links to the account page at Authelia (`<authority>/settings`). Authelia does not support RP-initiated logout yet, so "Sign out" ends the Artemis session while the Authelia session may persist.

## Talking to the API

- **Reads** use `httpResource()` in the component; show its state with `<app-request-state [resource]="...">` (loading, error with retry).
- **Writes** go through the module's client service (e.g. `ProjectsApi`) with `HttpClient`; show `problemMessage(err)` on failure.
- Types in `core/api/*.ts` mirror the backend JSON exactly (same enum strings).
- AI triage is not part of the API yet; its controls are shown locked.

## Internationalization

All UI text is available in English (`en-US`) and Brazilian Portuguese (`pt-BR`). Keys are typed: `i18n.t()` only accepts keys that exist in the dictionary. Long-form content lives in per-feature files (`home-content.ts`, `help-content.ts`) keyed by language.

## User documentation (Help page)

End-user docs live in the app at `/help`, with content in `src/app/features/help/help-content.ts` (`HELP['en-US']` and `HELP['pt-BR']`). Sections are lists of typed blocks: `p`, `ul`, `ol`, `note`, `table`.

## Contributing

- **Branches:** `main` (stable) and `dev` (integration). Create `feat/*` or `bugfix/*` branches from `dev`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Every change** must update, in the same commit:
  - the in-app Help content, in both languages, when user-facing behavior changes;
  - this README, when structure, routes or conventions change.
