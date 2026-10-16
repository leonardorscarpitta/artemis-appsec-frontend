# Contributing to Artemis

Thanks for your interest! Issues, ideas and pull requests are welcome.

## License of contributions

Artemis is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE.md): you may use, study, modify and share it for **noncommercial purposes**. Commercial use — including selling it, offering it as a paid service or charging for access — is reserved to the copyright holder.

By submitting a contribution (a pull request, patch, or any other material) you agree that:

1. The contribution is your original work, or you otherwise have the right to submit it.
2. You grant Leonardo Scarpitta (the licensor) a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license to use, reproduce, modify, distribute and sublicense your contribution, **including for commercial purposes and under other license terms**.
3. Everyone else receives your contribution under the same PolyForm Noncommercial License 1.0.0 as the rest of the project.

If you cannot agree to these terms, please open an issue describing the change instead of a pull request.

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
- Never commit secrets (`.env`, `authelia/secrets/` and similar are git-ignored).
