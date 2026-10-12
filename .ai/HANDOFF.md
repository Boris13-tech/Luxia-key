# LK-FOUNDATION-001 handoff

PROJECT: LUXIA Key
TASK: LK-FOUNDATION-001
OWNER: Codex
BASE SHA: 4d61d941b94111f0977056a840827e97e092f73c
HEAD SHA: resolve `git rev-parse HEAD`; exact tested SHA/run evidence will be recorded after CI
BRANCH: feat/lk-foundation-001
STATUS: foundation prepared; verification in progress; architectural review required
FILES MODIFIED: package/toolchain configuration, .env.example/.gitignore; added governance, architecture/product/security/protocol/testing docs, services/api, packages/sdk-js, conceptual design tokens, tests, CI and reserved target READMEs. All UI baseline files unchanged.
ARCHITECTURE DECISIONS: new clean main-based history; isolated prototype; explicit trusted RP/origin; mandatory UV; new pseudonymous identity enrollment only; PostgreSQL transaction boundary; hash-only sessions; flow-cookie binding; fixed audit schema.
MIGRATIONS: 001_foundation.sql, seven required domain tables plus checksummed migration metadata. Explicit migration command; no production execution.
TEST RESULTS: typecheck passed locally; remaining checks in progress. Synthetic signed credential fixtures are not physical authenticator certification.
CI STATE: pending new branch execution. Old unrelated branch CI failed (run 37892838220).
KNOWN ISSUES: main branch protection absent; prototype remains demo; no real web integration, physical authenticator certification, deployment or production operational controls. Local Docker daemon unavailable.
BLOCKERS: successful exact-head CI evidence and independent architectural review; branch protection required before merge.
NEXT EXACT STEP: run frozen install/lint/unit/security/build/audit and branch GitHub workflows; inspect failures without weakening invariants.
PRODUCTION TOUCHED: NO
SECRETS EXPOSED: NO
