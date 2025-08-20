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

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Formación en San Martín</h1>
        <p className="text-sm text-slate-600">
          Buscá por institución, programa, título o unidad académica.
        </p>
      </header>

      <Filters facets={facets} value={filters} onChange={setFilters} />

      <section className="space-y-2">
        <p className="text-xs text-slate-600">
          Mostrando <strong>{results.length}</strong> de {dataset.length} ofertas.
        </p>
        <DataTable data={results} />
      </section>
    </main>
  );
}
