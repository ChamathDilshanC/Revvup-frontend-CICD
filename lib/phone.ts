/** Normalize for tel: / telprompt: URIs (keeps leading +). */
export function phoneForDialUri(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/[^\d]/g, '');
  if (!digits) return null;
  return hasPlus ? `+${digits}` : digits;
}

export function formatPhoneDisplay(phone: string): string {
  return phone.trim();
}
