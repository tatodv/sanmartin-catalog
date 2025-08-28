import data from "../(data)/catalog.json";
import { AcademicProgramsGrid } from "@/components/academic-programs-grid";
import type { Program } from "@/types/program";

export const dynamic = "force-static";

export default function Page() {
  // Mapea Program (actual) a AcademicProgram (esperado por V0)
  const programsV0 = (data as Program[]).slice(0, 60).map((p) => ({
    id: p.id,
    title: p.title,
    type:
      (p.degree_title as any) === "Tecnicatura"
        ? "Tecnicatura"
        : (p.degree_title as any) === "Maestría"
        ? "Maestría"
        : (p.degree_title as any) === "Doctorado"
        ? "Doctorado"
        : (p.degree_title as any) === "Especialización"
        ? "Especialización"
        : "Licenciatura",
    academicUnit: p.unit || "",
    location: { institution: p.institution || "", address: p.address || "" },
    website: p.links?.find((l) => (l.label || "").toLowerCase().includes("web"))?.url,
    email: p.links?.find((l) => (l.label || "").toLowerCase().includes("contacto"))?.url?.replace(/^mailto:/, ""),
  }));

  // El grid V0 usa datos internos; reusamos el componente de tarjeta pasando por contexto local.
  // Para no alterar archivos V0, inyectamos temporalmente la lista como global (simple y no intrusivo).
  (globalThis as any).__ACADEMIC_PROGRAMS__ = programsV0;
  return (
    <main className="p-4">
      <AcademicProgramsGrid />
    </main>
  );
}


