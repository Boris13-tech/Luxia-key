# Architecture — source of truth

Status: Foundation V1 prepared for review, not a production release. This document owns boundaries and lifecycle; linked protocols own detailed rules; SQL migrations own physical schema. Other documents must link rather than redefine them.

Browser SDK (`packages/sdk-js`) → same-origin HTTPS API (`services/api`) → SimpleWebAuthn server verification → portable PostgreSQL.
The React prototype stays at repository root until the staged migration. Its historical UX is preserved with only the documented HTTPS-link validation correction (../product/UX-SECURITY-PATCHES.md). It is a demo, has no security authority, and does not import or invoke the API. The SDK has no simulation or local-server fallback.

API endpoints: POST /api/webauthn/register/options, register/verify, auth/options, auth/verify; POST /api/session/read, logout, revoke-all. JSON only, bounded body, exact configured Origin and X-Luxia-Request: 1, no cross-origin CORS. TLS terminates at a trusted same-origin reverse proxy in a future deployment; API binds loopback. Never trust arbitrary forwarded headers.

Registration creates a fresh random identity only after verification. A human display name is not an account lookup or ownership claim. Additional credential enrollment is deliberately unavailable. Discoverable authentication resolves user from stored credential and checks userHandle, active state, revocation and signature. Missing state denies.

Malformed envelopes and unparseable/unbound challenges deny before consumption. A valid-shaped, bound verification attempt consumes its challenge by one committed conditional UPDATE before cryptographic verification; failed cryptographic verification cannot restore it. Exact envelope/lifecycle rules are owned by ../protocol/WEBAUTHN-PROTOCOL.md. Success writes credential/counter/session and audit in a transaction. Database or audit failure denies. Authentication locks security state then credential then session; revoke-all uses the same user lock. No network calls occur under row locks. Session rotation on successful authentication invalidates the presented old token and issues a fresh 256-bit token; one-hour absolute expiry does not slide.

Server runtime is mandatory LUXIA_RUNTIME_MODE, validated and frozen independently of NODE_ENV and all request headers. One centralized cookie policy owns session/flow names and flags. Development/test accepts only explicit localhost/loopback origins; staging/production requires HTTPS and Secure HttpOnly host-only cookies, Path=/, SameSite=Strict, __Host- prefixes and no Domain. See ADR 0001 for the conservative policy and compatibility decision.
Startup performs a read-only schema_migrations query and requires the exact supported version/checksum manifest before any listener is invoked. Empty/missing/old/future/mismatched/unreadable state aborts. Deployment migration remains explicit, checks bundled SQL against the authoritative manifest, and refuses unknown metadata; API startup never migrates.

Audit uses fixed event fields and static reason codes; no raw request, token, exception or arbitrary details are persisted. IP and user agent collection is intentionally absent until a retention/privacy decision. Append-only trigger protects against application mutation, not a database administrator; external immutable retention is a release prerequisite.

Data: DATA-MODEL.md. Protocol: ../protocol/WEBAUTHN-PROTOCOL.md. Threats: ../security/THREAT-MODEL.md. Verification: ../testing/TEST-MATRIX.md. Scope exclusions: signed actions, QR, pairing, production TOTP/recovery/lock, social integrations, AI risk, native apps.

Operational limits: per-process rate limiting is a development control; distributed abuse prevention, backup/restore, alerting, retention/cleanup, deployment least privilege, HA and physical authenticator certification are prerequisites for production. Do not treat a synced passkey as a hardware-bound device identity.
