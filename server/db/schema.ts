import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(64),
  displayName: z.string().min(1).max(128),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

export const CredentialSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  credentialId: z.string(), // Base64URL
  publicKey: z.string(), // Base64URL representation of public key
  counter: z.number().int().nonnegative(),
  deviceType: z.string().default('platform'),
  backedUp: z.boolean().default(false),
  transports: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  lastUsedAt: z.string().datetime(),
  revokedAt: z.string().datetime().nullable(),
});
export type Credential = z.infer<typeof CredentialSchema>;

export const AuthenticationChallengeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  challenge: z.string(), // Base64URL
  type: z.enum(['registration', 'authentication', 'action_signing', 'device_pairing']),
  origin: z.string(),
  rpId: z.string(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  usedAt: z.string().datetime().nullable(),
});
export type AuthenticationChallenge = z.infer<typeof AuthenticationChallengeSchema>;

export const SessionSchema = z.object({
  id: z.string().uuid(),
  tokenHash: z.string(), // SHA-256 of raw secret cookie token
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  lastActivityAt: z.string().datetime(),
  ipAddress: z.string(),
  userAgent: z.string(),
  revokedAt: z.string().datetime().nullable(),
});
export type Session = z.infer<typeof SessionSchema>;

export const AuditEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  eventType: z.string(),
  status: z.enum(['SUCCESS', 'FAILURE', 'WARNING', 'DENIED']),
  ipAddress: z.string(),
  userAgent: z.string(),
  details: z.record(z.string(), z.unknown()),
  timestamp: z.string().datetime(),
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const DeviceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  type: z.enum(['phone', 'laptop', 'desktop', 'tablet', 'watch']),
  os: z.string(),
  location: z.string(),
  ip: z.string(),
  isCurrent: z.boolean(),
  status: z.enum(['active', 'inactive', 'blocked', 'approved']),
  lastActiveAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type Device = z.infer<typeof DeviceSchema>;

export const IdentitySecurityStateSchema = z.object({
  userId: z.string().uuid(),
  locked: z.boolean(),
  reason: z.string().nullable(),
  lockedAt: z.string().datetime().nullable(),
  unlockedAt: z.string().datetime().nullable(),
});
export type IdentitySecurityState = z.infer<typeof IdentitySecurityStateSchema>;
