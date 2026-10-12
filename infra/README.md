# Development infrastructure

PostgreSQL 17 is the CI reference. Use a dedicated local/CI database named luxia_test for tests. No production connection is authorized.
Set DATABASE_URL for the API/migration process and TEST_DATABASE_URL for integration. Run pnpm db:migrate explicitly before pnpm api. Supply WEBAUTHN_RP_ID=localhost and WEBAUTHN_ALLOWED_ORIGINS=http://localhost:3000 for development. Never expose server env to Vite.
Production design: trusted HTTPS reverse proxy with same-origin /api routing to loopback API, NODE_ENV=production, trusted RP/origins, separate migration role. Runtime grants: schema USAGE; SELECT/INSERT/UPDATE on users, credentials, devices, authentication_challenges, sessions, identity_security_states; INSERT only on audit_events; SELECT on schema_migrations. No schema ownership, superuser, DELETE/TRUNCATE audit or DDL. Validate role and backup/restore before deployment.
No infrastructure provisioning or production migration is performed here. Neon hosting is optional and cannot change the PostgreSQL contract.
