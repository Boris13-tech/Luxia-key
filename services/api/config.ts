export type RuntimeMode = 'development' | 'test' | 'staging' | 'production';
export interface Config { readonly rpID: string; readonly origins: readonly string[]; readonly mode: RuntimeMode }
const modes: readonly string[] = Object.freeze(['development','test','staging','production']);
const loopback = (hostname: string) => ['localhost','127.0.0.1','[::1]'].includes(hostname);
export function validateConfig(input: Config): Config {
  const { rpID,origins,mode } = input;
  if (!modes.includes(mode) || !rpID || !( /^[a-z0-9.-]+$/.test(rpID) || rpID === '[::1]') ||
      !Array.isArray(origins) || !origins.length) throw new Error('INVALID_CONFIG');
  const localMode = mode === 'development' || mode === 'test';
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || url.username || url.password ||
        !(url.hostname === rpID || url.hostname.endsWith(`.${rpID}`)) ||
        (localMode && (!loopback(url.hostname) || !loopback(rpID))) ||
        !(url.protocol === 'https:' || (localMode && url.protocol === 'http:' && loopback(url.hostname)))) {
      throw new Error('INVALID_CONFIG');
    }
  }
  return Object.freeze({ rpID,origins: Object.freeze([...origins]),mode });
}
export function config(env: NodeJS.ProcessEnv = process.env): Config {
  const rpID = env.WEBAUTHN_RP_ID;
  const origins = env.WEBAUTHN_ALLOWED_ORIGINS?.split(',').map(x => x.trim());
  const mode = env.LUXIA_RUNTIME_MODE;
  if (!rpID || !origins || !mode || !modes.includes(mode)) throw new Error('INVALID_CONFIG');
  return validateConfig({ rpID,origins,mode: mode as RuntimeMode });
}
