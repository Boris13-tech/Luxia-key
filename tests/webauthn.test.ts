import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../server/db';
import { WebAuthnService } from '../server/webauthn/service';

describe('WebAuthn Security Gate Tests', () => {
  let service: WebAuthnService;

  beforeEach(() => {
    db.resetAll();
    service = new WebAuthnService();
  });

  it('1. Registration Options Generation - PASS', async () => {
    const { options, userId } = await service.getRegistrationOptions(
      'boris.legrand',
      'Boris Legrand',
      'http://localhost:3000'
    );

    expect(options).toBeDefined();
    expect(options.challenge).toBeDefined();
    expect(options.rp.id).toBe('localhost');
    expect(options.user.name).toBe('boris.legrand');
    expect(userId).toBeDefined();
  });

  it('2. Invalid Challenge Rejection - DENY', async () => {
    // Attempt verification with non-existent challenge
    const invalidClientDataJSON = Buffer.from(
      JSON.stringify({
        type: 'webauthn.create',
        challenge: 'non_existent_challenge_nonce',
        origin: 'http://localhost:3000',
      })
    ).toString('base64url');

    const fakeResponse: any = {
      id: 'mock-id',
      rawId: 'mock-id',
      response: {
        clientDataJSON: invalidClientDataJSON,
        attestationObject: 'mock-attestation',
      },
      type: 'public-key',
    };

    await expect(
      service.verifyRegistration(fakeResponse, 'http://localhost:3000')
    ).rejects.toThrow(/Challenge validation failed/);
  });

  it('3. Challenge Replay Protection - DENY', async () => {
    const { options } = await service.getRegistrationOptions(
      'boris.legrand',
      'Boris Legrand',
      'http://localhost:3000'
    );

    const rawChallenge = options.challenge;

    // First consumption succeeds
    const firstCheck = db.consumeChallenge(rawChallenge, 'registration');
    expect(firstCheck.valid).toBe(true);

    // Second consumption MUST be denied (replay attempt)
    const secondCheck = db.consumeChallenge(rawChallenge, 'registration');
    expect(secondCheck.valid).toBe(false);
    expect(secondCheck.reason).toBe('CHALLENGE_NOT_FOUND');
  });

  it('4. Expired Challenge Rejection - DENY', async () => {
    // Create challenge with -10 second TTL (already expired)
    const expiredRecord = db.createChallenge(
      'expired-challenge-token',
      'registration',
      'http://localhost:3000',
      'localhost',
      null,
      -10 // Expired
    );

    expect(expiredRecord).toBeDefined();

    const check = db.consumeChallenge('expired-challenge-token', 'registration');
    expect(check.valid).toBe(false);
    expect(check.reason).toBe('CHALLENGE_EXPIRED');
  });

  it('5. Wrong Origin Validation - DENY', async () => {
    // Create challenge for localhost:3000
    const { options } = await service.getRegistrationOptions(
      'boris.legrand',
      'Boris Legrand',
      'http://localhost:3000'
    );

    const clientDataJSON = Buffer.from(
      JSON.stringify({
        type: 'webauthn.create',
        challenge: options.challenge,
        origin: 'https://attacker-domain.com', // Wrong origin
      })
    ).toString('base64url');

    const fakeResponse: any = {
      id: 'mock-cred',
      rawId: 'mock-cred',
      response: {
        clientDataJSON,
        attestationObject: 'mock',
      },
      type: 'public-key',
    };

    // Expected origin is http://localhost:3000, response claims https://attacker-domain.com
    await expect(
      service.verifyRegistration(fakeResponse, 'http://localhost:3000')
    ).rejects.toThrow();
  });

  it('6. Revoked Credential Authentication - DENY', async () => {
    // Save public credential and revoke it
    const cred = db.saveCredential({
      userId: 'b0715130-9ec1-4fa3-b184-e9102c7a40b1',
      credentialId: 'revoked-cred-id',
      publicKey: Buffer.from('dummy-public-key').toString('base64url'),
      counter: 10,
      deviceType: 'platform',
      backedUp: false,
      transports: ['internal'],
    });

    // Revoke it
    db.revokeCredential(cred.credentialId);

    // Create challenge
    const challengeRecord = db.createChallenge(
      'auth-test-challenge',
      'authentication',
      'http://localhost:3000',
      'localhost',
      cred.userId
    );

    const clientDataJSON = Buffer.from(
      JSON.stringify({
        type: 'webauthn.get',
        challenge: challengeRecord.challenge,
        origin: 'http://localhost:3000',
      })
    ).toString('base64url');

    const fakeAuthResponse: any = {
      id: cred.credentialId,
      rawId: cred.credentialId,
      response: {
        clientDataJSON,
        authenticatorData: 'mock',
        signature: 'mock',
      },
      type: 'public-key',
    };

    await expect(
      service.verifyAuthentication(fakeAuthResponse, 'http://localhost:3000')
    ).rejects.toThrow(/Credential has been revoked/);
  });
});
