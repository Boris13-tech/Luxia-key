# Security invariants

- Never store private keys server-side or receive/store biometric templates.
- Never implement custom cryptographic algorithms. Use maintained libraries and standard randomness/hash primitives.
- UI simulation is never security; notifications alone never approve an action.
- AI never decides critical authorization.
- No CI bypass, invented PASS, exposed secrets, direct production modifications or weakened tests/invariants.
- Fail closed on uncertain state, unavailable API/database/audit, missing security state, verification failure or untrusted configuration.
- Trust expected RP/origin only from explicit server configuration; require user verification and bound, expiring, single-use challenges.
- Store only session token hashes, and never log raw tokens, recovery codes, TOTP secrets or biometric data.
- Missing or unknown trusted runtime mode denies startup. Public origins never receive development cookie protections; headers cannot select or downgrade runtime mode.
- Registration generation and verification use exactly the immutable server-owned V1 algorithm policy; library defaults cannot widen it.
- No listener/readiness before read-only migration version/checksum validation succeeds against the supported manifest.

These constraints apply equally to both engineering agents. Changes require explicit security/architecture review, never a convenience exception.
