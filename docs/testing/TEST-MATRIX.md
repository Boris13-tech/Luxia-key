# Test matrix and evidence classes

Unit: configuration validation and token generation/hash representation. Security: API failure/denial propagation and exact UX preservation. PostgreSQL integration: actual SQL migrations and SimpleWebAuthn verification with synthetically generated P-256 test credentials.

| Required behavior | Evidence |
|---|---|
| Registration options and valid flow | integration/core.test.ts |
| Invalid/expired/replayed challenge | integration/core.test.ts |
| Wrong origin/RP, missing UV/binding | integration/core.test.ts |
| Authentication success, expiry/replay, revoked credential | integration/core.test.ts |
| Signature, userHandle, security state | integration/core.test.ts |
| Concurrent replay | integration/core.test.ts |
| Session creation, expiry, logout, revoke-all | integration/core.test.ts |
| Audit payload exclusion / append-only | integration/core.test.ts |
| Persistence / new API and pool | integration/core.test.ts |
| PostgreSQL process restart persistence | CI restart probe |
| Real browser, virtual authenticator | NOT RUN; future certification harness |
| Real browser / physical authenticator | NOT RUN; human device matrix required |

Synthetic fixtures exercise real library verification but are never real authenticator certification. A green workflow does not certify devices, production operations, or future product capabilities. Missing PostgreSQL fails rather than skips integration tests. Exact run/commit results belong in .ai/HANDOFF.md and verification report.
