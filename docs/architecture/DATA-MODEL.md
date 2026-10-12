# Data model

Normative physical schema: services/api/migrations/001_foundation.sql. Portable PostgreSQL; no Neon or Supabase dependency, extension or vendor API.

| Entity | Responsibility |
|---|---|
| users | Random UUID identity and display name; no email ownership claim |
| devices | Reserved device metadata; pairing not implemented |
| credentials | Unique public credential ID, COSE public key, counter, backup/device flags, transports and revocation |
| authentication_challenges | Purpose, challenge, trusted RP/origin, browser binding hash, provisional user, TTL, consumption |
| sessions | Hashed random token, user/credential linkage, absolute expiry and revocation |
| audit_events | Canonical operation/result/reason/correlation/timestamp and optional actor/credential |
| identity_security_states | Active/locked/disabled authorization guard; no lock workflow |

Registration challenge user_id is a provisional UUID and deliberately has no user FK until verified identity insertion. A credential may be synced; no device association is invented. Public keys are not private keys.
Foreign-key query paths and active sessions have indexes. Credential counters use bigint and are verified by SimpleWebAuthn, including supported zero-counter behavior. Timestamps use timestamptz and database time.
Migrations run explicitly with a migration role, under advisory lock and checksum validation; API startup never auto-migrates. Runtime must receive only SELECT/INSERT/UPDATE on required tables and INSERT on audit_events, not schema ownership, TRUNCATE or DDL. See infra/README.md.
Future entities (signed requests, recovery enrollments, integrations) require separate protocol review; none implemented here.
