import type { Item } from "./types";

export function norm(s?: string | null) {
  return (s ?? "").toLowerCase();
}

// Marca si el ítem es "tecnológico" usando family canónico
export function isTechCourse(it: Item) {
  // Prioridad: usar family canónico si existe
  if (it.family === "Informática" || it.family === "Electrónica" || 
      it.family === "Electromecánica" || it.family === "Metalmecánica") {
    return true;
  }
  
  // Fallback: keywords en campos originales
  const hay = [it.program_name, it.title, it.unit, it.notes].map(norm).join(" ");
  const kw = [
    "informática", "programación", "software", "datos", "data",
    "redes", "sistemas", "electrónica", "electromec", "robot",
    "tics", "nanotec", "bio y nanotecn", "ciencia y tecnología",
  ];
  return kw.some(k => hay.includes(k));
}

// Agrupa por clave
export function groupBy<T>(arr: T[], key: (x: T) => string) {
  const m = new Map<string, T[]>();
  for (const a of arr) {
    const k = key(a);
    m.set(k, [...(m.get(k) ?? []), a]);
  }
  return m;
}

// Construye secciones para la vista agrupada (instituciones + extras)
export function buildHomeGroups(data: Item[]) {
  // Agrupar todo el dataset por institución
  const byProvider = groupBy(data, d => d.provider_name || "Sin institución");
  const instituciones = Array.from(byProvider.entries())
    .map(([inst, items]) => ({
      id: `inst_${inst}`,
      title: inst,
      count: items.length,
      type: "flat" as const,
      items,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  // Categorías adicionales: Cursos tecnológicos (Agenda Tec.)
  const tec = data.filter(isTechCourse);
  if (tec.length) {
    instituciones.push({
      id: "tec",
      title: "Cursos tecnológicos (Agenda Tec.)",
      count: tec.length,
      type: "flat" as const,
      items: tec,
    });
  }

  return instituciones;
}


