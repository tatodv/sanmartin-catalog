export type ProgramLink = { label?: string; url: string };

export type Program = {
  id: string;
  degree_title: string;             // "Tipo" (badge)
  title: string;                    // "Carreras" con prefijo por tipo
  unit?: string;                    // UNIDAD ACADÉMICA / ÁREA
  enrollment_period_text?: string;  // PERÍODO DE INSCRIPCIÓN (texto)
  phone?: string;                   // Teléfono
  info?: string;                    // INFO ADICIONAL
  institution?: string;             // Institución
  address?: string;                 // Dirección
  links?: ProgramLink[];            // Web / Contacto / Llegar
};
