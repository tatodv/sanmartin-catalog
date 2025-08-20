export type Item = {
  provider_name: string;
  program_name: string;
  title?: string | null;
  level_or_modality?: string | null; // Ej: "Superior"
  modality?: string | null;
  address?: string | null;
  barrio?: string | null;      // hoy: "A validar (UNSAM)" en UNSAM
  locality?: string | null;    // "San Martín"
  contact?: string | null;
  phone?: string | null;
  website?: string | null;
  schedule?: string | null;
  duration?: string | null;
  enrollment_period?: string | null;
  notes?: string | null;
  unit?: string | null;        // Unidad académica UNSAM
  lat?: number | null;
  lon?: number | null;
};
