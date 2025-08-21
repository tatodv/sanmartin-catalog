"use client";
import data from "./(data)/catalog.json";
import { useMemo, useState } from "react";
import { deriveFacets, applyFilters, type ActiveFilters } from "@/lib/filters";
import { Item } from "@/lib/types";
import Filters from "@/components/Filters";
import DataTable from "@/components/DataTable";
import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("@/components/MapEmbed"), { ssr: false });

export default function Page() {
	const dataset = data as Item[];
	const facets = useMemo(() => deriveFacets(dataset), [dataset]);
	const [filters, setFilters] = useState<ActiveFilters>({ q: "", withGeo: false });
	const results = useMemo(() => applyFilters(dataset, filters), [dataset, filters]);
	const points = useMemo(
		() => results
			.filter(r => typeof r.lat === "number" && typeof r.lon === "number")
			.map(r => ({ lat: r.lat as number, lon: r.lon as number, label: r.provider_name || r.program_name || "" })),
		[results]
	);
	const [showMap, setShowMap] = useState(true);

	return (
		<main className="min-h-screen bg-slate-50 text-slate-800">
			{/* Topbar */}
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
				<div className="mx-auto max-w-7xl px-4 h-14 flex items-center gap-3">
					<h1 className="text-lg font-semibold">Formación en San Martín</h1>
					<div className="ml-auto flex items-center gap-2">
						<button
							onClick={() => setShowMap(v => !v)}
							className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
						>
							{showMap ? "Ocultar mapa" : "Ver mapa"}
						</button>
					</div>
				</div>
			</header>

			{/* Main split */}
			<div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
				{/* Sidebar filtros (colapsables) */}
				<aside className="lg:sticky lg:top-16 self-start">
					<div className="rounded-xl border border-slate-200 bg-white shadow-sm">
						<div className="p-3 border-b border-slate-100">
							<input
								className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
								placeholder="Buscar por institución, programa, título…"
								value={filters.q}
								onChange={(e) => setFilters({ ...filters, q: e.target.value })}
							/>
						</div>
						{/* Filtros con acordeones */}
						<div className="p-3">
							<Filters facets={facets} value={filters} onChange={setFilters} />
						</div>
					</div>
				</aside>

				{/* Contenido */}
				<section className="space-y-3">
					<div className="flex items-center justify-between">
						<p className="text-xs text-slate-600">
							Mostrando <strong>{results.length}</strong> de {dataset.length} ofertas
							{filters.withGeo ? " (solo con mapa)" : ""}.
						</p>
						<div className="hidden lg:flex items-center gap-2">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									checked={!!filters.withGeo}
									onChange={(e) => setFilters({ ...filters, withGeo: e.target.checked })}
								/>
								Solo con mapa
							</label>
						</div>
					</div>

					{/* Tabla/cards */}
					<div className={`grid gap-4 ${showMap ? "lg:grid-cols-2" : ""}`}>
						<div className={`${showMap ? "order-2 lg:order-1" : ""}`}>
							<DataTable data={results} />
						</div>
						{showMap && (
							<div className="order-1 lg:order-2 rounded-xl border border-slate-200 bg-white shadow-sm p-2">
								<MapEmbed points={points} height={520} />
							</div>
						)}
					</div>
				</section>
			</div>
		</main>
	);
}
