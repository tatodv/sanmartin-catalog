"use client";

import data from "./(data)/catalog.json";
import { useMemo, useState } from "react";
import { deriveFacets, applyFilters, type ActiveFilters } from "@/lib/filters";
import { Item } from "@/lib/types";
import Filters from "@/components/Filters";
import DataTable from "@/components/DataTable";

export default function Page() {
  const dataset = data as Item[];
  const facets = useMemo(() => deriveFacets(dataset), [dataset]);
  const [filters, setFilters] = useState<ActiveFilters>({ q: "" });
  const results = useMemo(() => applyFilters(dataset, filters), [dataset, filters]);
  
  // después de calcular `results`:
  const ordered = useMemo(() => {
    const order = (v?: string | null) => {
      if (!v) return 99;
      // prioridad: Curso -> Técnica -> Secundaria -> Superior (cambiá si querés)
      const map: Record<string, number> = { "Curso": 1, "Técnica": 2, "Secundaria": 3, "Superior": 4 };
      return map[v] ?? 98;
    };
    return [...results].sort((a, b) => {
      const byLevel = order(a.level_or_modality) - order(b.level_or_modality);
      if (byLevel !== 0) return byLevel;
      return (a.provider_name || "").localeCompare(b.provider_name || "");
    });
  }, [results]);

  // Estadísticas
  const stats = useMemo(() => {
    const providers = new Set(dataset.map(d => d.provider_name));
    const levels = new Set(dataset.map(d => d.level_or_modality).filter(Boolean));
    const modalities = new Set(dataset.map(d => d.modality).filter(Boolean));
    const barrios = new Set(dataset.map(d => d.barrio).filter(Boolean));
    
    return {
      total: dataset.length,
      providers: providers.size,
      levels: levels.size,
      modalities: modalities.size,
      barrios: barrios.size
    };
  }, [dataset]);

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-8 space-y-6">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Formación en San Martín</h1>
          <p className="text-sm text-slate-600">
            Buscá por institución, programa, título o unidad académica.
          </p>
        </div>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-xs text-slate-600">Ofertas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.providers}</div>
            <div className="text-xs text-slate-600">Instituciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.levels}</div>
            <div className="text-xs text-slate-600">Niveles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.modalities}</div>
            <div className="text-xs text-slate-600">Modalidades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.barrios}</div>
            <div className="text-xs text-slate-600">Barrios</div>
          </div>
        </div>
      </header>

      <Filters facets={facets} value={filters} onChange={setFilters} />

      <section className="space-y-2">
        <p className="text-xs text-slate-600">
          Mostrando <strong>{results.length}</strong> de {dataset.length} ofertas.
        </p>
        <DataTable data={ordered} />
      </section>
    </main>
  );
}
