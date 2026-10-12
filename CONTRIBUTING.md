# Contributing

Use Node 24.13.0 and Corepack with packageManager's pinned pnpm. Run `corepack pnpm install --frozen-lockfile`.
Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:integration`, `pnpm build`, `pnpm audit --audit-level=high`.
Integration tests require a dedicated TEST_DATABASE_URL ending in /luxia_test; missing PostgreSQL fails the gate.
Use feature branches based on main, focused commits and reviewed pull requests. Include architecture impact, threat changes, migrations, test evidence and rollback plans.
No force pushes to shared branches, unrelated-history merges, generated lockfile edits, or undocumented CI exceptions.
See docs/governance/ENGINEERING-GOVERNANCE.md and docs/architecture/MIGRATION-PLAN.md.
