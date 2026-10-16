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
  <a href="https://github.com/Artemis-Core/artemis-appsec-backend"><img src="https://img.shields.io/badge/API-artemis--appsec--backend-0b4f8a" alt="API: artemis-appsec-backend"></a>
  <img src="https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-5a6474" alt="License: PolyForm Noncommercial 1.0.0">
</p>

---

Artemis is a SAST platform: it connects to Git repositories, runs a configurable DevSecOps pipeline with self-hosted open-source scanners and reports secrets, code issues, misconfigurations and dependency vulnerabilities (CVSS from the NIST National Vulnerability Database). Supported stacks are React, Angular and Java + Spring.

This repository is the frontend; the API lives in the [artemis-appsec-backend](https://github.com/Artemis-Core/artemis-appsec-backend) repository. Every authenticated screen reads and writes through the API; only the public home page uses static sample data.

## Naming

The product is shown to users as **Artemis**. Technical identifiers use **artemisappsec**: package and project names, storage keys, the OIDC client (`artemisappsec-web`), the API audience (`artemisappsec-api`), the CI runner (`artemisappsec scan`) and the local auth host (`auth.artemisappsec.localhost`).

## Contents

- [Naming](#naming)
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

The app is served at http://localhost:4200 with live reload. The dev container is limited to 1 GB of RAM (`mem_limit`, Node heap 768 MB). It expects the backend stack running (API at http://localhost:8080, Keycloak at https://auth.artemisappsec.localhost:9443 and Mailpit at http://localhost:8025 for verification e-mails); see the backend README. Development logins are in the backend's `keycloak/secrets/dev-credentials.txt`, or register a new account from the home page. The first time, open https://auth.artemisappsec.localhost:9443 and accept the local certificate (or trust Caddy's root CA), otherwise sign-in cannot reach Keycloak. A development build check:

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
| `src/app/core/api/` | HTTP layer: `apiUrl()`, `Accept-Language` interceptor, `ProblemDetail` helpers and one typed client per backend module (`projects.ts`, `findings.ts`, `pipeline-runs.ts`, `reports.ts`, `policies.ts`, `organization.ts`, `billing.ts`) |
| `src/app/core/domain.ts` | Shared domain types (`Severity`, `FindingStatus`, `Stack`) and helpers |
| `src/app/layout/shell.ts` | Authenticated layout: sidebar (`groups` array), top bar, mobile drawer and icon rail |
| `src/app/core/org/` | `OrgContext` (memberships, current organization, `can()`/`reason()`), `orgGuard`, `orgInterceptor` |
| `src/app/shared/` | Reusable components: logo, language switch, theme toggle, severity badge, `role-notice`, `scan-settings` and `pipeline-editor` (`[(stages)]`) |
| `src/app/features/` | One folder per page: `home`, `login`, `organizations`, `dashboard`, `vulnerabilities`, `repositories`, `repo-settings`, `pipeline-runs`, `reports`, `onboarding`, `integrations`, `policies`, `team`, `settings`, `help` |

## Routes

In-app pages live under the organization slug: `/<org>/<page>` (e.g. `/acme/vulnerabilities`). `OrgContext` loads the user's memberships from `GET /me/organizations`; `orgGuard` only lets users into organizations they belong to (otherwise → `/organizations`) and sets the current slug, and `legacyPageMatcher` sends pre-organization URLs (`/vulnerabilities/...`) to the same page in the user's first organization. Build links with the `orgLink` pipe (`'/reports' | orgLink`) or `OrgContext.url()` — never hard-code the slug. The table below lists page paths relative to `/<org>`; `/`, `/docs`, `/login`, `/auth/callback` and `/organizations` are unprefixed.

| Path | Page |
| --- | --- |
| `/` | Public home page (text in `features/home/home-content.ts`; product preview uses static sample data from `home-preview.ts`). Signed-in users also get "Your workspace" (`home-workspace.ts`): their organizations (role, plan) and pending invitations. "Get started" opens Keycloak's sign-up form |
| `/docs` | Public user guide (same content as `/help`) for visitors who are not signed in |
| `/privacy`, `/terms` | Privacy Policy and Terms of Use (text in `features/legal/legal-content.ts`, en-US + pt-BR) |
| `/licenses` | Third-party notices: scanner tools, licenses, source links, NVD notice and data attribution (`features/legal/licenses-content.ts`) |
| `/login` | Sign in or create an account (redirects to Keycloak) |
| `/auth/callback` | OpenID Connect redirect target; completes sign-in, then goes to the requested page if the user may open it, else to their only organization or to `/organizations` (`landingUrl`) |
| `/organizations` | Organization picker: the user's organizations, invitations to their account e-mail (accept/decline) and "Create organization" (the creator becomes owner) |
| `/dashboard` | Security overview with CVSS severities |
| `/vulnerabilities`, `/vulnerabilities/:cve` | Findings list (search, filters, sort) and finding detail |
| `/repositories`, `/repositories/:name` | Connected repositories and repository settings (General / Pipeline tabs) |
| `/pipelines`, `/pipelines/:id` | Pipeline runs and run detail (stages, logs) |
| `/reports`, `/reports/:id` | Reports list and printable report view |
| `/onboarding` | 5-step flow: SSH key → repository → settings → pipeline → stack detection |
| `/integrations` | Integrations and SSH deploy keys |
| `/policies` | Pipeline gates, remediation SLAs, license policy, risk acceptances |
| `/team` | Members, invitations, roles and permissions, ownership transfer |
| `/settings` | Organization settings (general, authentication, notifications, API tokens, retention, danger zone: leave / delete) |
| `/billing` | Plans (Free: 90 scans/month; PRO: R$ 24,99/month, 300 scans/month + AI), current subscription and this month's usage; read-only while billing is disabled on the API. The sidebar usage meter uses the same data, and the home page shows the plans from the public `/billing/plans` endpoint |
| `/help` | In-app user guide |

## Styling

Enterprise-style light and dark themes. Design tokens are CSS variables in `src/styles.scss` (`:root` for light, `:root[data-theme='dark']` for dark). Components use tokens, never hard-coded colors.

- **Brand:** `--primary`, `--primary-soft`, `--primary-contrast`
- **Sidebar:** `--nav-bg`, `--nav-text`, `--nav-hover`
- **Severity:** `--sev-{critical,high,medium,low}` (text) and `--sev-*-bg` (tag background)
- **Fonts:** IBM Plex Sans / IBM Plex Mono
- **Scrollbars:** `--scrollbar-thumb`, `--scrollbar-thumb-hover`, `--scrollbar-track` (thin, rounded; standard `scrollbar-color` with a WebKit fallback; the sidebar overrides them for its dark background)

Global primitives: `.card` (`.card-header`, `.table-card`), `.btn` (`.primary`, `.ghost`), `.input`, `.field`, `.tag`, `.segmented`, `.switch`, `.table` (`.num`, and `.stack` with `data-label` for stacked rows on phones).

Responsive breakpoints: `599px` (phone), `899px` (tablet — sidebar becomes a drawer), `1199px` (sidebar becomes an icon rail that expands over the page on hover/focus), `1600px` (wide). Grid columns use `minmax(0, 1fr)` to avoid horizontal overflow.

The logo (`shared/logo.ts`) reads `--logo-color` and `--logo-name-display`; the favicon is `public/favicon.svg`. CVSS → severity follows the NVD v3 ranges (`severityOf` in `domain.ts`).

## DevSecOps pipeline

Stages are grouped in three phases. Each stage has a tool (from the self-hosted scanner runner) and a fail threshold:

| Phase | Stage → tools |
| --- | --- |
| Source | Secret scanning → Gitleaks · SAST → Semgrep CE (Artemis rules) · SCA → Trivy / Grype · License → Trivy |
| Build | Dockerfile audit → Hadolint / Trivy · Container image scan → Trivy (**not available yet**) · SBOM → Syft |
| Pre-deploy | Infrastructure as code → Trivy · DAST → OWASP ZAP (**not available yet**) |

The catalog comes from the API (`GET /pipeline/stages`, field `available`); `core/pipeline.ts` holds the same defaults as a fallback. Unavailable stages are shown locked in the pipeline editor and are never enabled by presets. Presets (`Essential`, `Recommended`, `Complete`) toggle stages in bulk; any manual change shows as `Custom`. Stage descriptions and "why it matters" texts live in `i18n.ts` under `stage.<id>.*`. The "Pipeline as code" YAML is a preview for running the same runner in your own CI.

### Scans

- `shared/run-scan-button.ts` calls `POST /repositories/{name}/scans` and opens the new run; a 409 (monthly limit) is shown inline. It is used on the Repositories list and repository settings.
- Onboarding accepts public `https://` URLs (scanned now) and SSH URLs (accepted, scanned once private-repository support lands).
- Findings have a `kind` (`vulnerability`, `secret`, `code`, `config`, `license`). Only vulnerabilities carry CVE/CVSS/package; the others carry `ruleId` and `location`. Detail URLs are `/<org>/vulnerabilities/<CVE>` (all occurrences of a CVE) or `/<org>/vulnerabilities/<finding id>` for other kinds.

## Authentication

Sign-in uses Keycloak as the OpenID Connect provider (realm `artemisappsec`, Authorization Code + PKCE, public client `artemisappsec-web`). `Auth.register()` opens Keycloak's sign-up form (`prompt=create`; Terms acceptance happens there; e-mail verification is off). Every route under the app shell is protected by `authGuard`; the access token is kept in `localStorage` (shared by all tabs, so the public home page can show the signed-in user) and sent as a Bearer token to the API only. On a 401 the local session is cleared and the user signs in again. The user badge (`shared/user-badge.ts`) links to the Keycloak account console (`<authority>/account`). "Sign out" is RP-initiated logout (`signoutRedirect`, back to `/`), ending the Keycloak session too.

## Organizations and permissions

- Every org-scoped API call carries `X-Artemis-Organization: <slug>` (added by `orgInterceptor` from the URL slug; not sent to `/me/**` and `/organizations`). A `404` with code `organization-not-found` drops the membership and goes to `/organizations`; a `403` reloads the memberships (the role may have changed).
- `OrgContext.current()` holds the role and permission list returned by the API (`viewFindings`, `triage`, `pipelines`, `integrations`, `team`, `billing`). Gate actions with `org.can('<permission>')`; the API enforces the same matrix.
- When a permission is missing, don't hide the feature: disable the controls (wrap forms in `<fieldset class="contents" [disabled]>`), and show `<app-role-notice permission="…" />` or a `title` with `org.reason('<permission>')` ("Your role (Viewer) can't …").
- The shell re-creates its `<router-outlet>` when the slug changes, so pages reload their data after switching organization from the sidebar.

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

- **How to contribute:** see [CONTRIBUTING.md](CONTRIBUTING.md) (contribution terms included).
- **Branches:** `main` (stable) and `dev` (integration). Create `feat/*` or `bugfix/*` branches from `dev`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Every change** must update, in the same commit:
  - the in-app Help content, in both languages, when user-facing behavior changes;
  - this README, when structure, routes or conventions change.

## License

Artemis is source-available under the [PolyForm Noncommercial License 1.0.0](LICENSE.md). You may use, study, modify and share it for noncommercial purposes; commercial use (selling it, offering it as a paid service, charging for access) is reserved to the copyright holder. Contributions are welcome under the terms in [CONTRIBUTING.md](CONTRIBUTING.md).
