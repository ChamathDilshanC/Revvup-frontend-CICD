export const SRI_LANKA_PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
] as const;

export type SriLankaProvince = (typeof SRI_LANKA_PROVINCES)[number];

const ALIASES: Record<string, SriLankaProvince> = {
  'western province': 'Western',
  western: 'Western',
  'central province': 'Central',
  central: 'Central',
  'southern province': 'Southern',
  southern: 'Southern',
  'northern province': 'Northern',
  northern: 'Northern',
  'eastern province': 'Eastern',
  eastern: 'Eastern',
  'north western province': 'North Western',
  'north western': 'North Western',
  northwestern: 'North Western',
  wayamba: 'North Western',
  'north central province': 'North Central',
  'north central': 'North Central',
  'uva province': 'Uva',
  uva: 'Uva',
  'sabaragamuwa province': 'Sabaragamuwa',
  sabaragamuwa: 'Sabaragamuwa',
};

const CITY_HINTS: [string, SriLankaProvince][] = [
  ['colombo', 'Western'],
  ['gampaha', 'Western'],
  ['kalutara', 'Western'],
  ['negombo', 'Western'],
  ['kandy', 'Central'],
  ['matale', 'Central'],
  ['nuwara eliya', 'Central'],
  ['galle', 'Southern'],
  ['matara', 'Southern'],
  ['hambantota', 'Southern'],
  ['jaffna', 'Northern'],
  ['batticaloa', 'Eastern'],
  ['trincomalee', 'Eastern'],
  ['kurunegala', 'North Western'],
  ['anuradhapura', 'North Central'],
  ['badulla', 'Uva'],
  ['ratnapura', 'Sabaragamuwa'],
  ['kegalle', 'Sabaragamuwa'],
];

export function normalizeProvince(value: string | null | undefined): SriLankaProvince | null {
  if (!value?.trim()) return null;
  const key = value.trim().toLowerCase().replace(/\s+/g, ' ');
  if (key in ALIASES) return ALIASES[key];
  for (const p of SRI_LANKA_PROVINCES) {
    if (key === p.toLowerCase()) return p;
  }
  return null;
}

export function inferProvinceFromAddress(address: string | null | undefined): SriLankaProvince | null {
  if (!address?.trim()) return null;
  const text = address.trim().toLowerCase().replace(/\s+/g, ' ');

  for (const p of SRI_LANKA_PROVINCES) {
    if (text.includes(p.toLowerCase())) return p;
  }

  for (const [alias, province] of Object.entries(ALIASES)) {
    if (alias.length >= 5 && text.includes(alias)) return province;
  }

  for (const [city, province] of CITY_HINTS) {
    if (text.includes(city)) return province;
  }

  return null;
}

/** Map expo-location reverse-geocode region/subregion to a province. */
export function inferProvinceFromGeocode(parts: (string | null | undefined)[]): SriLankaProvince | null {
  const combined = parts.filter(Boolean).join(' ');
  return inferProvinceFromAddress(combined) ?? normalizeProvince(combined);
}
