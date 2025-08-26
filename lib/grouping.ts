// DO NOT MODIFY: data wiring & filtering logic
import type { Item } from "./types";

export type HomeGroup =
  | { id: string; title: string; count: number; type: "flat"; items: Item[] }
  | { id: string; title: string; count: number; type: "nested"; groups: { id: string; title: string; count: number; items: Item[] }[] };

function groupBy<T>(arr: T[], key: (x: T) => string) {
  const m = new Map<string, T[]>();
  for (const a of arr) {
    const k = key(a);
    m.set(k, [...(m.get(k) ?? []), a]);
  }
  return m;
}

export function buildHomeGroups(data: Item[]): HomeGroup[] {
  const groups: HomeGroup[] = [];

  // Secundaria — agrupada por institución
  const secundaria = data.filter(d => d.level_norm === "Secundaria");
  if (secundaria.length) {
    const byInst = groupBy(secundaria, d => d.provider_name || "Sin institución");
    const sub = Array.from(byInst.entries())
      .sort((a, b) => a[0].localeCompare(b[0], "es"))
      .map(([title, items]) => ({ id: `inst_${title}`, title, count: items.length, items }));
    groups.push({ id: "secundaria", title: "Secundaria — por institución", count: secundaria.length, type: "nested", groups: sub });
  }

  // Cursos tecnológicos (Agenda Tec.)
  const tec = data.filter(d => d.family === "Informática");
  if (tec.length) {
    groups.push({ id: "tec", title: "Cursos tecnológicos (Agenda Tec.)", count: tec.length, type: "flat", items: tec });
  }

  // Técnica
  const tecnica = data.filter(d => d.level_norm === "Técnica");
  if (tecnica.length) {
    groups.push({ id: "tecnica", title: "Técnica", count: tecnica.length, type: "flat", items: tecnica });
  }

  return groups;
}
