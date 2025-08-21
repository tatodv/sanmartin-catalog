"use client";
import { useState, useEffect } from "react";
import { ActiveFilters } from "@/lib/filters";

type Facets = {
  units: string[];
  titles: string[];
  levels: string[];
  barrios: string[];
  modalities: string[]; // NUEVO
};

export default function Filters({
  facets, value, onChange
}: {
  facets: Facets;
  value: ActiveFilters;
  onChange: (v: ActiveFilters) => void;
}) {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("sanmartin-favorites");
    if (saved) {
      setFavoritesCount(JSON.parse(saved).length);
    }
  }, []);

  const set = (patch: Partial<ActiveFilters>) => onChange({ ...value, ...patch });
  const reset = () => onChange({ q: "", unit: [], title: [], level: [], barrio: [], modality: [] });

  const Multi = ({
    label, options, keyName
  }: {
    label: string;
    options: string[];
    keyName: keyof Omit<ActiveFilters, "q">;
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
      <div className="grid md:grid-cols-7 gap-3">
        <label className="md:col-span-2 flex flex-col gap-1">
          <span className="text-sm font-medium">Buscar</span>
          <input
            className="rounded-md border border-slate-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="ej: Licenciatura, Programación, CFP 401…"
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </label>

        <Multi label="Unidad"        options={facets.units}      keyName="unit" />
        <Multi label="Título"        options={facets.titles}     keyName="title" />
        <Multi label="Nivel"         options={facets.levels}     keyName="level" />
        <Multi label="Barrio"        options={facets.barrios}    keyName="barrio" />
        <Multi label="Modalidad"     options={facets.modalities} keyName="modality" /> {/* NUEVO */}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Limpiar filtros
          </button>
          {favoritesCount > 0 && (
            <span className="text-sm text-slate-600">
              ❤️ {favoritesCount} favorito{favoritesCount !== 1 ? 's' : ''} guardado{favoritesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
