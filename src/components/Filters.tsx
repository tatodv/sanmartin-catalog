"use client";
import { ActiveFilters } from "@/lib/filters";

type Facets = {
	units: string[];
	titles: string[];
	levels: string[];
	barrios: string[];
};

const Section = ({title, children, defaultOpen=false}:{title:string; children:React.ReactNode; defaultOpen?:boolean}) => (
	<details className="group border-b border-slate-100 py-2" {...(defaultOpen ? {open:true} : {})}>
		<summary className="flex cursor-pointer list-none items-center justify-between py-1 text-sm font-medium text-slate-800">
			{title}
			<span className="transition-transform group-open:rotate-180">▾</span>
		</summary>
		<div className="mt-2 space-y-1">{children}</div>
	</details>
);

export default function Filters({
	facets, value, onChange
}: { facets: Facets; value: ActiveFilters; onChange: (v: ActiveFilters)=>void }) {

	const set = (patch: Partial<ActiveFilters>) => onChange({ ...value, ...patch });
	const reset = () => onChange({ q: "", unit: [], title: [], level: [], barrio: [], withGeo: value.withGeo });

	const CBList = ({
		items, field
	}: { items: string[]; field: keyof Omit<ActiveFilters,"q"|"withGeo"> }) => {
		const arr = (value[field] as string[] | undefined) ?? [];
		const toggle = (v: string) => {
			const next = arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
			set({ [field]: next } as Partial<ActiveFilters>);
		};
		return (
			<ul className="max-h-48 overflow-auto pr-1 text-sm">
				{items.map((o) => (
					<li key={o} className="flex items-center gap-2 py-1">
						<input type="checkbox" checked={arr.includes(o)} onChange={()=>toggle(o)} />
						<span className="truncate" title={o}>{o}</span>
					</li>
				))}
			</ul>
		);
	};

	return (
		<div>
			<Section title="Nivel" defaultOpen>
				<CBList items={facets.levels} field="level" />
			</Section>
			<Section title="Barrio">
				<CBList items={facets.barrios} field="barrio" />
			</Section>
			<Section title="Unidad académica">
				<CBList items={facets.units} field="unit" />
			</Section>
			<Section title="Título">
				<CBList items={facets.titles} field="title" />
			</Section>

			<div className="mt-3 flex items-center justify-between">
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={!!value.withGeo}
						onChange={(e)=>set({ withGeo: e.target.checked })}
					/>
					Solo con mapa
				</label>
				<button onClick={reset} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50">
					Limpiar
				</button>
			</div>
		</div>
	);
}
