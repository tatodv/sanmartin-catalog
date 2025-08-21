import type { Item } from "./types";
import { search } from "./search";

export type ActiveFilters = {
  q: string;
  unit?: string[];
  title?: string[];
  level?: string[];
  barrio?: string[];
  withGeo?: boolean;
  near?: { lat: number; lon: number } | null;
  radiusKm?: number;
};

const uniqSorted = (arr: (string | null | undefined)[]) =>
  Array.from(new Set(arr.map(v => (v ?? "").trim()).filter(Boolean) as string[])).sort();

export function deriveFacets(data: Item[]) {
  return {
    units:   uniqSorted(data.map(d => d.unit)),
    titles:  uniqSorted(data.map(d => d.title)),
    levels:  uniqSorted(data.map(d => d.level_norm ?? d.level_or_modality)),
    barrios: uniqSorted(data.map(d => d.barrio))
  };
}

export function applyFilters(all: Item[], f: ActiveFilters) {
  // 1) búsqueda con scoring (si hay q)
  let data = f.q?.trim() ? search(all, f.q) : all;

  // 2) filtros exactos
  const inList = (val?: string | null, list?: string[]) =>
    !list?.length || (!!val && list.includes(val));

  data = data.filter(d =>
    inList(d.unit, f.unit) &&
    inList(d.title, f.title) &&
    inList(d.level_norm ?? d.level_or_modality, f.level) &&
    inList(d.barrio, f.barrio)
  );

  // 3) geo opcional
  if (f.withGeo) data = data.filter(d => typeof d.lat === "number" && typeof d.lon === "number");
  if (f.near && f.radiusKm) {
    const R = 6371, toRad = (x:number)=>x*Math.PI/180;
    data = data.filter(d => {
      if (typeof d.lat !== "number" || typeof d.lon !== "number") return false;
      const dLat = toRad(d.lat - f.near!.lat), dLon = toRad(d.lon - f.near!.lon);
      const a = Math.sin(dLat/2)**2 + Math.cos(toRad(f.near!.lat))*Math.cos(toRad(d.lat))*Math.sin(dLon/2)**2;
      const dist = 2 * R * Math.asin(Math.sqrt(a));
      return dist <= f.radiusKm!;
    });
  }

  // 4) orden: provider > program > title (estable)
  return data.sort((a, b) =>
    (a.provider_name || "").localeCompare(b.provider_name || "","es") ||
    (a.program_name  || "").localeCompare(b.program_name  || "","es") ||
    (a.title         || "").localeCompare(b.title         || "","es")
  );
}


