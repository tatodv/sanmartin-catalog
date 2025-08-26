// DO NOT MODIFY: data wiring & filtering logic
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

/**
 * Normaliza texto a minúsculas sin acentos para comparaciones más flexibles.
 */
export const normalize = (s?: string) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const uniqSorted = (arr: (string | null | undefined)[]) =>
  Array.from(new Set(arr.map(v => (v ?? "").trim()).filter(Boolean) as string[])).sort();

const facetCount = (arr: (string | null | undefined)[]) => {
  const m = new Map<string, number>();
  for (const v of arr) {
    const k = (v ?? "").trim();
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return Array.from(m.entries())
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([value, count]) => ({ value, count }));
};

export function deriveFacets(data: Item[]) {
  return {
    units:   uniqSorted(data.map(d => d.unit)),
    titles:  uniqSorted(data.map(d => d.title)),
    levels:  uniqSorted(data.map(d => d.level_norm ?? d.level_or_modality)),
    barrios: uniqSorted(data.map(d => d.barrio))
  };
}

export function buildFacets(data: Item[]) {
  return {
    units:   facetCount(data.map(d => d.unit)),
    titles:  facetCount(data.map(d => d.title)),
    levels:  facetCount(data.map(d => d.level_norm ?? d.level_or_modality)),
    barrios: facetCount(data.map(d => d.barrio))
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


