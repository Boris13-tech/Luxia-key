export function getWebAuthnConfig(reqOrigin?: string) {
  // Support both development host, AI Studio URL, and custom domain
  const rawOrigin = reqOrigin || process.env.APP_URL || 'http://localhost:3000';
  let origin = rawOrigin;
  let rpID = 'localhost';

  try {
    const url = new URL(rawOrigin);
    origin = `${url.protocol}//${url.host}`;
    rpID = url.hostname;
  } catch {
    // fallback to localhost
  }

  const rpName = 'LUXIA Key Security Core';

  return {
    rpName,
    rpID,
    origin,
  };
}
