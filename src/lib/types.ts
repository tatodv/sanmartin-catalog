export type Item = {
  provider_name: string;
  program_name: string | null;
  title?: string | null;
  level_or_modality?: string | null;
  modality?: string | null;
  address?: string | null;
  barrio?: string | null;
  locality?: string | null;
  contact?: string | null;
  phone?: string | null;
  website?: string | null;
  schedule?: string | null;
  duration?: string | null;
  enrollment_period?: string | null;
  notes?: string | null;
  unit?: string | null;

  // GEO
  lat?: number | null;
  lon?: number | null;
  address_kmz?: string | null;
  maps_url?: string | null;
  geo_source?: string | null; // "mymaps" | "geocode" | etc.
};
