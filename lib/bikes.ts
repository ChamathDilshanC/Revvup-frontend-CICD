import { formatLkr } from './rentalFormat';
import { getBikeProvince } from './bikeProvince';
import type { BikeSummary } from '../types/bike';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';

export function bikeImageUrl(url: string | null | undefined): string {
  return url?.trim() || FALLBACK_IMAGE;
}

/** Treat missing API field as available (older backends / rows before migration). */
export function isBikeAvailable(bike: { is_available?: boolean }): boolean {
  return bike.is_available !== false;
}

export function isBikeRentable(bike: { is_rentable?: boolean }): boolean {
  return bike.is_rentable === true;
}

/** Rent tab: rentable listings (includes currently rented — shown with badge). */
export function filterRentableBikes(bikes: BikeSummary[]): BikeSummary[] {
  return bikes.filter((b) => isBikeRentable(b) && isBikeAvailable(b));
}

export function isBikeRentedOut(bike: { is_rented_out?: boolean }): boolean {
  return bike.is_rented_out === true;
}

export function canBookBikeRental(
  bike: BikeSummary & { owner_id?: string | null },
  viewerId?: string | null,
): boolean {
  if (!isBikeRentable(bike) || !isBikeAvailable(bike)) return false;
  if (isBikeRentedOut(bike)) return false;
  if (viewerId && bike.owner_id && viewerId === bike.owner_id) return false;
  return true;
}

export function formatRentRateLabel(bike: BikeSummary): string {
  const parts: string[] = [];
  if (bike.rent_per_hour != null) parts.push(`${formatLkr(bike.rent_per_hour)}/hr`);
  if (bike.rent_per_day != null) parts.push(`${formatLkr(bike.rent_per_day)}/day`);
  if (parts.length > 0) return parts.join('\n');
  return 'Rates at checkout';
}

export function groupBikesByShowroom(bikes: BikeSummary[]): {
  key: string;
  showroomName: string;
  showroomAddress: string | null;
  showroomLatitude: number | null;
  showroomLongitude: number | null;
  showroomProvince: string | null;
  bikes: BikeSummary[];
}[] {
  const map = new Map<
    string,
    {
      showroomName: string;
      showroomAddress: string | null;
      showroomLatitude: number | null;
      showroomLongitude: number | null;
      showroomProvince: string | null;
      bikes: BikeSummary[];
    }
  >();

  for (const bike of bikes) {
    const key = bike.owner_id ?? bike.showroom_name ?? 'unknown';
    const name = bike.showroom_name?.trim() || 'Independent listing';
    const existing = map.get(key);
    if (existing) {
      existing.bikes.push(bike);
    } else {
      map.set(key, {
        showroomName: name,
        showroomAddress: bike.showroom_address,
        showroomLatitude: bike.showroom_latitude,
        showroomLongitude: bike.showroom_longitude,
        showroomProvince: getBikeProvince(bike),
        bikes: [bike],
      });
    }
  }

  return Array.from(map.entries())
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => a.showroomName.localeCompare(b.showroomName));
}
