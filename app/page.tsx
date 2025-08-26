"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { catalog, facets, applyFilters, facetCounts } from "@/lib/catalog";
import type { FilterState } from "@/lib/urlState";
import { encodeFilters, decodeFilters } from "@/lib/urlState";
import { debounce } from "@/lib/debounce";

// Mantener tus componentes visuales existentes
import { TopBar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import ResultsList from "@/components/ui/results-list";

// id estable y único por item (hash + índice como defensa)
function makeKey(base: string, i: number) {
  let h = 0;
  for (let c = 0; c < base.length; c++) h = (h * 31 + base.charCodeAt(c)) >>> 0;
  return `${h.toString(36)}-${i}`;
}

const mapsUrl = (addr?: string) =>
  addr ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr + ", San Martín, Buenos Aires")}` : "";

function HomePageContent() {
  const router = useRouter();
  const sp = useSearchParams();

  // 1) estado inicial desde URL
  const [filters, setFilters] = React.useState<FilterState>(() =>
    decodeFilters(sp as unknown as URLSearchParams)
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // 2) estado → URL (shallow)
  const pushUrl = React.useMemo(
    () =>
      debounce((f: FilterState) => {
        const qs = encodeFilters(f);
        router.replace(qs ? `/?${qs}` : "/", { scroll: false });
      }, 250),
    [router]
  );
  React.useEffect(() => { pushUrl(filters); }, [filters, pushUrl]);

  // 3) datos derivados
  const allFacets = React.useMemo(() => facets(catalog), []);
  const results   = React.useMemo(() => applyFilters(catalog, filters), [filters]);
  const counts    = React.useMemo(() => facetCounts(catalog, filters), [filters]);

  if (process.env.NODE_ENV !== "production") {
    console.log("[PAGE] q=", filters.q, "results=", results.length)
  }

  // 4) helpers
  const setFilter = (k: keyof FilterState, v?: string) =>
    setFilters(prev => ({ ...prev, [k]: v || "" }));
  const clearAll = () => setFilters({ q: "" });

  // 5) props para Sidebar (sin cambiar su markup)
  const sidebarProps = {
    searchValue: filters.q || "",
    onSearchChange: (v: string) => setFilter("q", v),

    levels: allFacets.level_norm,    levelCounts: counts.level_norm,    onLevelChange: (v:string)=>setFilter("level_norm", v),
    families: allFacets.family,      familyCounts: counts.family,       onFamilyChange: (v:string)=>setFilter("family", v),
    barrios: allFacets.barrio,       barrioCounts: counts.barrio,       onBarrioChange: (v:string)=>setFilter("barrio", v),
    providers: allFacets.provider,   providerCounts: counts.provider,   onProviderChange: (v:string)=>setFilter("provider_name", v),
    units: allFacets.unit,           unitCounts: counts.unit,           onUnitChange: (v:string)=>setFilter("unit", v),
    titles: allFacets.title,         titleCounts: counts.title,         onTitleChange: (v:string)=>setFilter("title", v),

    onClear: clearAll,
    isMobileOpen: isMobileSidebarOpen,
    onMobileClose: () => setIsMobileSidebarOpen(false),
  } as any;

  // 6) adaptar datos a la tarjeta sin cambiar estilos
  const adapted = React.useMemo(() => results.map((it, i) => {
    const base = `${it.provider_name}|${it.program_name}|${it.unit}|${it.address}|${it.title}`;
    return {
      id: makeKey(base, i),                // id única y estable
      heading: it.program_name,
      badgeRight: it.title,
      chips: [it.provider_name, it.unit].filter(Boolean),
      level: it.level_norm || it.level,
      area: it.family || "",
      barrio: it.barrio || "Barrio no especificado",
      address: it.address || "",
      notes: it.notes || "",
      phone: (it as any).phone || "",
      email: (it as any).email || "",
      modality: (it as any).modality || "",
      maps: mapsUrl(it.address),
      raw: it,
    };
  }), [results]);

  if (process.env.NODE_ENV !== "production") {
    console.log("[SANITY] headerVsList", {
      headerCount: results.length,
      itemsCount: adapted.length,
      first3: adapted.slice(0,3).map(x=>({ heading: x.heading, badge: x.badgeRight }))
    })
  }

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
          <ResultsList items={adapted} />
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

