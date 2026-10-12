# WebAuthn protocol

Use @simplewebauthn/browser and @simplewebauthn/server. API boundaries/lifecycle are defined in architecture. Sources: https://simplewebauthn.dev/docs/packages/server and https://simplewebauthn.dev/docs/packages/browser (reviewed 2026-10-12).
WEBAUTHN_RP_ID and WEBAUTHN_ALLOWED_ORIGINS are mandatory startup configuration. Incoming Origin selects only an explicitly trusted exact entry; Referer is never trust input. Only HTTPS in production, HTTP localhost in development.
Registration: generate random provisional UUID, require discoverable credential and UV, attestation none, persist purpose/RP/origin/TTL/binding hash. Verify through library with requireUserVerification=true, then insert new identity, public credential and audit atomically. No existing-user attachment route.
Authentication: require UV; discoverable credential resolves user. Verify stored public key, signature, RP hash, exact origin, expected consumed challenge, userHandle, counter, revocation and active security state. Update counter and mint session transactionally. No browser success before API verified=true.
Challenge lifetime is five minutes, single-use, bound to a random HttpOnly flow cookie. One outstanding browser flow is supported; requesting new options replaces the cookie. All verification failures require new options.
User-facing wording: Device verification, User verification or Passkey verification. Never infer Face ID, fingerprint modality or physical device identity from generic UV.
