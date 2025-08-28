"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import data from "./(data)/catalog.json";
import type { Program } from "@/types/program";
import { debounce } from "@/lib/debounce";

// Mantener tus componentes visuales existentes
import { TopBar } from "@/components/top-bar";
import { Sidebar } from "@/components/Sidebar";
import ProgramCard from "@/components/ProgramCard";



// Función para obtener facets desde los nuevos datos
function getFacets(items: Program[]) {
  const uniq = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.map(v => (v || "").trim()).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

  return {
    tipo: uniq(items.map(x => x.degree_title)),
    carrera: uniq(items.map(x => x.title)),
    institucion: uniq(items.map(x => x.institution)),
    unidad: uniq(items.map(x => x.unit)),
  };
}

// Función para aplicar filtros
function applyFilters(items: Program[], filters: any) {
  let filtered = items;

  // Filtro por búsqueda
  if (filters.q) {
    const q = filters.q.toLowerCase();
    filtered = filtered.filter(item => {
      const hay = (s?: string) => (s || "").toLowerCase().includes(q);
      return hay(item.title) || hay(item.unit) || hay(item.institution) || hay(item.address);
    });
  }

  // Filtros por facetas
  if (filters.tipo) {
    filtered = filtered.filter(item => item.degree_title === filters.tipo);
  }
  if (filters.carrera) {
    filtered = filtered.filter(item => item.title === filters.carrera);
  }
  if (filters.institucion) {
    filtered = filtered.filter(item => item.institution === filters.institucion);
  }
  if (filters.unidad) {
    filtered = filtered.filter(item => item.unit === filters.unidad);
  }

  return filtered;
}

// Función para obtener conteos de facetas
function getFacetCounts(items: Program[], filters: any) {
  const countBy = (rows: Program[], key: keyof Program) =>
    rows.reduce<Record<string, number>>((acc, it) => {
      const v = (it[key] as any) || "";
      if (!v) return acc;
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});

  const filtered = applyFilters(items, { q: filters.q });
  
  return {
    tipo: countBy(filtered, "degree_title"),
    carrera: countBy(filtered, "title"),
    institucion: countBy(filtered, "institution"),
    unidad: countBy(filtered, "unit"),
  };
}

// Función para decodificar filtros desde URL
function decodeFilters(sp: URLSearchParams) {
  return {
    q: sp.get("q") || "",
    tipo: sp.get("tipo") || "",
    carrera: sp.get("carrera") || "",
    institucion: sp.get("institucion") || "",
    unidad: sp.get("unidad") || "",
  };
}

// Función para codificar filtros a URL
function encodeFilters(f: any) {
  const params = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v) params.set(k, v as string);
  });
  return params.toString();
}

function HomePageContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const items = data as Program[];

  // 1) estado inicial desde URL
  const [filters, setFilters] = React.useState(() =>
    decodeFilters(sp as unknown as URLSearchParams)
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // 2) estado → URL (shallow)
  const pushUrl = React.useMemo(
    () =>
      debounce((f: any) => {
        const qs = encodeFilters(f);
        router.replace(qs ? `/?${qs}` : "/", { scroll: false });
      }, 250),
    [router]
  );
  React.useEffect(() => { pushUrl(filters); }, [filters, pushUrl]);

  // 3) datos derivados
  const allFacets = React.useMemo(() => getFacets(items), [items]);
  const results = React.useMemo(() => applyFilters(items, filters), [items, filters]);
  const counts = React.useMemo(() => getFacetCounts(items, filters), [items, filters]);

  if (process.env.NODE_ENV !== "production") {
    console.log("[PAGE] q=", filters.q, "results=", results.length)
  }

  // 4) helpers
  const setFilter = (k: string, v?: string) =>
    setFilters(prev => ({ ...prev, [k]: v || "" }));
  const clearAll = () => setFilters({ 
    q: "", 
    tipo: "", 
    carrera: "", 
    institucion: "", 
    unidad: "" 
  });

  // 5) props para Sidebar
  const sidebarProps = {
    levels: allFacets.tipo,          levelCounts: counts.tipo,          onLevelChange: (v:string)=>setFilter("tipo", v),
    families: allFacets.carrera,     familyCounts: counts.carrera,      onFamilyChange: (v:string)=>setFilter("carrera", v),
    barrios: allFacets.institucion,  barrioCounts: counts.institucion,  onBarrioChange: (v:string)=>setFilter("institucion", v),
    providers: allFacets.unidad,     providerCounts: counts.unidad,     onProviderChange: (v:string)=>setFilter("unidad", v),

    onClear: clearAll,
    isMobileOpen: isMobileSidebarOpen,
    onMobileClose: () => setIsMobileSidebarOpen(false),
  };



  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        searchQuery={filters.q || ""}
        onSearchChange={(v: string) => setFilter("q", v)}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: desktop fijo y móvil deslizante controlado por props */}
        <Sidebar {...sidebarProps} />

        {/* Contenedor de resultados con padding para separar del sidebar */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando…</div>}>
      <HomePageContent />
    </Suspense>
  );
}

