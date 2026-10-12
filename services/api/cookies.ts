import { validateConfig, type Config } from './config.js';
export function cookiePolicy(input: Config) {
  const cfg = validateConfig(input);
  const secure = cfg.mode === 'staging' || cfg.mode === 'production';
  return Object.freeze({
    sessionName: secure ? '__Host-luxia_session' : 'luxia_session',
    bindingName: secure ? '__Host-luxia_flow' : 'luxia_flow',
    attributes: Object.freeze({ httpOnly: true,secure,sameSite: 'strict' as const,path: '/' }),
  });
}
