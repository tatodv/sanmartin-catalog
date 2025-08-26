"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import catalog from "./(data)/catalog.json";
import type { Item } from "@/lib/types";
import { deriveFacets, applyFilters, type ActiveFilters } from "@/lib/filters";
import Filters from "@/components/Filters";
import DataTable from "@/components/DataTable";
import GroupedHome from "@/components/GroupedHome";
import { Shell } from "@/components/ui/shell";

const MapEmbed = dynamic(() => import("@/components/MapEmbed"), { ssr: false });

const EMPTY: ActiveFilters = {
  q: "",
  unit: [],
  title: [],
  level: [],
  barrio: [],
  withGeo: false,
  near: null,
  radiusKm: undefined,
};

export default function HomePage() {
  const dataset = catalog as Item[];
  const facets = useMemo(() => deriveFacets(dataset), [dataset]);
  const [filters, setFilters] = useState<ActiveFilters>(EMPTY);
  const [showMap, setShowMap] = useState(false);

  const results = useMemo(() => applyFilters(dataset, filters), [dataset, filters]);
  const isPristine =
    !filters.q &&
    !filters.withGeo &&
    !filters.near &&
    !filters.unit.length &&
    !filters.title.length &&
    !filters.level.length &&
    !filters.barrio.length;

  return (
    <Shell>
      <div className="flex">
        <Filters facets={facets} value={filters} onChange={setFilters} />
        <main className="flex-1 p-4 space-y-4">
          <input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Buscar..."
            className="w-full p-2 border border-slate-200 rounded"
          />
          {isPristine ? (
            <GroupedHome data={dataset} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{results.length} resultados</p>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-sm text-indigo-700"
                >
                  {showMap ? "Ocultar mapa" : "Mostrar mapa"}
                </button>
              </div>
              <div className={`grid gap-4 ${showMap ? "lg:grid-cols-2" : ""}`}>
                <div>
                  <DataTable data={results} />
                </div>
                {showMap && (
                  <div className="h-96">
                    <MapEmbed data={results} />
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </Shell>
  );
}
