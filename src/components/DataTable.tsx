"use client";
import type { Item } from "@/lib/types";

export default function DataTable({ data }: { data: Item[] }) {
	if (!data.length) {
		return (
			<div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
				No hay resultados con esos filtros.
			</div>
		);
	}

	return (
		<ul className="grid gap-3">
			{data.map((r, i) => (
				<li key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
					<div className="flex items-start justify-between gap-3">
						<div>
							<div className="text-sm font-semibold text-slate-900">{r.provider_name}</div>
							{r.program_name && <div className="text-sm text-slate-700">{r.program_name}</div>}
							{r.title && <div className="text-xs text-slate-600">{r.title}</div>}
						</div>
						{r.level_or_modality && (
							<span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-800">
								{r.level_or_modality}
							</span>
						)}
					</div>

					<div className="mt-2 text-xs text-slate-600">
						<div className="truncate">{r.address || r.address_kmz}</div>
						{r.barrio && (
							<span className={`mt-1 inline-block rounded px-2 py-0.5 text-[11px] ${
								r.barrio.toLowerCase().includes("validar")
									? "bg-amber-100 text-amber-900"
									: "bg-slate-100 text-slate-700"
							}` }>
								{r.barrio}
							</span>
						)}
					</div>

					<div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
						{r.website && <a className="text-indigo-700 hover:underline" href={r.website} target="_blank" rel="noopener noreferrer">Web ↗</a>}
						{r.contact && <span className="truncate">{r.contact}</span>}
						{r.maps_url ? (
							<a className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50" href={r.maps_url} target="_blank" rel="noopener noreferrer">
								Cómo llegar ↗
							</a>
						) : <span className="text-xs text-slate-400">Sin mapa</span>}
					</div>
				</li>
			))}
		</ul>
	);
}
