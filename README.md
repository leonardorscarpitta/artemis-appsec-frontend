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
  <a href="https://github.com/leonardorscarpitta/artemis-appsec-backend"><img src="https://img.shields.io/badge/API-artemis--appsec--backend-0b4f8a" alt="API: artemis-appsec-backend"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-5a6474" alt="License: MIT"></a>
</p>

---

Artemis is a SAST platform: it connects to Git repositories, runs a configurable DevSecOps pipeline with self-hosted open-source scanners and reports secrets, code issues, misconfigurations and dependency vulnerabilities (CVSS from the NIST National Vulnerability Database). Supported stacks are React, Angular and Java + Spring.

This repository is the frontend; the API lives in the [artemis-appsec-backend](https://github.com/leonardorscarpitta/artemis-appsec-backend) repository. Every authenticated screen reads and writes through the API; only the public home page uses static sample data.

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

The app is served at http://localhost:4200 with live reload (published on `127.0.0.1` only; dependencies are installed with `npm ci` from the lockfile on start). The dev container is limited to 1 GB of RAM (`mem_limit`, Node heap 768 MB). It expects the backend stack running (API at http://localhost:8080, Keycloak at https://auth.artemisappsec.localhost:9443 and Mailpit at http://localhost:8025 for verification e-mails); see the backend README. Development logins are in the backend's `keycloak/secrets/dev-credentials.txt`, or register a new account from the home page. The first time, open https://auth.artemisappsec.localhost:9443 and accept the local certificate (or trust Caddy's root CA), otherwise sign-in cannot reach Keycloak. A development build check:

```sh
docker compose exec frontend npx ng build --configuration development
```

### Production image

`Dockerfile` builds the production bundle (`node:22.23-alpine`) and serves it with `nginx-unprivileged:1.30-alpine` (current stable; non-root, port 8080, `nginx/default.conf`): SPA fallback to `index.html`, hashed assets cached as immutable, `index.html` revalidated, `/invite/<token>` served with `no-store` and no access log (the one-time token never reaches the log). Every response carries the headers in `nginx/security-headers.conf`:

- `Content-Security-Policy`: `default-src 'self'`; scripts from the app only plus the sha256 of each inline `<script>` in the built `index.html` (the theme bootstrap) — computed during `docker build`, so changing that script needs no manual update; `connect-src`/`form-action` allow the identity provider; `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`. Styles need `'unsafe-inline'` (Angular component styles); critical-CSS inlining is turned off in the production build because its `onload` handler would be blocked.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` (keeps invitation tokens out of `Referer`), `Cross-Origin-Opener-Policy: same-origin` (sign-in/out are full redirects, no popups), `Permissions-Policy` (camera, microphone, geolocation off) and `Strict-Transport-Security` (effective once the TLS proxy in front serves HTTPS).

```sh
docker build -t artemisappsec-web .
docker run --rm -p 127.0.0.1:8081:8080 artemisappsec-web   # then: curl -sI http://127.0.0.1:8081/
```

The production build calls the API at `/api/v1` on the same origin, so the reverse proxy in front must route `/api/` to the backend. If the identity provider moves, update `connect-src`/`form-action` in `nginx/security-headers.conf` and `environment.ts`.

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
| `src/app/core/api/` | HTTP layer: `apiUrl()`, `Accept-Language` interceptor, `ProblemDetail` helpers and one typed client per backend module (`projects.ts`, `findings.ts`, `pipeline-runs.ts`, `reports.ts`, `policies.ts`, `organization.ts`, `usage.ts`, `admin.ts`) |
| `src/app/core/domain.ts` | Shared domain types (`Severity`, `FindingStatus`, `Stack`) and helpers |
| `src/app/layout/shell.ts` | Authenticated layout: sidebar (`groups` array), top bar, mobile drawer and icon rail |
| `src/app/core/org/` | `OrgContext` (memberships, current organization, `can()`/`reason()`), `orgGuard`, `orgInterceptor` |
| `src/app/shared/` | Reusable components: logo, language switch, theme toggle, severity badge, `role-notice`, `scan-settings`, `pipeline-editor` (`[(stages)]`) and `paginator` (`paginate(rows, resetOn)` + `<app-paginator [pager]>`: 15 rows per page, shown only above 15 rows; back to page 1 when `resetOn` changes, clamped on reloads) |
| `src/app/features/` | One folder per page: `home`, `login`, `organizations`, `dashboard`, `vulnerabilities`, `repositories`, `repo-settings`, `pipeline-runs`, `reports`, `onboarding`, `integrations`, `policies`, `team`, `settings`, `help` |

## Routes

In-app pages live under the organization slug: `/<org>/<page>` (e.g. `/acme/vulnerabilities`). `OrgContext` loads the user's memberships from `GET /me/organizations`; `orgGuard` only lets users into organizations they belong to (otherwise → `/organizations`; Artemis administrators get a read-only view, see below) and sets the current slug, and `legacyPageMatcher` sends pre-organization URLs (`/vulnerabilities/...`) to the same page in the user's first organization. Build links with the `orgLink` pipe (`'/reports' | orgLink`) or `OrgContext.url()` — never hard-code the slug. The table below lists page paths relative to `/<org>`; `/`, `/docs`, `/login`, `/auth/callback`, `/organizations` and `/admin` are unprefixed.

| Path | Page |
| --- | --- |
| `/` | Public home page (text in `features/home/home-content.ts`; product preview uses static sample data from `home-preview.ts`). Signed-in users also get "Your workspace" (`home-workspace.ts`): their organizations (role, usage) and pending invitations; Artemis administrators also get a "Platform administration" button. "Get started" opens Keycloak's sign-up form |
| `/docs` | Public user guide (same content as `/help`) for visitors who are not signed in |
| `/privacy`, `/terms` | Privacy Policy and Terms of Use (text in `features/legal/legal-content.ts`, en-US + pt-BR) |
| `/licenses` | Third-party notices: scanner tools, licenses, source links, NVD notice and data attribution (`features/legal/licenses-content.ts`) |
| `/login` | Sign in or create an account (redirects to Keycloak) |
| `/auth/callback` | OpenID Connect redirect target; completes sign-in, then goes to the requested page if the user may open it, else to their only organization or to `/organizations` (`landingUrl`) |
| `/organizations` | Organization picker: the user's organizations, invitations to their account e-mail (accept/decline) and "Create organization" (the creator becomes owner; one Free organization per account → `free-organization-limit`) |
| `/invite/:token` | Shows a one-time invitation link (`POST /me/invitations/preview` `{token}` → organization and role, token not used) and asks “Join <org> as <role>?”; **Join** accepts it (`POST /me/invitations/accept` `{token}`) and opens the organization's dashboard; sign-in/registration keeps the link as `returnUrl` (`INVITE_LINK` in `org-context.ts`) |
| `/dashboard` | Security overview: KPI tiles (sparklines and deltas vs the first day of the trend period, derived client-side from the trends series; relative last-scan time), one stacked severity bar, trends for the last 30/90 days (`GET /dashboard/trends?days=&tz=<browser time zone>`: open findings by severity, new vs fixed per week, mean time to remediate, pipeline runs per day), open findings by kind and top repositories (link to `/vulnerabilities?kind=|repository=|severity=|status=`, which pre-fills the filters). Charts are hand-rolled SVG/HTML in `features/dashboard/charts/` (no chart library; `sparkline.ts` for the KPI tiles); loading uses skeletons; fills use the dashboard-scoped `--chart-*` tokens (severity hues re-stepped for adjacent marks, checked for color-vision deficiency in both themes) |
| `/vulnerabilities`, `/vulnerabilities/:cve` | Findings list (search, filters, sort) and finding detail |
| `/repositories`, `/repositories/:name` | Connected repositories and repository settings (General / Pipeline / Deploy Key tabs — `?tab=access` opens Access; monorepo folders + stacks via `shared/monorepo-folders.ts`, also used in onboarding; "Remove repository…" on the General tab opens a dialog with "Also delete everything linked to this repository" (unchecked = keep history → `DELETE /repositories/{name}`; checked → `?purge=true`). The list page shows "Removed repositories" (`GET /removed-repositories`, "Delete history" → `DELETE /removed-repositories/{id}`). Findings and runs of removed repositories carry `repositoryRemoved` and are shown with `shared/repo-name.ts` (“Removed repository” tag, no links, no re-run) |
| `/pipelines`, `/pipelines/:id` | Pipeline runs and run detail (stages, logs; "Download SBOM (CycloneDX JSON)" under the SBOM stage for each entry of `sboms`, fetched as a blob through `HttpClient` from `GET /pipeline-runs/{number}/sbom?folder=` so the auth and organization headers are sent) |
| `/reports`, `/reports/:id` | Reports list and printable report view (see below) |
| `/onboarding` | 4-step flow: repository (SSH URL, branch, monorepo folders) → settings → pipeline → stack (“Detect automatically” by default = `stack: null`; the API detects it on the first successful access check); then the repository's Deploy Key tab. The General tab shows the stack with “Auto-detected” / “Detecting stack…” and lets the user change it (`settings.stack`, stored as a manual choice) |
| `/integrations` | Vulnerability data (the NIST NVD integration + static source cards from `vuln-data-sources.ts`) and the list of SSH deploy keys (generated per repository; revoke only — no pasting). Other integration ids the API still returns are not shown |
| `/policies` | Pipeline gates (minimum thresholds + required stages, enforced by `shared/pipeline-editor.ts` via `GET /policies`), remediation SLAs (findings carry `dueAt`/`overdue`), license policy, risk acceptances (create by finding reference or CVE; accepting from a finding asks for justification + expiry) |
| `/team` | Members, invitations and the organization's roles-and-permissions matrix — editable by owners and admins (`GET /roles` → `editable` per role, `PUT /roles/{role}/permissions`; locked cells: owner column, `viewFindings`, `billing`, admin column for admins); after saving, `OrgContext.load(true)` refreshes `can()` |
| `/settings` | Organization settings (General: name, language, time zone; Danger zone: transfer ownership / leave / delete). The authentication, notification and retention fields the API still returns are sent back unchanged on save |
| `/usage` | Artemis is free (no plans or payments). This month's scans against the limit (25 per organization), the reset date and which optional features (`scheduledScans`, `organizationRename`, `aiTriage`) the Artemis administrators enabled — `GET /usage`. The sidebar usage meter and the home cards use the same endpoint. `/<org>/billing` redirects here |
| `/help` | In-app user guide |

## Styling

Enterprise-style light and dark themes. Design tokens are CSS variables in `src/styles.scss` (`:root` for light, `:root[data-theme='dark']` for dark). Components use tokens, never hard-coded colors.

- **Brand:** `--primary`, `--primary-soft`, `--primary-contrast`
- **Sidebar:** `--nav-bg`, `--nav-text`, `--nav-hover`
- **Severity:** `--sev-{critical,high,medium,low}` (text) and `--sev-*-bg` (tag background)
- **Fonts:** IBM Plex Sans / IBM Plex Mono, self-hosted from the `@fontsource` packages (latin + latin-ext, listed in `angular.json` styles) — the browser never contacts Google or any CDN
- **Scrollbars:** `--scrollbar-thumb`, `--scrollbar-thumb-hover`, `--scrollbar-track` (thin, rounded; standard `scrollbar-color` with a WebKit fallback; the sidebar overrides them for its dark background)

Global primitives: `.card` (`.card-header`, `.table-card`), `.btn` (`.primary`, `.ghost`), `.input`, `.field`, `.tag`, `.segmented`, `.switch`, `.table` (`.num`, and `.stack` with `data-label` for stacked rows on phones).

Responsive breakpoints: `599px` (phone), `899px` (tablet — sidebar becomes a drawer), `1199px` (sidebar becomes an icon rail that expands over the page on hover/focus), `1600px` (wide). Grid columns use `minmax(0, 1fr)` to avoid horizontal overflow.

The logo (`shared/logo.ts`) reads `--logo-color` and `--logo-name-display`; the favicon is `public/favicon.svg`. CVSS → severity follows the NVD v3 ranges (`severityOf` in `domain.ts`).

## DevSecOps pipeline

Stages are grouped in three phases. Each stage has a tool (from the self-hosted scanner runner) and a fail threshold:

| Phase | Stage → tools |
| --- | --- |
| Source | Secret scanning → Gitleaks · SAST → Semgrep CE (Artemis rules) · SCA → Trivy / Grype · License → Trivy |
| Build | Dockerfile audit → Hadolint / Trivy · Container image scan → Trivy (published image from the repository's `containerImage` setting; pulled, never built) · SBOM → Syft |
| Pre-deploy | Infrastructure as code → Trivy |

The catalog comes from the API (`GET /pipeline/stages`, field `available`); `core/pipeline.ts` holds the same defaults as a fallback. Stages with `available: false` (DAST) are hidden in the pipeline editor and on the Policies page and are never enabled by presets. Presets (`Essential`, `Recommended`, `Complete`) toggle stages in bulk; any manual change shows as `Custom`. Stage descriptions and "why it matters" texts live in `i18n.ts` under `stage.<id>.*`. The "Pipeline as code" YAML is a preview for running the same runner in your own CI.

### Scans

- `shared/run-scan-button.ts` calls `POST /repositories/{name}/scans` and opens the new run; a 409 (monthly limit) is shown inline. It is used on the Repositories list and repository settings.
- Onboarding accepts **SSH URLs only** (public repositories too — the deploy key proves the user controls the repository). The API generates a read-only ed25519 deploy key and does not queue a scan; Run scan stays disabled until access is verified; `features/repo-settings/repo-access.ts` (Deploy Key tab) shows the public key with per-provider steps (GitHub / GitLab / Bitbucket / other), the server host key (pinned or recorded on first use), **Test access** (`POST /repositories/{name}/access/checks`, polls `GET …/access` every 2 s while queued/running) and **Rotate key** (`POST …/access/key`). `ProjectSummary.access` (`public`/`ssh`) and `accessStatus` (`pending`/`verified`/`failed`) drive the list tags. The private key is never sent to the browser.
- Scan schedule (`shared/scan-settings.ts`, onboarding + General tab): `manual` (default) or the timed `6h` / `24h` / `7d` (a legacy `push` value is shown as Manual). Automatic actions and the build environment are not shown; their defaults are still sent. Timed schedules need the `scheduledScans` feature (`OrgContext.hasFeature()`, from the membership's `features`); without it the select is locked with an "Available on request" tag linking to Usage and a saved timed schedule is shown as inactive (the API answers `403 feature-not-enabled` to new ones). With it, `<app-feature-granted feature="scheduledScans">` (`shared/feature-granted.ts`) says “Your organization is allowed to use scheduled scans.” and `ProjectSummary.nextScanAt` is shown in the browser's time zone. The same component marks granted AI triage (scan settings, finding detail) and organization rename (Settings → General); the Usage page and the Reports note show the same wording. Runs queued by the scheduler have trigger `schedule` ("Scheduled").
- Reports (`features/reports/`): "Generate report" needs the `triage` permission (`app-role-notice` otherwise). The API generates reports in the background; the list and the report view poll every 4 s while a report is `generating`, `failed` reports show the reason (`reports.error.<code>`) and a Retry button (`POST /reports/{id}/retry`). Reports whose texts were written by AI (`narrative: 'ai'`, organizations with the `aiTriage` feature) get an "AI-generated" badge and a review disclaimer (also printed); `aiNotice` (`unavailable` / `limit`) explains when the standard summary was used instead. Without the feature the list shows "AI-written summaries are available on request".
- AI triage card (`features/vulnerabilities/vulnerability-detail`): without `aiTriage` it stays locked. With it, the cached explanation is loaded from `GET /findings/{id}/insight` (404 = none yet; in CVE mode, for the first occurrence in the selected repository); "Explain with AI" (`triage` permission, `app-role-notice` otherwise — so the administrators' read-only view only sees cached ones) calls `POST /findings/{id}/insight` and shows Impact / Exploitable when / Priority / Fix with an "AI-generated" badge, a review disclaimer, the date and model, and a note when the text language differs from the reader's. `429 ai-limit`, `503 ai-unavailable` and `502 ai-failed` get their own messages. The backend caches one explanation per organization, CVE (or rule) and package version, so asking again is free.
- Findings have a `kind` (`vulnerability`, `secret`, `code`, `config`, `license`). Only vulnerabilities carry CVE/CVSS/package; the others carry `ruleId` and `location`. Detail URLs are `/<org>/vulnerabilities/<CVE>` (all occurrences of a CVE) or `/<org>/vulnerabilities/<finding id>` for other kinds.

## Authentication

Sign-in uses Keycloak as the OpenID Connect provider with the Artemis login theme (backend `keycloak/themes/artemis`): `/login` forwards straight to it (the page stays only as a fallback when the identity provider is unreachable) and passes `ui_locales` with the app language. Realm `artemisappsec`, Authorization Code + PKCE, public client `artemisappsec-web`). `Auth.register()` opens Keycloak's sign-up form (`prompt=create`; Terms acceptance happens there; e-mail verification is off). Every route under the app shell is protected by `authGuard`; the access token is kept in `localStorage` (shared by all tabs, so the public home page can show the signed-in user) and sent as a Bearer token to the API only — `apiPath()` (`core/api/api.ts`) matches the API by parsed origin and whole path prefix before any interceptor adds the token or headers. The stored session is removed as soon as the access token expires, on a 401 and before the sign-out redirect, so no stale access or refresh token stays in the browser; the scope never includes `offline_access`. The user badge (`shared/user-badge.ts`) links to the Keycloak account console (`<authority>/account`). "Sign out" is RP-initiated logout (`signoutRedirect`, back to `/`), ending the Keycloak session too.

## Organizations and permissions

- Every org-scoped API call carries `X-Artemis-Organization: <slug>` (added by `orgInterceptor` from the URL slug; not sent to `/me/**` and `/organizations`). A `404` with code `organization-not-found` drops the membership and goes to `/organizations`; a `403` reloads the memberships (the role may have changed).
- `OrgContext.current()` holds the role and permission list returned by the API (`viewFindings`, `triage`, `pipelines`, `integrations`, `team`, `billing`). Gate actions with `org.can('<permission>')`; the API enforces the same matrix.
- When a permission is missing, don't hide the feature: disable the controls (wrap forms in `<fieldset class="contents" [disabled]>`), and show `<app-role-notice permission="…" />` or a `title` with `org.reason('<permission>')` ("Your role (Viewer) can't …").
- The shell re-creates its `<router-outlet>` when the slug changes, so pages reload their data after switching organization from the sidebar.
- The slug is always derived from the organization name by the API (`core/org/slug.ts` mirrors it for the preview); there is no slug field to edit. Renaming (Settings → General) needs the `organizationRename` feature (`403 feature-not-enabled` otherwise; the name field is locked until the Artemis administrators enable it) and moves the page to the new `/<slug>/settings` via `OrgContext.rename()`.
- Optional features come with each membership (`OrganizationSummary.features`); `OrgContext.hasFeature()` gates them and `OrgContext.aiLabel()` gives the AI lock text ("Available on request · coming soon" / "Enabled for your organization · coming soon"). Each account can own one organization (`409 organization-limit`).
- **Platform administrators** (Keycloak realm role `artemis-admin`; not the organization `admin` role): `Account` (`core/auth/account.ts`) loads `GET /me` once and exposes `platformAdmin`. `/admin` (unprefixed, `authGuard` + `adminGuard`, others go to `/`) lists every organization's metadata (`GET /admin/organizations`, search by name/slug, paginated) with a switch per optional feature (`PUT /admin/organizations/{slug}/features`, saved per change), **Open** (→ `/<slug>/dashboard`, read-only) and **Delete** (dialog; the admin types the slug; `DELETE /admin/organizations/{slug}`). The role grants no membership. Links: top bar (hidden below 600px) and the home workspace header.
- **Admin → Users** (`features/admin/admin-users.ts`, second tab of `/admin`): `GET /admin/users?search=&max=200` (server-side search, debounced; the returned page is paginated client-side; a note appears when `total` exceeds it) with name, username, e-mail, created, “Administrator” tag and organization chips `slug · Role` (→ `/<slug>/dashboard`, read-only). **Delete** (dialog; the admin types the username; `DELETE /admin/users/{id}`) is disabled with the reason for the admin's own account (`Profile.subject` = token `sub`), other administrators and owners of organizations (listed). `503 user-management-disabled` shows “User management isn't configured” (the API's Keycloak service-account client is missing; see the backend README).
- **Admin view:** when an administrator opens `/<slug>/…` of an organization they don't belong to, `orgGuard` calls `OrgContext.view(slug)` (`GET /admin/organizations/{slug}`), which adds a synthetic entry (`role: 'viewer'`, `permissions: ['viewFindings']`, `adminView: true`) used by `current()`/`can()` — so every write control is locked by the usual gating — and shown in the sidebar switcher (`OrgContext.switcher()`, marked "Read-only") only while it is open. The shell shows a read-only banner and the role tag "Viewer · Administrator". The API enforces the same fixed viewer permissions; the admin's membership role wins when they are also a member.
- Runs that end before any stage runs give their monthly scan back; the run detail shows a note when `quotaRefunded` is true.

## Invitations

Invitations are one-time links (Artemis sends no e-mails yet, and e-mail verification is off, so matching by e-mail would let anyone who registers the invited address join). `POST /invitations` and `…/{id}/resend` return a `token` once; the Team page shows `${origin}/invite/<token>` with a Copy button and never again. Resending replaces the token, so older links stop working. Opening a link never joins by itself: the invitee confirms the organization and role first, so a link sent by someone else can't add an account to an organization silently.

The `orgInterceptor` adds `X-Artemis-Organization` from the URL only when a request doesn't set it; requests that name their own organization (the home workspace cards) keep it.

## Talking to the API

- **Reads** use `httpResource()` in the component; show its state with `<app-request-state [resource]="...">` (loading, error with retry).
- **Writes** go through the module's client service (e.g. `ProjectsApi`) with `HttpClient`; show `problemMessage(err)` on failure.
- Types in `core/api/*.ts` mirror the backend JSON exactly (same enum strings).
- AI: report texts, the supply chain review of dependency (SBOM) reports and per-finding explanations (`/findings/{id}/insight`) come from the API.
- Reports: `summary`, `compliance` and `dependencies` (latest SBOM of each repository; no period, `report-view` renders its own sections). On a CVE page status changes apply to the repository chosen in the Status card (`scope`), never to every repository with that CVE.

## Internationalization

All UI text is available in English (`en-US`) and Brazilian Portuguese (`pt-BR`). Keys are typed: `i18n.t()` only accepts keys that exist in the dictionary. Long-form content lives in per-feature files (`home-content.ts`, `help-content.ts`) keyed by language.

## User documentation (Help page)

End-user docs live in the app at `/help`, with content in `src/app/features/help/help-content.ts` (`HELP['en-US']` and `HELP['pt-BR']`). Sections are lists of typed blocks: `p`, `ul`, `ol`, `note`, `table`.

## Contributing

- **How to contribute:** see [CONTRIBUTING.md](CONTRIBUTING.md) (contributions are licensed under MIT).
- **Branches:** `main` (stable) and `dev` (integration). Create `feat/*` or `bugfix/*` branches from `dev`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Every change** must update, in the same commit:
  - the in-app Help content, in both languages, when user-facing behavior changes;
  - this README, when structure, routes or conventions change.

## License

Artemis is fully open source under the [MIT License](LICENSE): anyone may use, copy, modify, distribute and sell it, with no restrictions beyond keeping the license notice. Contributions are welcome and are licensed under the same terms (see [CONTRIBUTING.md](CONTRIBUTING.md)). The security tools run by the scanner (Gitleaks, Semgrep CE, Trivy, Grype, Syft, Hadolint) are separate programs under their own licenses; see the in-app Third-party notices page (`/licenses`) and the backend's `scanner/THIRD_PARTY_NOTICES.md`.

## About

Artemis is a **fictional product** created for an academic presentation and developed by [leonardorscarpitta](https://github.com/leonardorscarpitta). The developer claims no ownership of the code or of the name: there is no Artemis company, "Artemis" is not a registered trademark, and the project is not affiliated with NASA's Artemis program or any other product named Artemis. The in-app texts (Privacy Policy, Terms of Use, footer) are written as if Artemis were a real service, for the demonstration. Anyone running their own instance is responsible for it and for the data it stores.
