const object = (value: unknown): value is Record<string,unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown,max: number): value is string => typeof value === 'string' && value.length > 0 && value.length <= max;
/** Shape only. Challenge binding and all cryptographic checks remain server-side after this boundary. */
export function validVerificationEnvelope(body: unknown,purpose: 'registration' | 'authentication'): boolean {
  if (!object(body) || !text(body.id,2048) || !text(body.rawId,2048) || body.type !== 'public-key' ||
      !object(body.clientExtensionResults) || !object(body.response) || !text(body.response.clientDataJSON,16384)) return false;
  const response = body.response;
  if (purpose === 'registration') return text(response.attestationObject,32768);
  return text(response.authenticatorData,16384) && text(response.signature,16384) &&
    (response.userHandle === undefined || response.userHandle === null || text(response.userHandle,1024));
}
