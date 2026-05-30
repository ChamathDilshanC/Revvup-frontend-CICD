import type { BikeSummary } from '../types/bike';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';

export function bikeImageUrl(url: string | null | undefined): string {
  return url?.trim() || FALLBACK_IMAGE;
}

export function groupBikesByShowroom(bikes: BikeSummary[]): {
  key: string;
  showroomName: string;
  showroomAddress: string | null;
  showroomLatitude: number | null;
  showroomLongitude: number | null;
  bikes: BikeSummary[];
}[] {
  const map = new Map<
    string,
    {
      showroomName: string;
      showroomAddress: string | null;
      showroomLatitude: number | null;
      showroomLongitude: number | null;
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
        bikes: [bike],
      });
    }
  }

  return Array.from(map.entries())
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => a.showroomName.localeCompare(b.showroomName));
}
