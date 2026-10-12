# Architecture — source of truth

Status: Foundation V1 prepared for review, not a production release. This document owns boundaries and lifecycle; linked protocols own detailed rules; SQL migrations own physical schema. Other documents must link rather than redefine them.

Browser SDK (`packages/sdk-js`) → same-origin HTTPS API (`services/api`) → SimpleWebAuthn server verification → portable PostgreSQL.
The React prototype stays at repository root until the staged migration. Its historical UX is preserved with only the documented HTTPS-link validation correction (../product/UX-SECURITY-PATCHES.md). It is a demo, has no security authority, and does not import or invoke the API. The SDK has no simulation or local-server fallback.

API endpoints: POST /api/webauthn/register/options, register/verify, auth/options, auth/verify; POST /api/session/read, logout, revoke-all. JSON only, bounded body, exact configured Origin and X-Luxia-Request: 1, no cross-origin CORS. TLS terminates at a trusted same-origin reverse proxy in a future deployment; API binds loopback. Never trust arbitrary forwarded headers.

Registration creates a fresh random identity only after verification. A human display name is not an account lookup or ownership claim. Additional credential enrollment is deliberately unavailable. Discoverable authentication resolves user from stored credential and checks userHandle, active state, revocation and signature. Missing state denies.

Challenges are consumed by one committed conditional UPDATE before verification, including unsuccessful verification. Success writes credential/counter/session and audit in a transaction. Database or audit failure denies. Authentication locks security state then credential then session; revoke-all uses the same user lock. No network calls occur under row locks. Session rotation on successful authentication invalidates the presented old token and issues a fresh 256-bit token; one-hour absolute expiry does not slide.

Audit uses fixed event fields and static reason codes; no raw request, token, exception or arbitrary details are persisted. IP and user agent collection is intentionally absent until a retention/privacy decision. Append-only trigger protects against application mutation, not a database administrator; external immutable retention is a release prerequisite.

Data: DATA-MODEL.md. Protocol: ../protocol/WEBAUTHN-PROTOCOL.md. Threats: ../security/THREAT-MODEL.md. Verification: ../testing/TEST-MATRIX.md. Scope exclusions: signed actions, QR, pairing, production TOTP/recovery/lock, social integrations, AI risk, native apps.

Operational limits: per-process rate limiting is a development control; distributed abuse prevention, backup/restore, alerting, retention/cleanup, deployment least privilege, HA and physical authenticator certification are prerequisites for production. Do not treat a synced passkey as a hardware-bound device identity.
