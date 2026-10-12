# LK-FOUNDATION-001 verification

Implementation checkpoint after authorized follow-up: 114983e22513f7a33be8d0908505501d3260f5c0, clean descendant of main baseline 4d61d941b94111f0977056a840827e97e092f73c. No unrelated history merge. PR: https://github.com/Boris13-tech/Luxia-key/pull/1 (draft).

Evidence:
- Foundation, install/typecheck/lint/unit/security/PostgreSQL/restart/build/audit: https://github.com/Boris13-tech/Luxia-key/actions/runs/38262920821 — success.
- CodeQL: https://github.com/Boris13-tech/Luxia-key/actions/runs/38262920881 — success; analysis 1936906254 reported zero findings and marked feature-branch alert 1 fixed. No suppression or dismissal. The historical main scan truthfully reports its original one finding.
- PR merge-ref Foundation: https://github.com/Boris13-tech/Luxia-key/actions/runs/38262926982 — success.
- Gitleaks: Secret scan job succeeded in both Foundation runs.

Twenty-three unit tests, nineteen separate security tests and twenty-four PostgreSQL integration tests pass. Integration uses actual SQL and actual SimpleWebAuthn cryptographic verification with synthetic test authenticators, covering valid registration/authentication, denial paths, concurrent replay, sessions, audit and persistence. A separate job step restarts PostgreSQL and verifies retained marker and credentials. This is not physical-authenticator certification.

Local frozen install/typecheck/lint/unit/security/build/audit passed on Node 24.13.0 and pnpm 11.20.0. Local Docker was unavailable; no local database pass is claimed. No known dependency vulnerabilities reported by pnpm audit at checkpoint. cbor-extract's optional native acceleration build is explicitly disabled; tests use the supported JS encoder. Unused AI/dotenv/direct esbuild dependencies were removed; TypeScript 6.0.3 matches lint tool peer support.

The CI gate caught a setup ordering error (pnpm discovery before Corepack) and a nonstandard tagged-CBOR test fixture. Both were fixed and rerun; no verification invariant was relaxed. Repeated tests have isolated HTTP rate-limit instances, while production request limits remain active.

The original UX Git manifest remains immutable. Every original UI file remains unchanged except the exact two-line HTTPS-link correction documented in ../product/UX-SECURITY-PATCHES.md; the preservation test reconstructs only that patch from the original Git blob and rejects any other component edit. All twelve existing account links have renderer tests. The build's CSS asset remains index-CJGJ4yoG.css, as in the initial baseline-preserving build. Root Vite build emits an existing __dirname deprecation warning and a >500KB bundle warning; neither is suppressed. No destructive move occurred, and ux-baseline-v1 remains a tag proposal.

Main protection and active scanning ruleset 24933031 were applied and read back: app-bound strict required checks, independent approval, stale approval invalidation, admin enforcement, no force push/deletion, and no High/Critical scanning bypass. PR 1 reports REVIEW_REQUIRED and BLOCKED; this is the expected safety gate. See infra/github evidence and ../governance/FOUNDATION-REVIEW.md.
Remaining review gates: independent architecture/schema/protocol and URL-patch approval, physical authenticator certification and production operations. No private key or biometric template is stored by the API. Test authenticator private keys exist only in test process memory. No production data, deployment or secrets were touched.

This report is a checkpoint record. Its own documentation-only commit necessarily has another SHA; confirm the latest exact-head workflow before using the branch. The final delivery report records that SHA outside the Git tree to avoid a self-referential commit hash.
