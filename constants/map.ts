/** Default map center — Colombo, Sri Lanka */
export const DEFAULT_MAP_REGION = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export function hasMapCoordinates(
  lat: number | null | undefined,
  lng: number | null | undefined,
): boolean {
  return lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng);
}
