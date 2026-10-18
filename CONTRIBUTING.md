# Contributing to Artemis

Thanks for your interest! Issues, ideas and pull requests are welcome.

## License of contributions

Artemis is open source under the [MIT License](LICENSE). By submitting a contribution (a pull request, patch or any other material) you confirm that it is your own work, or that you otherwise have the right to submit it, and you agree that it is licensed under the same MIT License as the rest of the project.

## How to contribute

1. Fork the repository and create a branch from `dev`: `feat/<short-name>` or `bugfix/<short-name>`.
2. Run everything in Docker — no local toolchain is required: `docker compose up -d` (serves http://localhost:4200; the backend stack must be running too — see its README).
3. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`feat: ...`, `fix: ...`, `docs: ...`).
4. Before opening the pull request, `docker compose exec frontend npx ng build --configuration development` must finish without errors.
5. Open the pull request against `dev` and describe what changed and why.

Other rules:

- Keep changes focused; don't mix refactors with features.
- Update the README when structure, routes, endpoints or conventions change.
- User-facing changes must update the in-app guide (`src/app/features/help/help-content.ts`) in **both** languages (en-US and pt-BR).
- Never commit secrets (`.env`, `keycloak/secrets/` and similar are git-ignored).
