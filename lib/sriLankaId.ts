const OLD_NIC_RE = /^\d{9}[VX]$/;
const NEW_NIC_RE = /^\d{12}$/;
const LICENSE_RE = /^([A-Z]{1,2}\d{7,9}|\d{8,12})$/;

export function normalizeNic(value: string): string {
  return value.trim().toUpperCase().replace(/[\s-]/g, '');
}

export function normalizeLicense(value: string): string {
  return value.trim().toUpperCase().replace(/[\s-]/g, '');
}

export function validateNicFormat(nic: string): { ok: true } | { ok: false; message: string } {
  const n = normalizeNic(nic);
  if (!n) return { ok: false, message: 'NIC number is required' };
  if (OLD_NIC_RE.test(n) || NEW_NIC_RE.test(n)) return { ok: true };
  return {
    ok: false,
    message:
      'Enter a valid Sri Lankan NIC (9 digits + V/X, or 12 digits). Example: 123456789V or 199912345678',
  };
}

export function validateLicenseFormat(
  licenseNo: string,
): { ok: true } | { ok: false; message: string } {
  const l = normalizeLicense(licenseNo);
  if (!l) return { ok: false, message: 'Driving licence number is required' };
  if (LICENSE_RE.test(l)) return { ok: true };
  return {
    ok: false,
    message: 'Enter a valid Sri Lankan driving licence (e.g. B1234567 or 1234567890).',
  };
}

function yearFromOldNic(yy: number, today = new Date()): number {
  let year = 1900 + yy;
  if (year > today.getFullYear()) year -= 100;
  return year;
}

/** Parse YYYY-MM-DD from encoded NIC day-of-year. */
export function parseDobFromNic(nic: string): string | null {
  const n = normalizeNic(nic);
  try {
    if (OLD_NIC_RE.test(n)) {
      const yy = parseInt(n.slice(0, 2), 10);
      let ddd = parseInt(n.slice(2, 5), 10);
      if (ddd > 500) ddd -= 500;
      if (ddd < 1 || ddd > 366) return null;
      const year = yearFromOldNic(yy);
      return toDateOnlyIso(new Date(year, 0, ddd));
    }
    if (NEW_NIC_RE.test(n)) {
      const year = parseInt(n.slice(0, 4), 10);
      let ddd = parseInt(n.slice(4, 7), 10);
      if (ddd > 500) ddd -= 500;
      const nowYear = new Date().getFullYear();
      if (year < 1900 || year > nowYear || ddd < 1 || ddd > 366) return null;
      return toDateOnlyIso(new Date(year, 0, ddd));
    }
  } catch {
    return null;
  }
  return null;
}

export function nicMatchesDob(nic: string, dobIso: string): boolean {
  const parsed = parseDobFromNic(nic);
  return parsed !== null && parsed === dobIso.slice(0, 10);
}

export function toDateOnlyIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function validateRentalIdentity(input: {
  nicNo: string;
  licenseNo: string;
  dateOfBirth: Date;
  minAgeYears?: number;
}): { ok: true; nicNo: string; licenseNo: string; dateOfBirth: string } | { ok: false; message: string } {
  const minAge = input.minAgeYears ?? 18;

  const nicCheck = validateNicFormat(input.nicNo);
  if (!nicCheck.ok) return nicCheck;

  const licCheck = validateLicenseFormat(input.licenseNo);
  if (!licCheck.ok) return licCheck;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dob = new Date(input.dateOfBirth);
  dob.setHours(0, 0, 0, 0);

  if (dob > today) {
    return { ok: false, message: 'Date of birth cannot be in the future' };
  }

  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthday) age -= 1;
  if (age < minAge) {
    return { ok: false, message: `You must be at least ${minAge} years old to rent` };
  }

  return {
    ok: true,
    nicNo: normalizeNic(input.nicNo),
    licenseNo: normalizeLicense(input.licenseNo),
    dateOfBirth: toDateOnlyIso(dob),
  };
}

export function formatDobDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
