import type { Item } from "./types";

export type ActiveFilters = {
  q: string;
  unit?: string[];
  title?: string[];
  level?: string[]; // NUEVO filtro por nivel
};

const uniqSorted = (arr: (string | undefined)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort();

export function deriveFacets(data: Item[]) {
  return {
    units: uniqSorted(data.map(d => d.unit?.trim())),
    titles: uniqSorted(data.map(d => d.title?.trim())),
    levels: uniqSorted(data.map(d => d.level_or_modality?.trim())), // derivar niveles
  };
}

export function applyFilters(data: Item[], f: ActiveFilters) {
  const q = f.q?.toLowerCase().trim();
  return data.filter(d => {
    const okQ = !q || [
      d.provider_name, d.program_name, d.title, d.unit, d.address, d.notes
    ].some(v => v?.toLowerCase().includes(q));

    const inList = (val?: string, list?: string[]) =>
      !list?.length || (val && list.includes(val));

    return okQ
      && inList(d.unit, f.unit)
      && inList(d.title, f.title)
      && inList(d.level_or_modality, f.level); // aplicar nivel
  });
}
