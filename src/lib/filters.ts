import type { Item } from "./types";

export type ActiveFilters = {
  q: string;
  unit?: string[];
  title?: string[]; // Licenciatura, Maestría, etc.
};

const uniqSorted = (arr: (string | undefined)[]) =>
  Array.from(new Set(arr.filter(Boolean) as string[])).sort();

export function deriveFacets(data: Item[]) {
  return {
    units: uniqSorted(data.map(d => d.unit?.trim())),
    titles: uniqSorted(data.map(d => d.title?.trim())),
  };
}

export function applyFilters(data: Item[], f: ActiveFilters) {
  const q = f.q?.toLowerCase().trim();
  return data.filter(d => {
    const okQ = !q || [
      d.provider_name, d.program_name, d.title, d.address, d.unit, d.notes
    ].some(v => v?.toLowerCase().includes(q));
    const inList = (val?: string, list?: string[]) =>
      !list?.length || (val && list.includes(val));
    return okQ
      && inList(d.unit, f.unit)
      && inList(d.title, f.title);
  });
}
