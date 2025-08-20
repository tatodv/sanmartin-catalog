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
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Formación en San Martín</h1>
        <p className="text-sm text-muted-foreground">
          Buscá por institución, programa, título o unidad académica.
        </p>
      </header>

      <Filters facets={facets} value={filters} onChange={setFilters} />

      <section>
        <DataTable data={results} />
        <p className="text-xs text-muted-foreground mt-2">
          Mostrando {results.length} de {dataset.length} ofertas.
        </p>
      </section>
    </main>
  );
}
