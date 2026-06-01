/** Parse booking id from RevvUp rental QR JSON or raw UUID. */
export function parseBookingIdFromQr(data: string): string | null {
  const raw = data.trim();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const id = parsed.bookingId ?? parsed.booking_id;
    if (typeof id === 'string' && id.length > 0) return id;
  } catch {
    // not JSON
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw)) {
    return raw;
  }
  return null;
}
