# LUXIA Key — Foundation V1

Official UI: LUXIA Key Personal — UX Baseline V1, preserved at root. `pnpm dev` runs the existing 16-screen prototype; it is a simulation, not a security product deployment.

Use Node 24.13.0, `corepack enable`, then `corepack pnpm install --frozen-lockfile`. `pnpm build` builds the prototype and separate API. `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:integration` are required gates. PostgreSQL integration needs a dedicated TEST_DATABASE_URL ending /luxia_test and fails if unavailable.

For development API, configure .env.example values in process environment, run `pnpm db:migrate`, then `pnpm api`. The API is loopback-only and requires same-origin proxy routing in a future real web app. The SDK has no fallback. The frozen UI is intentionally not wired to it.

Read AGENTS.md, docs/architecture/ARCHITECTURE.md, docs/security/SECURITY-INVARIANTS.md and .ai/HANDOFF.md. Architecture review and real authenticator certification remain required before release. No main merge, production deployment or baseline tag is performed by this task.
