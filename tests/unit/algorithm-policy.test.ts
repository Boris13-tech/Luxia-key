import { expect,it } from 'vitest';
import { generateRegistrationOptions,verifyRegistrationResponse,verifyAuthenticationResponse } from '@simplewebauthn/server';
import { WEBAUTHN_ALGORITHMS } from '../../services/api/algorithm-policy.js';
import { authenticator } from '../fixtures/authenticator.js';
it.each([-7,-257] as const)('offered %s passes real registration and signed authentication (synthetic)',async alg => {
  const options = await generateRegistrationOptions({ rpName: 'test',rpID: 'localhost',userName: 'test',supportedAlgorithmIDs: [...WEBAUTHN_ALGORITHMS] });
  expect(options.pubKeyCredParams.map(p => p.alg)).toEqual([...WEBAUTHN_ALGORITHMS]);
  const auth = authenticator(alg);
  const result = await verifyRegistrationResponse({ response: auth.registration(options.challenge,options.user.id),expectedChallenge: options.challenge,
    expectedRPID: 'localhost',expectedOrigin: 'http://localhost:3000',requireUserVerification: true,supportedAlgorithmIDs: [...WEBAUTHN_ALGORITHMS] });
  expect(result.verified).toBe(true);
  const assertion = await verifyAuthenticationResponse({ response: auth.authentication(options.challenge),expectedChallenge: options.challenge,
    expectedRPID: 'localhost',expectedOrigin: 'http://localhost:3000',requireUserVerification: true,credential: result.registrationInfo!.credential });
  expect(assertion.verified).toBe(true);
});
it.each([-8,12345] as const)('well-formed unoffered %s is rejected by verifier policy (synthetic)',async alg => {
  const options = await generateRegistrationOptions({ rpName: 'test',rpID: 'localhost',userName: 'test',supportedAlgorithmIDs: [...WEBAUTHN_ALGORITHMS] });
  const auth = alg === -8 ? authenticator(-8) : authenticator(-7,alg);
  await expect(verifyRegistrationResponse({ response: auth.registration(options.challenge,options.user.id),expectedChallenge: options.challenge,
    expectedRPID: 'localhost',expectedOrigin: 'http://localhost:3000',requireUserVerification: true,supportedAlgorithmIDs: [...WEBAUTHN_ALGORITHMS] })).rejects.toThrow();
});
it('policy is immutable and is exactly ES256/RS256',() => { expect(WEBAUTHN_ALGORITHMS).toEqual([-7,-257]); expect(Object.isFrozen(WEBAUTHN_ALGORITHMS)).toBe(true); });
