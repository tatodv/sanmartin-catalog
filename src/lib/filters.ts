// /src/lib/filters.ts
// Taxonomía mínima para normalizar niveles
const LEVEL_RULES: Array<{ match: RegExp; level: string }> = [
  { match: /licenciatura|tecnicatura|maestr[ií]a|doctorado|profesorado|especializaci[oó]n/i, level: "Superior" },
  { match: /secundaria|bachiller/i, level: "Secundaria" },
  { match: /t[eé]cnica|tecn[ií]ca|tp/i, level: "Técnica" },
  { match: /curso|taller|capacitaci[oó]n/i, level: "Curso" },
];

const BARRIO_HINTS = [
  "José León Suárez",
  "San Martín Centro",
  "Barrio Libertador",
  // Podés sumar más barrios reales acá a medida que se dispongan
];

const normalizeStr = (s: unknown) =>
  (s ?? "")
    .toString()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

export type Item = {
  title?: string;
  program_name?: string;
  unit?: string;
  unidad?: string;
  institution?: string;
  barrio?: string;
  neighborhood?: string;
  zone?: string;
  level?: string;
  level_or_modality?: string;
  level_norm?: string;
  family?: string;
  notes?: string;
  title_group?: string;
  _search?: string;
  [k: string]: any;
};

export function normalizeItem(raw: Item): Item {
  const item: Item = { ...raw };

  // Base
  item.title = item.title ?? item.program_name ?? "";
  item.unidad = item.unit ?? item.unidad ?? item.institution ?? "";
  item.barrio = item.barrio ?? item.neighborhood ?? item.zone ?? "";
  item.level = item.level ?? item.level_or_modality ?? "";

  // Level norm (derivado si falta)
  const levelProbe = normalizeStr(`${item.level} ${item.title}`);
  let derivedLevel = "";
  for (const r of LEVEL_RULES) {
    if (r.match.test(levelProbe)) {
      derivedLevel = r.level;
      break;
    }
  }
  item.level_norm = item.level_norm ?? derivedLevel ?? "";

  // Barrio: inferencia soft desde unidad si no viene o viene inválido
  const barrioRaw = item.barrio ?? "";
  const barrioIsInvalid = /validar|unsam/i.test(barrioRaw) || barrioRaw.trim() === "";
  if (barrioIsInvalid) {
    const unidad = item.unidad ?? "";
    const found = BARRIO_HINTS.find((b) => new RegExp(`\\b${b}\\b`, "i").test(unidad));
    item.barrio = found ?? "Barrio no especificado";
  }

  // Campo de búsqueda unificado
  const parts = [
    item.title,
    item.program_name,
    item.unidad,
    item.level,
    item.level_norm,
    item.barrio,
    item.family,
    item.notes,
  ]
    .filter(Boolean)
    .map(normalizeStr);

  item._search = (item._search ?? parts.join(" ")).toLowerCase();

  return item;
}

// --- Filtros: OR dentro de cada faceta y AND entre facetas ---
type Selected = {
  level?: Set<string>;
  barrio?: Set<string>;
  unidad?: Set<string>;
  titulo?: Set<string>;
  text?: string;
};

const passesFacet = (value: string, selected?: Set<string>) => {
  if (!selected || selected.size === 0) return true;
  return selected.has(value);
};

export function applyFilters(items: Item[], selected: Selected): Item[] {
  const text = normalizeStr(selected?.text || "").toLowerCase();

  return items.filter((it) => {
    if (text && !(it._search || "").includes(text)) return false;

    const okLevel = passesFacet(it.level_norm || "", selected.level);
    const okBarrio = passesFacet(it.barrio || "", selected.barrio);
    const okUnidad = passesFacet(it.unidad || "", selected.unidad);

    // Título agrupado opcional (cluster por tipo alto o usar title directo)
    const tGroup =
      /licenciatura/i.test(it.title ?? "") ? "Licenciatura" :
      /tecnicatura/i.test(it.title ?? "") ? "Tecnicatura" :
      /maestr[ií]a/i.test(it.title ?? "") ? "Maestría" :
      /doctorado/i.test(it.title ?? "") ? "Doctorado" :
      /profesorado/i.test(it.title ?? "") ? "Profesorado" :
      /especializaci[oó]n/i.test(it.title ?? "") ? "Especialización" :
      it.title ?? "";
    const okTitulo = passesFacet(it.title_group ?? tGroup, selected.titulo);

    // AND entre facetas
    return okLevel && okBarrio && okUnidad && okTitulo;
  });
}

export function buildFacets(items: Item[], selected: Selected) {
  // A partir de la lista ya filtrada (según la selección actual) contamos facetas
  const filtered = applyFilters(items, selected);

  const acc = {
    level: new Map<string, number>(),
    barrio: new Map<string, number>(),
    unidad: new Map<string, number>(),
    titulo: new Map<string, number>(),
  };

  const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

  for (const it of filtered) {
    bump(acc.level, it.level_norm || "—");
    bump(acc.barrio, it.barrio || "—");
    bump(acc.unidad, it.unidad || "—");

    const g =
      /licenciatura/i.test(it.title ?? "") ? "Licenciatura" :
      /tecnicatura/i.test(it.title ?? "") ? "Tecnicatura" :
      /maestr[ií]a/i.test(it.title ?? "") ? "Maestría" :
      /doctorado/i.test(it.title ?? "") ? "Doctorado" :
      /profesorado/i.test(it.title ?? "") ? "Profesorado" :
      /especializaci[oó]n/i.test(it.title ?? "") ? "Especialización" :
      it.title ?? "—";
    bump(acc.titulo, it.title_group ?? g);
  }

  const toList = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));

  return {
    level: toList(acc.level),
    barrio: toList(acc.barrio),
    unidad: toList(acc.unidad),
    titulo: toList(acc.titulo),
  };
}
