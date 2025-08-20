export type Item = {
  provider_name: string;
  program_name: string;
  title?: string;
  level_or_modality?: string; // Ej: "Superior"
  modality?: string;
  address?: string;
  barrio?: string;      // hoy: "A validar (UNSAM)" en UNSAM
  locality?: string;    // "San Martín"
  contact?: string;
  phone?: string;
  website?: string;
  schedule?: string;
  duration?: string;
  enrollment_period?: string;
  notes?: string;
  unit?: string;        // Unidad académica UNSAM
  lat?: number;
  lon?: number;
};
