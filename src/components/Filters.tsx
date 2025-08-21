"use client";
import { ActiveFilters } from "@/lib/filters";

type Facets = {
  units: string[];
  titles: string[];
  levels: string[];
  barrios: string[];
};

export default function Filters({
  facets, value, onChange
}: {
  facets: Facets;
  value: ActiveFilters;
  onChange: (v: ActiveFilters) => void;
}) {
  const set = (patch: Partial<ActiveFilters>) => onChange({ ...value, ...patch });
  const reset = () => onChange({ q: "", unit: [], title: [], level: [], barrio: [], withGeo: false });

  const Multi = ({
    label, options, keyName
  }: {
    label: string;
    options: string[];
    keyName: keyof Omit<ActiveFilters,"q"|"withGeo">;
  }) => (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <select
        multiple
        className="min-h-28 rounded-md border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        value={(value[keyName] as string[] | undefined) ?? []}
        onChange={(e) => set({ [keyName]: Array.from(e.target.selectedOptions).map(o => o.value) } as Partial<ActiveFilters>)}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-6 gap-3">
        <label className="md:col-span-2 flex flex-col gap-1">
          <span className="text-sm font-medium">Buscar</span>
          <input
            className="rounded-md border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="ej: Licenciatura, Programación, CFP 401…"
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </label>

        <Multi label="Unidad académica" options={facets.units}  keyName="unit" />
        <Multi label="Título"            options={facets.titles} keyName="title" />
        <Multi label="Nivel"             options={facets.levels} keyName="level" />
        <Multi label="Barrio"            options={facets.barrios} keyName="barrio" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            id="withGeo"
            type="checkbox"
            className="h-4 w-4"
            checked={!!value.withGeo}
            onChange={(e) => set({ withGeo: e.target.checked })}
          />
          <label htmlFor="withGeo" className="text-sm">Solo con mapa</label>
        </div>

        <button
          onClick={reset}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
