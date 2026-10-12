# LK-FOUNDATION-001 handoff

PROJECT: LUXIA Key
TASK: LK-REMEDIATION-001
OWNER: Codex
BASE SHA: 4d61d941b94111f0977056a840827e97e092f73c
HEAD SHA: f6c31a38e97c9503a40e55df73d719f772d4ebd5 (remediation implementation checkpoint verified by CI; final documentation HEAD is resolved by git rev-parse HEAD and PR 1)
BRANCH: feat/lk-foundation-001
STATUS: R1–R4 implemented and automated gates passed at checkpoint; final exact-head gates and distinct LK-REVIEW-002 pending; no Phase 2 work
FILES MODIFIED: package/toolchain configuration, .env.example/.gitignore; added governance, architecture/product/security/protocol/testing docs, services/api, packages/sdk-js, conceptual design tokens, tests, CI and reserved target READMEs. Follow-up adds infra/github policy/evidence, HTTPS URL contract, tests and exactly two changed lines in Screen6AccountDetail. Original UX manifest and every other baseline file unchanged.
ARCHITECTURE DECISIONS: preserve the original architecture and UX; ADR 0001 owns explicit immutable runtime/cookie policy, shared V1 ES256/RS256 allowlist, read-only exact migration manifest startup gate and bounded-attempt challenge semantics. No custom crypto or implicit production migration.
MIGRATIONS: 001_foundation.sql, seven required domain tables plus checksummed migration metadata. Explicit migration command; no production execution.
TEST RESULTS: local frozen install/typecheck/lint/build/audit passed; 30 unit and 34 security tests PASS. At implementation checkpoint, GitHub ran 35 core SQL tests plus 14 real PostgreSQL startup tests, with process restart persistence, Gitleaks and dependency audit PASS. Total 113 automated tests. Additional remediation regressions are included in those totals; no mock or synthetic fixture is physical certification.
CI STATE: checkpoint Foundation 38272028923 / PR 38272034590 and CodeQL 38272028939 / PR 38272034592 succeeded; actual latest branch analysis reported zero findings. Final documentation HEAD must get its own green checks and distinct LK-REVIEW-002. Original LK-REVIEW-001 FAIL is preserved and cannot approve this new code.
KNOWN ISSUES: prototype remains demo; no real web integration, physical authenticator certification, deployment or production operational controls. Local Docker daemon unavailable; PostgreSQL evidence came from disposable GitHub service containers. Existing Vite config deprecation and large-chunk warnings remain documented. Main code remains the historical baseline pending approved merge; its historical scanner finding is not rewritten or dismissed.
BLOCKERS: no external blocker prevents automated remediation/CI/review. Eligible separate GitHub approval and real authenticator/human UV remain later external gates. Main protection and ruleset 24933031 remain active. Production operational certification is a later release gate, not a premature Foundation-merge requirement.
NEXT EXACT STEP: obtain all final exact-head gates, then launch a distinct LK-REVIEW-002 agent against that immutable SHA. Fix any in-scope failures autonomously, never self-approve, bypass protection, merge, deploy or start Phase 2. Current sealed results/reviewer reports are exported outside the Git tree to avoid self-referential HEAD hashes; Claude Code can resume from this checkpoint plus git rev-parse HEAD and the latest sealed review report.
PRODUCTION TOUCHED: NO
SECRETS EXPOSED: NO
