# LUXIA Key v1 - Threat Model Specification

This threat model outlines the 22 core adversarial vectors evaluated against the LUXIA Key Security Core v1 architecture.

---

### 1. Phishing & Fake Domains
- **Attack**: Adversary sets up a lookalike domain (e.g. `lux1a-key.com`) to lure users into submitting authentication credentials.
- **Impact**: Potential unauthorized session establishment or credential interception.
- **Prevention**: WebAuthn cryptographic origin binding. The client browser hardware authenticator directly signs the genuine cryptographic RP ID (`Origin`). Lookalike domains cannot forge valid WebAuthn signatures for `luxia-key.com`.
- **Detection**: Server verifies `clientDataJSON.origin` exactly equals configured origin. Any mismatch is instantly rejected and logged.
- **Recovery**: Origin validation fails silently on attacker site. Audit event logs attempted mismatch.

---

### 2. Adversary-in-the-Middle (AiTM) Reverse Proxy
- **Attack**: Attacker proxies genuine website traffic through an intermediate server (Evilginx, Modlishka) to steal session cookies.
- **Impact**: Cookie interception and session hijacking.
- **Prevention**: WebAuthn public-key authentication is cryptographically un-proxyable because the browser binds the channel binding and RP ID directly to the TLS domain visited by the browser. Cookies are scoped with strict `SameSite=Lax`, `Secure`, and `HttpOnly`.
- **Detection**: Origin mismatch in `clientDataJSON` triggers automated denial and alert.
- **Recovery**: Client session invalidation and IP anomaly flags.

---

### 3. Replay Attacks
- **Attack**: Adversary captures a valid registration or authentication payload and replays it over the network.
- **Impact**: Unauthorized authentication or state manipulation.
- **Prevention**: Every challenge is cryptographically random, ephemeral ($\le 300\text{s}$ TTL), single-use, and consumed atomically. Once verified, the challenge is destroyed immediately.
- **Detection**: Challenge lookup fails with `CHALLENGE_ALREADY_CONSUMED` or `CHALLENGE_EXPIRED`.
- **Recovery**: Replayed request is rejected with `401 Unauthorized`; audit log records security alert with source IP.

---

### 4. Token Theft & Exfiltration
- **Attack**: Adversary compromises client localStorage or network traffic to steal authorization tokens.
- **Impact**: Impersonation of user session.
- **Prevention**: Session tokens are strictly stored in `HttpOnly`, `Secure` cookies inaccessible to JavaScript (`document.cookie` cannot read them). Token rotation occurs on privilege changes.
- **Detection**: Anomaly detection on rapid geographic relocation or concurrent user-agent shifts.
- **Recovery**: Immediate server-side session revocation (`revokeSession`).

---

### 5. Session Hijacking
- **Attack**: Attacker steals an active session cookie via physical access or cross-site vulnerability.
- **Impact**: Full account takeover during session validity window.
- **Prevention**: Short session lifetimes (max 60 minutes of inactivity), sliding inactivity timeout, strict anti-CSRF token verification, and session binding to client IP and User-Agent fingerprints.
- **Detection**: Mismatch in IP/UA or simultaneous active requests from disparate subnets.
- **Recovery**: User or admin invokes "Revoke All Sessions" in LUXIA Key settings; all session tokens matching `userId` are invalidated at rest.

---

### 6. QR Code Relay Attacks
- **Attack**: Attacker displays their own login QR code to a victim, tricking them into scanning it and authorizing the attacker's device.
- **Impact**: Unauthorized device pairing or session authorization.
- **Prevention**: Signed QR protocol with client-bound audience, ephemeral challenge nonce, and mandatory visual confirmation showing the exact requesting device details (OS, location, client IP) prior to cryptographic authorization.
- **Detection**: Replay protection and timestamp TTL check ($\le 300\text{s}$).
- **Recovery**: User clicks "Bloquer" on authentication prompt; challenge is immediately purged and offending device blocked.

---

### 7. Malicious QR Codes
- **Attack**: Malicious actor injects unexpected payloads, exploit strings, or fake URLs into a QR code.
- **Impact**: Buffer overflows, protocol confusion, or arbitrary state corruption.
- **Prevention**: Strict Zod schema validation. Scanner only processes cryptographically signed `luxia-key://v1/` or strictly validated FIDO2/WebAuthn payloads. Unsigned or malformed payloads return `DENY`.
- **Detection**: Schema validation failure logged with payload hash.
- **Recovery**: User presented with "Payload non conforme ou invalide" error; scanner resets state.

---

### 8. Device Theft & Physical Access
- **Attack**: Physical theft of the user's unlocked or locked smartphone/laptop.
- **Impact**: Physical attacker attempts to access accounts.
- **Prevention**: WebAuthn requires User Verification (`userVerification: "required"`), enforcing local biometric confirmation (Face ID/Touch ID) or hardware secure PIN before the private key can sign.
- **Detection**: Local OS lockout after repeated failed biometric attempts.
- **Recovery**: Remote Identity Lock trigger from another paired device or emergency recovery protocol.

---

### 9. Malware & Keyloggers
- **Attack**: Trojan or keylogger running on the host operating system.
- **Impact**: Traditional password interception.
- **Prevention**: LUXIA Key uses Passkeys (FIDO2). There are no passwords to type or log. Private keys never leave the hardware Secure Enclave and cannot be extracted by user-space malware.
- **Detection**: Authenticator signature verification fails if OS keystore is bypassed.
- **Recovery**: Revoke compromised device from other authorized hardware.

---

### 10. Cross-Site Scripting (XSS)
- **Attack**: Malicious script injected into frontend DOM.
- **Impact**: DOM manipulation, UI redressing, or attempted request forgery.
- **Prevention**: Strict Content Security Policy (CSP), React DOM auto-escaping, zero `eval`, zero `dangerouslySetInnerHTML`. Session cookies are `HttpOnly` so XSS cannot exfiltrate session secrets. WebAuthn operations require user gesture and hardware verification.
- **Detection**: CSP violation reports.
- **Recovery**: Clear DOM session state, patch vulnerable component.

---

### 11. Cross-Site Request Forgery (CSRF)
- **Attack**: Malicious site issues cross-origin requests to LUXIA Key backend on behalf of authenticated user.
- **Impact**: Unauthorized state mutation.
- **Prevention**: SameSite=Lax cookie attribute, custom `X-CSRF-Token` header verification on all non-GET endpoints, and origin header enforcement.
- **Detection**: `CSRF_TOKEN_MISMATCH` or missing custom headers.
- **Recovery**: Request rejected with `403 Forbidden`.

---

### 12. Supply-Chain Dependency Compromise
- **Attack**: Malicious code injected into an upstream npm dependency.
- **Impact**: Code execution in build or runtime environment.
- **Prevention**: Strict lockfile (`bun.lock` / `package-lock.json`), dependency minimization, automated `npm audit` and vulnerability gating in CI workflow, zero un-audited cryptographic libraries.
- **Detection**: CI automated vulnerability scan stops build pipeline if vulnerabilities $\ge$ high are identified.
- **Recovery**: Pin safe version or vendor critical primitives.

---

### 13. Recovery Takeover & Hijack
- **Attack**: Adversary attempts to trigger account recovery to hijack victim's identity.
- **Impact**: Total identity takeover.
- **Prevention**: CSPRNG 10 one-time recovery codes stored strictly as one-way cryptographic hashes (`bcrypt` / `argon2` / `scrypt`). 48-hour security timelock delay on recovery procedures with alerts sent to trusted contacts.
- **Detection**: High-severity notification dispatched to all trusted devices upon recovery initialization.
- **Recovery**: Legitimate user can abort recovery during the 48-hour grace period with a single click.

---

### 14. SIM Swapping
- **Attack**: Attacker convinces mobile carrier to reassign victim's telephone number.
- **Impact**: Traditional SMS 2FA interception.
- **Prevention**: LUXIA Key rejects SMS-based 2FA as a primary security vector. All authentication is cryptographically anchored in FIDO2 hardware Passkeys bound to physical device enclaves, rendering SIM swapping useless.
- **Detection**: Account profile flags external phone number update requests as high-risk.
- **Recovery**: Physical device presence required to authorize any profile changes.

---

### 15. Social Engineering & Helpdesk Impersonation
- **Attack**: Attacker impersonates the victim to customer support.
- **Impact**: Manual account recovery bypass.
- **Prevention**: Zero backdoors. No customer service agent or administrator possesses the ability to bypass cryptographic proof or export credentials.
- **Detection**: Social consensus recovery requires independent authorization from configured trusted contacts.
- **Recovery**: Revoke compromised recovery contact.

---

### 16. Deepfake & Synthetic Identity Support Attacks
- **Attack**: Generative audio/video deepfakes used to bypass identity verification.
- **Impact**: Fraudulent identity verification.
- **Prevention**: Automated identity verification relies on cryptographic public-key signatures (W3C Verifiable Credentials & FIDO2), not subjective human video inspection.
- **Detection**: Cryptographic proof validation succeeds or fails deterministically; deepfake media has zero influence on cryptographic math.
- **Recovery**: N/A (crypto proof cannot be generated by synthetic media).

---

### 17. Push Notification Fatigue (MFA Fatigue)
- **Attack**: Adversary bombards victim with hundreds of push authorization requests hoping for accidental approval.
- **Impact**: Accidental authorization of fraudulent login.
- **Prevention**: Rate-limiting on challenge requests, requirement for interactive biometrics (User Verification) on every approval, and automatic account temporary lockdown after 3 rapid rejected or timed-out prompts.
- **Detection**: Alert triggered when $>2$ authentication prompts occur within 60 seconds without user initiation.
- **Recovery**: One-click "Bloquer" triggers immediate session killswitch.

---

### 18. Compromised Authenticator Hardware
- **Attack**: Authenticator device jailbroken or root compromised.
- **Impact**: Operating system integrity degraded.
- **Prevention**: WebAuthn credential public keys include authenticator attestation data where supported. Clone detection counters (`counter` tracking) increment on every use; if the server sees a counter $\le$ previous counter, it flags credential cloning and denies access.
- **Detection**: Counter rollback detected on server (`COUNTER_ROLLBACK_DETECTED`).
- **Recovery**: Credential immediately marked as revoked (`revokedAt`).

---

### 19. Malicious Browser / Malicious Extension
- **Attack**: Rogue Chrome extension attempts to read user input or intercept DOM state.
- **Impact**: Data snooping.
- **Prevention**: Sensitive operations use WebAuthn native system dialogs rendered directly by the OS / browser core outside the reach of content scripts. Cookies are `HttpOnly`.
- **Detection**: Browser extension isolation mechanisms.
- **Recovery**: Recommend use of dedicated clean browser profile or native app container.

---

### 20. Credential Export & Theft
- **Attack**: Adversary attempts to dump or export Passkey private keys from storage.
- **Impact**: Portable cloned credential.
- **Prevention**: Hardware-bound Passkeys generated with non-exportable flags in Secure Enclave. The private key cannot be read out of silicon even by privileged root processes.
- **Detection**: Hardware attestation verifies device model and key protection tier.
- **Recovery**: N/A; private key cannot be extracted.

---

### 21. Database Compromise / SQL Injection
- **Attack**: Adversary gains read access to server database dump.
- **Impact**: Exposure of stored credential data.
- **Prevention**: Server database contains **ONLY public keys** and one-way hashes of recovery codes and session tokens. No private keys, no biometric templates, no plaintext secrets exist anywhere in the database. A full DB dump gives the attacker zero usable credentials.
- **Detection**: Database access monitoring and parameterized queries via ORM / typed SQL prevents injection.
- **Recovery**: Rotate RP credentials and invalidate sessions; public keys remain safe against forgery.

---

### 22. AI-Assisted Attacks
- **Attack**: Automated AI agents attempting automated brute-force, pattern analysis, or social engineering attacks.
- **Impact**: High-velocity attacks.
- **Prevention**: Strict exponential backoff rate limiting, public-key cryptography (256-bit elliptic curves cannot be brute-forced even by modern LLMs), and cryptographic nonce freshness.
- **Detection**: IP and behavioral anomaly detection logs automated cadence.
- **Recovery**: IP throttling, Cloudflare/WAF block, and automated audit escalation.
