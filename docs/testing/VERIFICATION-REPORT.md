# LK-FOUNDATION-001 verification

Implementation checkpoint: 8060b81ee228c2cf42cfc0de4c8e2066195faa65, clean descendant of main baseline 4d61d941b94111f0977056a840827e97e092f73c. No unrelated history merge. PR: https://github.com/Boris13-tech/Luxia-key/pull/1 (draft).

Evidence:
- Foundation, install/typecheck/lint/unit/security/PostgreSQL/restart/build/audit: https://github.com/Boris13-tech/Luxia-key/actions/runs/38216500219 — success.
- CodeQL execution: https://github.com/Boris13-tech/Luxia-key/actions/runs/38216500215 — success. This does not mean zero findings; alert 1 has explicit author triage and remains open for independent review.
- PR merge-ref Foundation: https://github.com/Boris13-tech/Luxia-key/actions/runs/38216503228 — success.
- Gitleaks: Secret scan job succeeded in both Foundation runs.

Eight unit tests and six separate security tests pass. PostgreSQL integration uses actual SQL and actual SimpleWebAuthn cryptographic verification with synthetic test authenticators, covering valid registration/authentication, denial paths, concurrent replay, sessions, audit and persistence. A separate job step restarts PostgreSQL and verifies retained marker and credentials. This is not physical-authenticator certification.

Local frozen install/typecheck/lint/unit/security/build/audit passed on Node 24.13.0 and pnpm 11.20.0. Local Docker was unavailable; no local database pass is claimed. No known dependency vulnerabilities reported by pnpm audit at checkpoint. cbor-extract's optional native acceleration build is explicitly disabled; tests use the supported JS encoder. Unused AI/dotenv/direct esbuild dependencies were removed; TypeScript 6.0.3 matches lint tool peer support.

The CI gate caught a setup ordering error (pnpm discovery before Corepack) and a nonstandard tagged-CBOR test fixture. Both were fixed and rerun; no verification invariant was relaxed. Repeated tests have isolated HTTP rate-limit instances, while production request limits remain active.

UX files remain byte-identical by Git blob hash. Root Vite build emits an existing __dirname deprecation warning and a >500KB bundle warning; neither is suppressed. The baseline source is frozen, no destructive move occurred, and ux-baseline-v1 remains a tag proposal.

Remaining review gates: activate main branch protection, independently triage CodeQL alert 1, review architecture/schema/protocol, certify physical authenticators and production operations. No private key or biometric template is stored by the API. Test authenticator private keys exist only in test process memory. No production data, deployment or secrets were touched.

This report is a checkpoint record. Its own documentation-only commit necessarily has another SHA; confirm the latest exact-head workflow before using the branch. The final delivery report records that SHA outside the Git tree to avoid a self-referential commit hash.
