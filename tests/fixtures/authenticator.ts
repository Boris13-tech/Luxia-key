// Synthetic test authenticator using Node's standard crypto and CBOR encoding.
// This is NOT hardware/browser certification and never ships in the API.
import { generateKeyPairSync, randomBytes, createHash, sign } from 'node:crypto';
import { Encoder } from 'cbor-x';
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/server';
const encoder = new Encoder({ useRecords: false, mapsAsObjects: false, tagUint8Array: false });
export function authenticator() {
  const { publicKey, privateKey } = generateKeyPairSync('ec',{ namedCurve: 'prime256v1' });
  const jwk = publicKey.export({ format: 'jwk' });
  const id = randomBytes(32);
  let user = '';
  let counter = 0;
  const digest = (value: string | Buffer) => createHash('sha256').update(value).digest();
  function data(rp: string, uv: boolean, registration: boolean) {
    const count = Buffer.alloc(4); count.writeUInt32BE(++counter);
    return Buffer.concat([digest(rp),Buffer.from([0x01 | (uv ? 0x04 : 0) | (registration ? 0x40 : 0)]),count]);
  }
  return {
    id: id.toString('base64url'),
    registration(challenge: string,userID: string,origin = 'http://localhost:3000',rp = 'localhost',uv = true): RegistrationResponseJSON {
      user = userID;
      const cose = encoder.encode(new Map<number,number | Buffer>([[1,2],[3,-7],[-1,1],[-2,Buffer.from(jwk.x!,'base64url')],[-3,Buffer.from(jwk.y!,'base64url')]]));
      const size = Buffer.alloc(2); size.writeUInt16BE(id.length);
      const authData = Buffer.concat([data(rp,uv,true),Buffer.alloc(16),size,id,cose]);
      const attestation = encoder.encode(new Map<string,unknown>([['fmt','none'],['attStmt',new Map()],['authData',authData]]));
      return { id: id.toString('base64url'),rawId: id.toString('base64url'),type: 'public-key',clientExtensionResults: {},
        response: { clientDataJSON: Buffer.from(JSON.stringify({ type: 'webauthn.create',challenge,origin,crossOrigin: false })).toString('base64url'),
          attestationObject: Buffer.from(attestation).toString('base64url'),transports: ['internal'] } };
    },
    authentication(challenge: string,origin = 'http://localhost:3000',rp = 'localhost',uv = true): AuthenticationResponseJSON {
      const client = Buffer.from(JSON.stringify({ type: 'webauthn.get',challenge,origin,crossOrigin: false }));
      const authData = data(rp,uv,false);
      return { id: id.toString('base64url'),rawId: id.toString('base64url'),type: 'public-key',clientExtensionResults: {},
        response: { clientDataJSON: client.toString('base64url'),authenticatorData: authData.toString('base64url'),
          signature: sign('sha256',Buffer.concat([authData,digest(client)]),privateKey).toString('base64url'),userHandle: user } };
    },
  };
}
