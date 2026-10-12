/** Convert a user-entered account website to a validated HTTPS destination. */
export function externalWebsiteURL(website: string): string | undefined {
  if (!website || website.length > 2048 || /[\u0000-\u0020\u007f<>"'`\\]/u.test(website) ||
      website.includes('://') || website.startsWith('/')) return undefined;
  try {
    const url = new URL(`https://${website}`);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return undefined;
    return url.href;
  } catch { return undefined; }
}
