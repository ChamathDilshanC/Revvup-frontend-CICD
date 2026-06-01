/** Decode JWT expiry (seconds since epoch) without external deps. */
export function getJwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(json) as { exp?: number };
    return typeof data.exp === 'number' ? data.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewMs = 30_000): boolean {
  const exp = getJwtExpiryMs(token);
  if (!exp) return true;
  return Date.now() >= exp - skewMs;
}
