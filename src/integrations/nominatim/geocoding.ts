import AppError from "../../utils/AppError";

interface GeocodeAddress {
  region: string;
  province: string;
  city: string;
  barangay: string;
  address_line: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface GeocodeAddressResult {
  latitude: number | undefined;
  longitude: number | undefined;
}

const geocodeAddress = async (
  address: GeocodeAddress,
): Promise<GeocodeAddressResult> => {
  const { region, province, city, barangay, address_line } = address;

  const query = [
    address_line,
    barangay,
    city,
    province,
    region,
    "Philippines",
  ].join(", ");

  const url = new URL("https://nominatim.openstreetmap.org/search");

  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "e-comm-backend/1.0",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to geocode address");
  }

  const result = (await res.json()) as NominatimResult[];

  if (!result[0]) {
    throw new AppError(400, "Unable to locate the provided address");
  }

  return {
    latitude: Number(result[0].lat),
    longitude: Number(result[0].lon),
  };
};

export default geocodeAddress;
