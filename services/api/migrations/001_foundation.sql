CREATE TABLE users (
  id uuid PRIMARY KEY,
  display_name varchar(100) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE identity_security_states (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  state text NOT NULL CHECK (state IN ('active', 'locked', 'disabled')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE devices (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  label varchar(100) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX devices_user_idx ON devices(user_id);
CREATE TABLE credentials (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  public_key bytea NOT NULL,
  counter bigint NOT NULL CHECK (counter >= 0),
  device_type text NOT NULL CHECK (device_type IN ('singleDevice', 'multiDevice')),
  backed_up boolean NOT NULL,
  transports text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);
CREATE INDEX credentials_user_idx ON credentials(user_id);
CREATE TABLE authentication_challenges (
  id uuid PRIMARY KEY,
  challenge text UNIQUE NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('registration', 'authentication')),
  origin text NOT NULL,
  rp_id text NOT NULL,
  binding_hash char(64) NOT NULL,
  user_id uuid,
  display_name varchar(100),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  CHECK (expires_at > created_at),
  CHECK (purpose <> 'registration' OR (user_id IS NOT NULL AND display_name IS NOT NULL))
);
CREATE INDEX challenges_expiry_idx ON authentication_challenges(expires_at);
CREATE TABLE sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  credential_id text NOT NULL REFERENCES credentials(id),
  token_hash char(64) UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  CHECK (expires_at > created_at)
);
CREATE INDEX sessions_user_active_idx ON sessions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX sessions_credential_idx ON sessions(credential_id);
CREATE TABLE audit_events (
  id uuid PRIMARY KEY,
  actor_id uuid,
  credential_id text,
  operation text NOT NULL,
  result text NOT NULL CHECK (result IN ('SUCCESS', 'DENIED')),
  reason text NOT NULL,
  correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_actor_time_idx ON audit_events(actor_id, created_at);
CREATE FUNCTION reject_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'audit_events is append-only'; END;
$$;
CREATE TRIGGER audit_append_only BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION reject_audit_mutation();
