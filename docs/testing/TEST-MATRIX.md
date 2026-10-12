# Test matrix and evidence classes

Unit: configuration, immutable migration manifest, algorithm policy, token/hash representation. Security: runtime/cookie downgrade denial, API failure/denial propagation and exact UX preservation. PostgreSQL integration: actual SQL migrations/startup validation and SimpleWebAuthn verification with synthetic P-256/RSA test credentials. Ed25519/unknown COSE credentials are negative policy fixtures, never physical certification.

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
| R1 missing/invalid mode, public dev denial, forged headers | security/runtime-cookies.test.ts (SQL double identified) |
| R1 staging/production flow and verified session cookie flags | integration/core.test.ts (real SQL / synthetic signature) |
| R2 ES256/RS256 success, Ed25519/unknown denial | unit/algorithm-policy.test.ts and integration/core.test.ts |
| R3 table/metadata/version/checksum/permission/timeout/outage gate | integration/startup.test.ts (real PostgreSQL; isolated schemas/roles) |
| R3 read-only validation and actual listener only after valid schema | integration/startup.test.ts |
| R3 asynchronous ordering | unit/startup-manifest.test.ts (mock supplement; not SQL evidence) |
| R4 malformed-then-valid, wrong binding, crypto failure/replay | integration/core.test.ts (real SQL and library) |
| Real browser, virtual authenticator | NOT RUN; future certification harness |
| Real browser / physical authenticator | NOT RUN; human device matrix required |

Synthetic fixtures exercise real library verification but are never real authenticator certification. A green workflow does not certify devices, production operations, or future product capabilities. Missing PostgreSQL fails rather than skips integration tests. Exact run/commit results belong in .ai/HANDOFF.md and verification report.
The previous HTTPS-origin configuration unit case now supplies mandatory trusted runtime explicitly; its trust assertions remain unchanged. The previous all-failures-burn prose is replaced by the stronger precise bound-attempt contract (ADR 0001) and real SQL lifecycle regressions. No old negative test is removed or relaxed.
