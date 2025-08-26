import raw from "@/app/(data)/catalog-normalized.json";
import { type CatalogItem } from "./types";
import { deburr, tokenize } from "./text";
import type { FilterState } from "./urlState";

export const catalog: CatalogItem[] = (raw as unknown as CatalogItem[]).filter(Boolean);

const uniq = (arr:(string|undefined)[]) =>
  Array.from(new Set(arr.map(v => (v || "").trim()).filter(Boolean)))
    .sort((a,b) => a.localeCompare(b,"es",{sensitivity:"base"}));

export function facets(data: CatalogItem[]) {
  return {
    level_norm: uniq(data.map(x => x.level_norm)),
    family:     uniq(data.map(x => x.family)),
    barrio:     uniq(data.map(x => x.barrio)),
    provider:   uniq(data.map(x => x.provider_name)),
    unit:       uniq(data.map(x => x.unit)),
    title:      uniq(data.map(x => x.title)),
  };
}

const haystack = (r: CatalogItem) => {
  const composite = `${r.provider_name} ${r.program_name} ${r.title} ${r.unit} ${r.address} ${r.barrio}`;
  // Siempre incluir _search + campos clave para evitar falsos negativos si _search está incompleto
  return `${(r._search || "")} ${deburr(composite)}`.toLowerCase();
};

const matchesQuery = (r: CatalogItem, q?: string) => {
  if (!q) return true;
  const toks = tokenize(q); if (!toks.length) return true;
  const h = haystack(r);
  return toks.every(t => h.includes(t));
};

const score = (r: CatalogItem, q?: string) => {
  if (!q) return 0;
  const toks = tokenize(q); if (!toks.length) return 0;
  const p = deburr(r.program_name.toLowerCase());
  const prov = deburr(r.provider_name.toLowerCase());
  const h = haystack(r);
  let s = 0;
  for (const t of toks) {
    if (p.startsWith(t)) s += 4;     // match fuerte al inicio
    if (p.includes(t)) s += 2;       // match en programa
    if (prov.includes(t)) s += 1.5;  // match en institución
    if (h.includes(t)) s += 1;       // fallback
  }
  return s;
};

export function applyFilters(data: CatalogItem[], f: FilterState) {
  return data
    .filter(r => {
      if (!matchesQuery(r, f.q)) return false;
      if (f.level_norm && (r.level_norm || "") !== f.level_norm) return false;
      if (f.family && (r.family || "") !== f.family) return false;
      if (f.barrio && (r.barrio || "") !== f.barrio) return false;
      if (f.provider_name && (r.provider_name || "") !== f.provider_name) return false;
      if (f.unit && (r.unit || "") !== f.unit) return false;
      if (f.title && (r.title || "") !== f.title) return false;
      return true;
    })
    .map(r => ({ r, s: score(r, f.q) }))
    .sort((a,b) => (b.s - a.s)
      || a.r.provider_name.localeCompare(b.r.provider_name,"es")
      || a.r.program_name.localeCompare(b.r.program_name,"es"))
    .map(x => x.r);
}

export function facetCounts(data: CatalogItem[], f: FilterState) {
  const withQ = (partial: FilterState) => applyFilters(data, { q: f.q, ...partial });

  const countBy = (rows: CatalogItem[], key: keyof CatalogItem | "level_norm") =>
    rows.reduce<Record<string, number>>((acc, it) => {
      const v = (it[key as keyof CatalogItem] as any) || "";
      if (!v) return acc;
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});

  return {
    level_norm: countBy(withQ({ ...f, level_norm: undefined }), "level_norm"),
    family:     countBy(withQ({ ...f, family: undefined }), "family"),
    barrio:     countBy(withQ({ ...f, barrio: undefined }), "barrio"),
    provider:   countBy(withQ({ ...f, provider_name: undefined }), "provider_name"),
    unit:       countBy(withQ({ ...f, unit: undefined }), "unit"),
    title:      countBy(withQ({ ...f, title: undefined }), "title"),
  };
}
