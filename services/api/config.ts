export interface Config { rpID: string; origins: string[]; production: boolean }
export function config(env: NodeJS.ProcessEnv = process.env): Config {
  const rpID = env.WEBAUTHN_RP_ID;
  const origins = env.WEBAUTHN_ALLOWED_ORIGINS?.split(',').map(x => x.trim());
  const production = env.NODE_ENV === 'production';
  if (!rpID || !/^[a-z0-9.-]+$/.test(rpID) || !origins?.length) throw new Error('INVALID_CONFIG');
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || url.username || url.password ||
        !(url.hostname === rpID || url.hostname.endsWith(`.${rpID}`)) ||
        !(url.protocol === 'https:' || (!production && url.protocol === 'http:' && url.hostname === 'localhost'))) {
      throw new Error('INVALID_CONFIG');
    }
  }
  return { rpID, origins, production };
}
