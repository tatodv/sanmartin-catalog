import { useMemo } from "react";
import { haversineKm, formatKm, type LatLng } from "@/lib/geo";

export type CatalogItem = {
  id: string;
  title: string;
  address?: string;
  coords?: LatLng;
  [key: string]: any;
};

export function useNearby(
  items: CatalogItem[],
  userCoords: LatLng | null,
  radiusKm: number | null
) {
  const withDistance = useMemo(() => {
    return items.map((it) => {
      const distanceKm = userCoords && it.coords ? haversineKm(userCoords, it.coords) : null;
      return {
        ...it,
        distanceKm,
        distanceLabel: distanceKm != null ? formatKm(distanceKm) : undefined,
      };
    });
  }, [items, userCoords]);

  const filtered = useMemo(() => {
    if (!userCoords || !radiusKm) return withDistance;
    return withDistance
      .filter((it) => it.distanceKm != null && it.distanceKm <= radiusKm)
      .sort((a, b) => (a.distanceKm! - b.distanceKm!));
  }, [withDistance, userCoords, radiusKm]);

  return { list: filtered };
}


