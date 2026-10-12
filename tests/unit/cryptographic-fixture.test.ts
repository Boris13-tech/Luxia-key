import { expect,it } from 'vitest';
import { generateRegistrationOptions,verifyRegistrationResponse,verifyAuthenticationResponse } from '@simplewebauthn/server';
import { authenticator } from '../fixtures/authenticator.js';
it('synthetic fixture verifies through the actual WebAuthn library',async () => {
  const auth = authenticator();
  const options = await generateRegistrationOptions({ rpName: 'test',rpID: 'localhost',userName: 'test',
    userID: new TextEncoder().encode('test'),authenticatorSelection: { userVerification: 'required' } });
  const result = await verifyRegistrationResponse({ response: auth.registration(options.challenge,options.user.id),
    expectedChallenge: options.challenge,expectedOrigin: 'http://localhost:3000',expectedRPID: 'localhost',requireUserVerification: true });
  expect(result.verified).toBe(true);
  const authentication = await verifyAuthenticationResponse({ response: auth.authentication(options.challenge),
    expectedChallenge: options.challenge,expectedOrigin: 'http://localhost:3000',expectedRPID: 'localhost',requireUserVerification: true,
    credential: result.registrationInfo!.credential });
  expect(authentication.verified).toBe(true);
});
