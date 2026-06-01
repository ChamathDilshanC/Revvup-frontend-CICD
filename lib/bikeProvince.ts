import type { BikeSummary } from '../types/bike';
import {
  inferProvinceFromAddress,
  normalizeProvince,
  type SriLankaProvince,
} from './sriLankaProvinces';

export function getBikeProvince(bike: BikeSummary): SriLankaProvince | null {
  const explicit = normalizeProvince(bike.showroom_province ?? undefined);
  if (explicit) return explicit;
  return inferProvinceFromAddress(bike.showroom_address);
}

export function filterBikesByProvince(
  bikes: BikeSummary[],
  province: SriLankaProvince | null,
): BikeSummary[] {
  if (!province) return bikes;
  return bikes.filter((b) => getBikeProvince(b) === province);
}

export function countBikesByProvince(
  bikes: BikeSummary[],
): { province: SriLankaProvince; count: number }[] {
  const counts = new Map<SriLankaProvince, number>();
  for (const bike of bikes) {
    const p = getBikeProvince(bike);
    if (!p) continue;
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count || a.province.localeCompare(b.province));
}
