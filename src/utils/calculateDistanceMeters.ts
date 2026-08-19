const EARTH_RADIUS_METERS = 6_371_000;

interface Coordinates {
  lat: number;
  lon: number;
}

export const calculateDistanceMeters = (
  coordinates1: Coordinates,
  coordinates2: Coordinates,
): number => {
  const { lat: lat1, lon: lon1 } = coordinates1;
  const { lat: lat2, lon: lon2 } = coordinates2;

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);

  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
};
