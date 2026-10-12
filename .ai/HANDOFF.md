# LK-FOUNDATION-001 handoff

PROJECT: LUXIA Key
TASK: LK-REMEDIATION-001
OWNER: Codex
BASE SHA: 4d61d941b94111f0977056a840827e97e092f73c
HEAD SHA: be526ac341ad139f4140bb6eb8dd74e6abc0b501 (original independently reviewed remediation base; current task HEAD is resolved by git rev-parse HEAD and PR 1)
BRANCH: feat/lk-foundation-001
STATUS: correcting R1–R4 under autonomous Foundation mandate; new exact-head CI and LK-REVIEW-002 pending; no Phase 2 work
FILES MODIFIED: package/toolchain configuration, .env.example/.gitignore; added governance, architecture/product/security/protocol/testing docs, services/api, packages/sdk-js, conceptual design tokens, tests, CI and reserved target READMEs. Follow-up adds infra/github policy/evidence, HTTPS URL contract, tests and exactly two changed lines in Screen6AccountDetail. Original UX manifest and every other baseline file unchanged.
ARCHITECTURE DECISIONS: preserve the original architecture and UX; ADR 0001 owns explicit immutable runtime/cookie policy, shared V1 ES256/RS256 allowlist, read-only exact migration manifest startup gate and bounded-attempt challenge semantics. No custom crypto or implicit production migration.
MIGRATIONS: 001_foundation.sql, seven required domain tables plus checksummed migration metadata. Explicit migration command; no production execution.
TEST RESULTS: local remediation frozen install/typecheck/lint/build/audit passed; 30 unit and 34 security tests passed before the final small metadata-refusal test addition. Real PostgreSQL startup/lifecycle/session/algorithm regressions are pending new exact-head CI; no mocked test is called SQL or physical certification.
CI STATE: previous original reviewed HEAD gates passed; this remediation needs its own exact-head Foundation/Secret scan/CodeQL evidence. Independent LK-REVIEW-001 found three P2 and one P3 despite the prior green gates. Do not reuse old review or CI for this new code.
KNOWN ISSUES: prototype remains demo; no real web integration, physical authenticator certification, deployment or production operational controls. Local Docker daemon unavailable; PostgreSQL evidence came from disposable GitHub service containers. Existing Vite config deprecation and large-chunk warnings remain documented. Main code remains the historical baseline pending approved merge; its historical scanner finding is not rewritten or dismissed.
BLOCKERS: no external blocker prevents automated remediation/CI/review. Eligible separate GitHub approval and real authenticator/human UV remain later external gates. Main protection and ruleset 24933031 remain active. Production operational certification is a later release gate, not a premature Foundation-merge requirement.
NEXT EXACT STEP: commit/push the remediation to feat/lk-foundation-001, obtain all new exact-head automated gates including real PostgreSQL startup tests, then launch a distinct LK-REVIEW-002 agent. Fix any in-scope failures autonomously, never self-approve, bypass protection, merge, deploy or start Phase 2. Current sealed results/reviewer reports are exported outside the Git tree to avoid self-referential HEAD hashes.
PRODUCTION TOUCHED: NO
SECRETS EXPOSED: NO
