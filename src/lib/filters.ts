import type { Item } from "./types";

export type ActiveFilters = {
  q: string;
  unit?: string[];
  title?: string[];
  level?: string[];
  barrio?: string[];
  withGeo?: boolean; // NUEVO: solo resultados con lat/lon
};

const uniqSorted = (arr: (string | null | undefined)[]) =>
  Array.from(new Set(arr.map(v => (v ?? "").trim()).filter(Boolean) as string[])).sort();

export function deriveFacets(data: Item[]) {
  return {
    units:   uniqSorted(data.map(d => d.unit)),
    titles:  uniqSorted(data.map(d => d.title)),
    levels:  uniqSorted(data.map(d => d.level_or_modality)),
    barrios: uniqSorted(data.map(d => d.barrio)),
  };
}

export function applyFilters(data: Item[], f: ActiveFilters) {
  const q = (f.q ?? "").toLowerCase().trim();
  const inList = (val?: string | null, list?: string[]) =>
    !list?.length || (!!val && list.includes(val));

  return data.filter(d => {
    const okQ = !q || [
      d.provider_name, d.program_name, d.title, d.unit, d.address, d.notes
    ].some(v => v?.toLowerCase().includes(q));

    const geoOK = !f.withGeo || (typeof d.lat === "number" && typeof d.lon === "number");

    return okQ
      && inList(d.unit, f.unit)
      && inList(d.title, f.title)
      && inList(d.level_or_modality, f.level)
      && inList(d.barrio, f.barrio)
      && geoOK;
  });
}
