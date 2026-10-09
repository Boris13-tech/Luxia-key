import {
  User,
  Credential,
  AuthenticationChallenge,
  Session,
  AuditEvent,
  Device,
  IdentitySecurityState,
} from './schema';
import crypto from 'crypto';

class DatabaseStore {
  private users: Map<string, User> = new Map();
  private credentials: Map<string, Credential> = new Map();
  private challenges: Map<string, AuthenticationChallenge> = new Map();
  private sessions: Map<string, Session> = new Map();
  private auditEvents: AuditEvent[] = [];
  private devices: Map<string, Device> = new Map();
  private securityStates: Map<string, IdentitySecurityState> = new Map();

  constructor() {
    this.seedDefaultUser();
  }

  private seedDefaultUser() {
    const defaultUserId = 'b0715130-9ec1-4fa3-b184-e9102c7a40b1';
    const now = new Date().toISOString();
    const defaultUser: User = {
      id: defaultUserId,
      username: 'boris.legrand',
      displayName: 'Boris Legrand',
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(defaultUser.id, defaultUser);
    this.securityStates.set(defaultUserId, {
      userId: defaultUserId,
      locked: false,
      reason: null,
      lockedAt: null,
      unlockedAt: null,
    });
  }

  // --- Users ---
  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getUserByUsername(username: string): User | null {
    for (const u of this.users.values()) {
      if (u.username.toLowerCase() === username.toLowerCase()) return u;
    }
    return null;
  }

  createUser(username: string, displayName: string): User {
    const existing = this.getUserByUsername(username);
    if (existing) return existing;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const user: User = { id, username, displayName, createdAt: now, updatedAt: now };
    this.users.set(id, user);

    this.securityStates.set(id, {
      userId: id,
      locked: false,
      reason: null,
      lockedAt: null,
      unlockedAt: null,
    });
    return user;
  }

  // --- Credentials (Public only) ---
  saveCredential(cred: Omit<Credential, 'id' | 'createdAt' | 'lastUsedAt' | 'revokedAt'>): Credential {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const fullCred: Credential = {
      ...cred,
      id,
      createdAt: now,
      lastUsedAt: now,
      revokedAt: null,
    };
    this.credentials.set(fullCred.credentialId, fullCred);
    return fullCred;
  }

  getCredentialById(credentialId: string): Credential | null {
    return this.credentials.get(credentialId) || null;
  }

  getCredentialsByUserId(userId: string): Credential[] {
    return Array.from(this.credentials.values()).filter(
      (c) => c.userId === userId && c.revokedAt === null
    );
  }

  updateCredentialCounter(credentialId: string, counter: number): boolean {
    const cred = this.credentials.get(credentialId);
    if (!cred) return false;
    cred.counter = counter;
    cred.lastUsedAt = new Date().toISOString();
    return true;
  }

  revokeCredential(credentialId: string): boolean {
    const cred = this.credentials.get(credentialId);
    if (!cred) return false;
    cred.revokedAt = new Date().toISOString();
    return true;
  }

  // --- Challenges (Single use, TTL) ---
  createChallenge(
    challenge: string,
    type: AuthenticationChallenge['type'],
    origin: string,
    rpId: string,
    userId: string | null = null,
    ttlSeconds = 300
  ): AuthenticationChallenge {
    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();

    const record: AuthenticationChallenge = {
      id,
      userId,
      challenge,
      type,
      origin,
      rpId,
      createdAt: now.toISOString(),
      expiresAt,
      usedAt: null,
    };
    this.challenges.set(challenge, record);
    return record;
  }

  consumeChallenge(challenge: string, type: AuthenticationChallenge['type']): {
    valid: boolean;
    reason?: string;
    record?: AuthenticationChallenge;
  } {
    const record = this.challenges.get(challenge);
    if (!record) {
      return { valid: false, reason: 'CHALLENGE_NOT_FOUND' };
    }

    // Single-use: delete immediately to prevent replay
    this.challenges.delete(challenge);

    if (record.usedAt !== null) {
      return { valid: false, reason: 'CHALLENGE_ALREADY_USED' };
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return { valid: false, reason: 'CHALLENGE_EXPIRED' };
    }

    if (record.type !== type) {
      return { valid: false, reason: 'CHALLENGE_TYPE_MISMATCH' };
    }

    record.usedAt = new Date().toISOString();
    return { valid: true, record };
  }

  // --- Sessions ---
  createSession(userId: string, ipAddress: string, userAgent: string, ttlHours = 24): { session: Session; rawToken: string } {
    const id = crypto.randomUUID();
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlHours * 3600 * 1000).toISOString();

    const session: Session = {
      id,
      tokenHash,
      userId,
      createdAt: now.toISOString(),
      expiresAt,
      lastActivityAt: now.toISOString(),
      ipAddress,
      userAgent,
      revokedAt: null,
    };

    this.sessions.set(tokenHash, session);
    return { session, rawToken };
  }

  validateSession(rawToken: string): Session | null {
    if (!rawToken) return null;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const session = this.sessions.get(tokenHash);

    if (!session) return null;
    if (session.revokedAt !== null) return null;
    if (new Date(session.expiresAt).getTime() < Date.now()) return null;

    // Slide activity timestamp
    session.lastActivityAt = new Date().toISOString();
    return session;
  }

  revokeSession(rawToken: string): boolean {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const session = this.sessions.get(tokenHash);
    if (!session) return false;
    session.revokedAt = new Date().toISOString();
    return true;
  }

  revokeAllUserSessions(userId: string): number {
    let count = 0;
    const now = new Date().toISOString();
    for (const session of this.sessions.values()) {
      if (session.userId === userId && session.revokedAt === null) {
        session.revokedAt = now;
        count++;
      }
    }
    return count;
  }

  // --- Security State / Identity Lock ---
  getSecurityState(userId: string): IdentitySecurityState {
    const state = this.securityStates.get(userId);
    if (state) return state;
    const initial: IdentitySecurityState = {
      userId,
      locked: false,
      reason: null,
      lockedAt: null,
      unlockedAt: null,
    };
    this.securityStates.set(userId, initial);
    return initial;
  }

  setSecurityLock(userId: string, locked: boolean, reason: string | null = null): IdentitySecurityState {
    const state = this.getSecurityState(userId);
    const now = new Date().toISOString();
    state.locked = locked;
    state.reason = reason;
    if (locked) {
      state.lockedAt = now;
    } else {
      state.unlockedAt = now;
    }
    return state;
  }

  // --- Audit Logging ---
  logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    // Defense-in-depth: sanitize any sensitive patterns
    const sanitizedDetails = JSON.parse(
      JSON.stringify(event.details, (key, value) => {
        if (/privatekey|secret|password|biometric|face|fingerprint/i.test(key)) {
          return '[REDACTED_BY_SECURITY_POLICY]';
        }
        return value;
      })
    );

    const fullEvent: AuditEvent = {
      ...event,
      id,
      details: sanitizedDetails,
      timestamp,
    };

    this.auditEvents.push(fullEvent);
    return fullEvent;
  }

  getAuditEvents(limit = 50): AuditEvent[] {
    return this.auditEvents.slice(-limit).reverse();
  }

  // --- Test / Reset Utilities ---
  resetAll() {
    this.users.clear();
    this.credentials.clear();
    this.challenges.clear();
    this.sessions.clear();
    this.auditEvents = [];
    this.devices.clear();
    this.securityStates.clear();
    this.seedDefaultUser();
  }
}

export const db = new DatabaseStore();
