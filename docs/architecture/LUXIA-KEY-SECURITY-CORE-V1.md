# LUXIA Key Security Core v1 - Architecture Specification

## 1. System Mission & Identity
LUXIA Key is a zero-trust, sovereign authenticator and identity management platform engineered according to FIDO Alliance WebAuthn, W3C standards, and RFC security guidelines. LUXIA Key eliminates shared secrets, static passwords, and client-side credential exposure.

## 2. Cryptographic & Security Invariants
1. **Zero Private Key Storage on Server**: Private keys are generated exclusively within the client device hardware Secure Enclave / TPM / FIDO2 security chip and never leave the authenticator.
2. **Zero Biometric Data Transmission**: Biometric data (Touch ID, Face ID, Windows Hello) remains strictly confined to the local OS hardware abstraction layer. Neither the server nor the application JavaScript ever receives, stores, or processes raw biometric vectors.
3. **No Homebrew Cryptography**: All cryptographic primitives rely exclusively on audited FIDO2/WebAuthn standard specifications (`@simplewebauthn/server`, `@simplewebauthn/browser`), Node.js native `crypto`, and W3C Web Cryptography API.
4. **Replay-Immune Challenges**: Authentication and registration challenges are cryptographically random, ephemeral (TTL $\le 300\text{s}$), strictly single-use, and bound to the cryptographic origin and RP ID.
5. **Session Isolation & Defense-in-Depth**:
   - Ephemeral session tokens stored via `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
   - Dedicated Anti-CSRF token verification on mutation endpoints.
   - Session rotation upon privilege escalation or re-authentication.
6. **Immutable Audit Trails**: Every challenge issue, registration, authentication attempt, session revocation, and security posture change produces an append-only, tamper-evident audit record.

## 3. Threat Boundaries & System Topology
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Edge Environment                  │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │  Secure Enclave / TPM │       │ WebAuthn Authenticator│  │
│  │   (Hardware Keystore) │       │ (Face ID / Passkey)   │  │
│  └───────────▲───────────┘       └───────────▲───────────┘  │
│              │ W3C Credentials API           │              │
│  ┌───────────▼───────────────────────────────▼───────────┐  │
│  │           LUXIA Key Frontend Application              │  │
│  │   (@simplewebauthn/browser, UI state machine)         │  │
│  └───────────────────────────▲───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTPS (TLS 1.3)
                               │ Origin & RP ID verification
┌──────────────────────────────▼──────────────────────────────┐
│                    LUXIA Core Backend API                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Session & Anti-CSRF Middleware (Cookie & Header)     │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  WebAuthn Registration & Verification Controller      │  │
│  │  (@simplewebauthn/server, challenge replay protector) │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  Audit Event Logger (Structured, zero secrets)       │  │
│  └───────────────────────────▲───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼───────────────────────────┐  │
│  │         Persistent Relational State Store (DB)        │  │
│  │   - Users & Passkeys (Public Credential Data only)    │  │
│  │   - Ephemeral Challenges (TTL, single-use)            │  │
│  │   - Active Sessions & Audit Events                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 4. Data Models (Minimal Server Footprint)

### 4.1 User
- `id` (UUIDv4)
- `username` (string)
- `displayName` (string)
- `createdAt` (ISO timestamp)
- `updatedAt` (ISO timestamp)

### 4.2 Credential (Public Only)
- `id` (UUIDv4)
- `userId` (UUIDv4)
- `credentialId` (Base64URL encoded)
- `publicKey` (Base64URL encoded COSE/SPKI public key)
- `counter` (integer)
- `deviceType` (string)
- `backedUp` (boolean)
- `transports` (string array: `internal`, `usb`, `ble`, `nfc`, `hybrid`)
- `createdAt` (ISO timestamp)
- `lastUsedAt` (ISO timestamp)
- `revokedAt` (ISO timestamp | null)

### 4.3 AuthenticationChallenge
- `id` (UUIDv4)
- `userId` (UUIDv4 | null)
- `challenge` (Base64URL encoded random bytes)
- `type` (`registration` | `authentication` | `action_signing`)
- `origin` (string)
- `rpId` (string)
- `createdAt` (ISO timestamp)
- `expiresAt` (ISO timestamp)
- `usedAt` (ISO timestamp | null)

### 4.4 Session
- `id` (UUIDv4)
- `tokenHash` (SHA-256 hash of secret cookie token)
- `userId` (UUIDv4)
- `createdAt` (ISO timestamp)
- `expiresAt` (ISO timestamp)
- `lastActivityAt` (ISO timestamp)
- `ipAddress` (string)
- `userAgent` (string)
- `revokedAt` (ISO timestamp | null)

### 4.5 AuditEvent
- `id` (UUIDv4)
- `userId` (UUIDv4 | null)
- `eventType` (string, e.g. `auth.register.success`, `auth.login.failed`, `session.revoked`)
- `status` (`SUCCESS` | `FAILURE` | `WARNING`)
- `ipAddress` (string)
- `userAgent` (string)
- `details` (JSON without credentials or secrets)
- `timestamp` (ISO timestamp)

## 5. Security Modes
- **`SECURITY_MODE=real`**: All authentication, registration, and action signing execute real WebAuthn and cryptographic challenge-response validation. No simulated timers or mock approvals are permitted. Any hardware or validation failure returns `401/403 DENY`.
- **`SECURITY_MODE=demo`**: Visual presentation mode explicitly watermarked with `DEMO` badges to preserve UI demonstrations without misleading users about cryptographic assurance.
