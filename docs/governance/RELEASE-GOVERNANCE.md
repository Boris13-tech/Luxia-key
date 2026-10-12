# Release governance

No release, merge or production deployment in LK-FOUNDATION-001. A release needs exact commit, immutable CI evidence, independent security/architecture review, migration rehearsal and rollback/restore procedure.
Proposed tag `ux-baseline-v1` targets exactly `4d61d941b94111f0977056a840827e97e092f73c`. It labels the historical UX reference, not a certified or reproducibly locked security release. The manifest records its UI blobs. Tag creation is deferred to review; no tag has been created.
Versioned schema migrations are forward-only and checksummed. Restore rehearsal and least-privilege deployment credentials are release blockers. Never rewrite an applied migration to make a test pass.

Autonomous Foundation remediation may correct in-scope review failures and obtain another distinct technical review, never self-approve or bypass protections. Each meaningful code change requires new exact-head gates and independent examination. Foundation merge review also requires a real browser/platform-or-hardware authenticator smoke test, eligible second-account GitHub approval, resolved conversations and an up-to-date branch. Full production operational certification is a later release gate, not a prerequisite for integrating Foundation. Neither technical PASS nor a Foundation merge authorizes production or Phase 2.
