import Fuse from "fuse.js";
import type { Item } from "./types";

const normalize = (s?: string) =>
  (s ?? "").toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function buildIndex(data: Item[]) {
  return new Fuse(data, {
    keys: [
      { name: "provider_name", weight: 0.35 },
      { name: "program_name",  weight: 0.30 },
      { name: "title",         weight: 0.20 },
      { name: "unit",          weight: 0.10 },
      { name: "barrio",        weight: 0.05 }
    ],
    includeScore: true,
    threshold: 0.33,        // más estricto que el default
    ignoreLocation: true,
    minMatchCharLength: 2,
    shouldSort: true
  });
}

export function search(data: Item[], q: string) {
  const qq = normalize(q).trim();
  if (!qq) return data;
  const fuse = buildIndex(data);
  return fuse.search(qq).map(r => r.item);
}


