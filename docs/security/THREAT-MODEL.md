# Threat model

Assets: credential public-key integrity, user-to-credential binding, session authority, challenge freshness, audit integrity. Boundaries: browser/API, API/PostgreSQL, deployment configuration, CI supply chain, isolated demo.

| Threat | Control | Residual risk / release gate |
|---|---|---|
| Replay/race | Atomic challenge consumption, TTL, credential row locks | Load/concurrency testing at deployment scale |
| Phishing/origin spoof | Trusted RP and exact origin verification | RP/domain ownership and TLS operations |
| Login CSRF | Flow cookie, same-origin custom header, Origin allowlist, strict cookies | XSS remains same-origin authority |
| Existing identity takeover | No anonymous existing-account enrollment | Additional credential protocol deferred |
| Credential clone/revocation | Library counter check, revoked check and state guard | Synced passkeys do not prove physical device |
| Session theft/fixation | 256-bit token, hash-only storage, HttpOnly, Secure production, expiry and rotation | Compromised browser/endpoint |
| Audit injection/secrets | Static allowlist, no raw payload logs, transactional success | DB administrator can bypass triggers; immutable sink needed |
| API/database outage | Denial, no frontend fallback | Availability/backup/restore not certified |
| Resource exhaustion | Body bounds, per-process rate cap, SQL timeouts | Distributed limits and cleanup required |
| Supply chain | Lockfile, audit, Gitleaks, CodeQL, reviewed PR | Branch protection still requires activation |

Biometrics stay with OS/authenticator; WebAuthn UV does not report a specific Face ID method. No recovery, AI decision, signed-action or device pairing claim.
