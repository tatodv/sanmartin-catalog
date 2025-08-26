// DO NOT MODIFY: data wiring & filtering logic
import type { Item } from "./types";
import taxonomy from "@/app/(data)/taxonomy.json";

const norm = (s?: string | null) =>
  (s ?? "").toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ").trim();

// devuelve el primer match que encuentre en taxonomy.level
function canonLevel(raw?: string | null) {
  const n = norm(raw);
  if (!n) return null;
  for (const [k, v] of Object.entries(taxonomy.level)) {
    if (n.includes(k)) return v as any;
  }
  return null;
}

function canonLevelFromItem(it: Item) {
  // prioridad: level_or_modality → title → program_name → unit
  return (
    canonLevel(it.level_or_modality) ||
    canonLevel(it.title) ||
    canonLevel(it.program_name) ||
    canonLevel(it.unit) ||
    null
  );
}

function canonFamily(item: Item) {
  const hay = norm([item.program_name, item.title, item.unit, item.notes].filter(Boolean).join(" "));
  for (const [k, v] of Object.entries(taxonomy.family)) {
    if (hay.includes(k)) return v as string;
  }
  return null; // se puede completar a mano después
}

export function enrich(item: Item): Item {
  const level = canonLevelFromItem(item);
  const family = canonFamily(item);
  const blob = [
    item.provider_name, item.program_name, item.title,
    item.unit, item.barrio, item.locality, item.address, item.notes
  ].filter(Boolean).join(" | ");
  return {
    ...item,
    level_norm: level,
    family,
    _search: norm(blob)
  };
}


