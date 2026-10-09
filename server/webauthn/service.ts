import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/server';
import { db } from '../db';
import { getWebAuthnConfig } from './config';

export class WebAuthnService {
  /**
   * 1. Generate Registration Options
   */
  async getRegistrationOptions(username: string, displayName: string, clientOrigin?: string) {
    const config = getWebAuthnConfig(clientOrigin);
    const user = db.createUser(username, displayName);

    // Retrieve existing credentials to avoid duplicate registration on same authenticator
    const userPasskeys = db.getCredentialsByUserId(user.id);
    const excludeCredentials = userPasskeys.map((passkey) => ({
      id: passkey.credentialId,
      transports: passkey.transports as any,
    }));

    const options = await generateRegistrationOptions({
      rpName: config.rpName,
      rpID: config.rpID,
      userID: Buffer.from(user.id, 'utf-8'),
      userName: user.username,
      userDisplayName: user.displayName,
      attestationType: 'none',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // Store ephemeral challenge with strict TTL and single-use tracking
    db.createChallenge(
      options.challenge,
      'registration',
      config.origin,
      config.rpID,
      user.id,
      300 // 5 minutes
    );

    db.logAuditEvent({
      userId: user.id,
      eventType: 'webauthn.registration.challenge_issued',
      status: 'SUCCESS',
      ipAddress: 'client',
      userAgent: 'client',
      details: { username, rpID: config.rpID },
    });

    return { options, userId: user.id };
  }

  /**
   * 2. Verify Registration Response & Save Public Credential
   */
  async verifyRegistration(
    response: RegistrationResponseJSON,
    clientOrigin: string,
    ipAddress = 'unknown',
    userAgent = 'unknown'
  ) {
    const config = getWebAuthnConfig(clientOrigin);

    // Replay check: locate and consume challenge atomically
    const challengeCheck = db.consumeChallenge(response.response.clientDataJSON, 'registration');
    // Note: clientDataJSON in base64url contains the challenge, or client provides it
    // In SimpleWebAuthn, we parse the challenge from clientDataJSON
    let rawChallenge = '';
    try {
      const clientDataStr = Buffer.from(response.response.clientDataJSON, 'base64url').toString('utf-8');
      const clientData = JSON.parse(clientDataStr);
      rawChallenge = clientData.challenge;
    } catch {
      rawChallenge = '';
    }

    const challengeRecord = db.consumeChallenge(rawChallenge, 'registration');
    if (!challengeRecord.valid || !challengeRecord.record) {
      db.logAuditEvent({
        userId: null,
        eventType: 'webauthn.registration.failed',
        status: 'DENIED',
        ipAddress,
        userAgent,
        details: { reason: challengeRecord.reason || 'INVALID_CHALLENGE' },
      });
      throw new Error(`Challenge validation failed: ${challengeRecord.reason}`);
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: rawChallenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      db.logAuditEvent({
        userId: challengeRecord.record.userId,
        eventType: 'webauthn.registration.failed',
        status: 'FAILURE',
        ipAddress,
        userAgent,
        details: { verified: false },
      });
      throw new Error('WebAuthn registration verification failed');
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Convert public key bytes to base64url string for safe storage
    const publicKeyBase64 = Buffer.from(credential.publicKey).toString('base64url');

    // Save ONLY public credential data
    const savedCredential = db.saveCredential({
      userId: challengeRecord.record.userId || crypto.randomUUID(),
      credentialId: credential.id,
      publicKey: publicKeyBase64,
      counter: credential.counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: (response.response.transports as string[]) || [],
    });

    db.logAuditEvent({
      userId: savedCredential.userId,
      eventType: 'webauthn.registration.success',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      details: {
        credentialId: savedCredential.credentialId,
        deviceType: savedCredential.deviceType,
      },
    });

    return {
      verified: true,
      credential: {
        id: savedCredential.id,
        credentialId: savedCredential.credentialId,
        deviceType: savedCredential.deviceType,
        createdAt: savedCredential.createdAt,
      },
    };
  }

  /**
   * 3. Generate Authentication Options
   */
  async getAuthenticationOptions(username?: string, clientOrigin?: string) {
    const config = getWebAuthnConfig(clientOrigin);
    let allowCredentials: any[] = [];
    let targetUserId: string | null = null;

    if (username) {
      const user = db.getUserByUsername(username);
      if (user) {
        targetUserId = user.id;
        const passkeys = db.getCredentialsByUserId(user.id);
        allowCredentials = passkeys.map((p) => ({
          id: p.credentialId,
          transports: p.transports as any,
        }));
      }
    }

    const options = await generateAuthenticationOptions({
      rpID: config.rpID,
      allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
      userVerification: 'preferred',
    });

    // Store ephemeral challenge with strict TTL and single-use tracking
    db.createChallenge(
      options.challenge,
      'authentication',
      config.origin,
      config.rpID,
      targetUserId,
      300
    );

    return { options };
  }

  /**
   * 4. Verify Authentication Response & Create Session
   */
  async verifyAuthentication(
    response: AuthenticationResponseJSON,
    clientOrigin: string,
    ipAddress = 'unknown',
    userAgent = 'unknown'
  ) {
    const config = getWebAuthnConfig(clientOrigin);

    // Extract challenge from clientDataJSON
    let rawChallenge = '';
    try {
      const clientDataStr = Buffer.from(response.response.clientDataJSON, 'base64url').toString('utf-8');
      const clientData = JSON.parse(clientDataStr);
      rawChallenge = clientData.challenge;
    } catch {
      rawChallenge = '';
    }

    // Atomically consume challenge (replay prevention)
    const challengeCheck = db.consumeChallenge(rawChallenge, 'authentication');
    if (!challengeCheck.valid || !challengeCheck.record) {
      db.logAuditEvent({
        userId: null,
        eventType: 'webauthn.authentication.replay_or_invalid',
        status: 'DENIED',
        ipAddress,
        userAgent,
        details: { reason: challengeCheck.reason },
      });
      throw new Error(`Authentication challenge failed: ${challengeCheck.reason}`);
    }

    // Locate public credential by credential ID
    const credentialRecord = db.getCredentialById(response.id);
    if (!credentialRecord) {
      db.logAuditEvent({
        userId: null,
        eventType: 'webauthn.authentication.unknown_credential',
        status: 'DENIED',
        ipAddress,
        userAgent,
        details: { credentialId: response.id },
      });
      throw new Error('Credential not found on server');
    }

    if (credentialRecord.revokedAt !== null) {
      db.logAuditEvent({
        userId: credentialRecord.userId,
        eventType: 'webauthn.authentication.revoked_credential',
        status: 'DENIED',
        ipAddress,
        userAgent,
        details: { credentialId: response.id },
      });
      throw new Error('Credential has been revoked');
    }

    // Verify cryptographic signature
    const publicKeyUint8 = new Uint8Array(Buffer.from(credentialRecord.publicKey, 'base64url'));

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: rawChallenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
      credential: {
        id: credentialRecord.credentialId,
        publicKey: publicKeyUint8,
        counter: credentialRecord.counter,
        transports: credentialRecord.transports as any,
      },
      requireUserVerification: false,
    });

    if (!verification.verified) {
      db.logAuditEvent({
        userId: credentialRecord.userId,
        eventType: 'webauthn.authentication.failed',
        status: 'FAILURE',
        ipAddress,
        userAgent,
        details: { verified: false },
      });
      throw new Error('Cryptographic signature verification failed');
    }

    // Update clone detection counter
    db.updateCredentialCounter(credentialRecord.credentialId, verification.authenticationInfo.newCounter);

    // Create authentic server session
    const { session, rawToken } = db.createSession(credentialRecord.userId, ipAddress, userAgent);

    const user = db.getUserById(credentialRecord.userId);

    db.logAuditEvent({
      userId: credentialRecord.userId,
      eventType: 'webauthn.authentication.success',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
      details: {
        credentialId: credentialRecord.credentialId,
        sessionId: session.id,
      },
    });

    return {
      verified: true,
      user,
      session,
      rawToken,
    };
  }
}

export const webAuthnService = new WebAuthnService();
