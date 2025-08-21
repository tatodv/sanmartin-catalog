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

// Construye secciones para la vista agrupada (inicial)
export function buildHomeGroups(data: Item[]) {
  // 1) Secundaria por institución (usar nivel canónico)
  const sec = data.filter(d => d.level_norm === "Secundaria");
  const secByInst = groupBy(sec, d => d.provider_name || "Sin institución");
  const secundariaPorInstitucion = Array.from(secByInst.entries()).map(([inst, items]) => ({
    id: `sec__${inst}`,
    title: inst,
    subtitle: `${items.length} oferta(s)`,
    items,
  }));

  // 2) Cursos tecnológicos (Agenda Tec.) → family normalizada
  const tec = data.filter(d => d.family === "Informática");
  
  // 3) Técnica (grupo plano) usando nivel canónico
  const tecnicas = data.filter(d => d.level_norm === "Técnica");
  
  // 4) Superior (universidades, terciarios)
  const superior = data.filter(d => d.level_norm === "Superior");
  
  // 5) Cursos generales
  const cursos = data.filter(d => d.level_norm === "Curso");

  return [
    {
      id: "G1",
      title: `Secundaria — por institución`,
      count: new Set(sec.map(s => s.provider_name)).size,
      type: "nested" as const,
      groups: secundariaPorInstitucion,
    },
    {
      id: "G2",
      title: `Cursos tecnológicos (Agenda Tec.)`,
      count: tec.length,
      type: "flat" as const,
      items: tec,
    },
    {
      id: "G3",
      title: `Técnica`,
      count: tecnicas.length,
      type: "flat" as const,
      items: tecnicas,
    },
    {
      id: "G4",
      title: `Superior`,
      count: superior.length,
      type: "flat" as const,
      items: superior,
    },
    {
      id: "G5",
      title: `Cursos y Capacitaciones`,
      count: cursos.length,
      type: "flat" as const,
      items: cursos,
    },
  ];
}


