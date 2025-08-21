// Tipado base para ítems del catálogo
export type Item = {
  provider_name: string;
  program_name: string | null;
  title?: string | null;
  unit?: string | null;
  address?: string | null;
  barrio?: string | null;
  locality?: string | null;
  phone?: string | null;
  contact?: string | null;
  website?: string | null;
  notes?: string | null;

  // GEO
  lat?: number | null;
  lon?: number | null;
  maps_url?: string | null;
  geo_source?: string | null;

  // CANÓNICOS (NUEVO)
  level_or_modality?: string | null; // original
  level_norm?: "Curso" | "Secundaria" | "Técnica" | "Superior" | null;
  family?: string | null;            // p.ej. "Informática", "Textil", "Metalmecánica", etc.

  // BUSCADOR
  _search?: string; // blob normalizado (se rellena en build)
};


