"use client";

// DO NOT MODIFY: data wiring & filtering logic
import type { ActiveFilters } from "@/lib/filters";
import { Sidebar } from "@/components/ui/sidebar";

export type Facets = {
  units: string[];
  titles: string[];
  levels: string[];
  barrios: string[];
};

const EMPTY: ActiveFilters = { q: "", unit: [], title: [], level: [], barrio: [], withGeo: false, near: null, radiusKm: undefined };

type Props = { facets: Facets; value: ActiveFilters; onChange: (f: ActiveFilters) => void };

function toggle(list: string[] | undefined, val: string, checked: boolean) {
  const arr = list ? [...list] : [];
  if (checked) {
    if (!arr.includes(val)) arr.push(val);
    return arr;
  }
  return arr.filter(v => v !== val);
}

export default function Filters({ facets, value, onChange }: Props) {
  const handle = (field: "unit" | "title" | "level" | "barrio", val: string, checked: boolean) => {
    onChange({ ...value, [field]: toggle(value[field as keyof ActiveFilters] as string[] | undefined, val, checked) });
  };

  const reset = () => onChange({ ...EMPTY });

  const toggleGeo = () => onChange({ ...value, withGeo: !value.withGeo });

  const toggleNear = () => {
    if (value.near) {
      onChange({ ...value, near: null, radiusKm: undefined });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        onChange({ ...value, near: { lat: pos.coords.latitude, lon: pos.coords.longitude }, radiusKm: 2 });
      });
    }
  };

  return (
    <Sidebar className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Filtros</h2>
        <button onClick={reset} className="text-sm text-indigo-700">Limpiar</button>
      </div>

      <div className="space-y-3">
        <details>
          <summary className="cursor-pointer font-medium">Nivel</summary>
          <div className="mt-2 space-y-1 pl-2">
            {facets.levels.map(level => (
              <label key={level} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.level?.includes(level) || false}
                  onChange={e => handle("level", level, e.target.checked)}
                />
                {level}
              </label>
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer font-medium">Barrio</summary>
          <div className="mt-2 space-y-1 pl-2">
            {facets.barrios.map(b => (
              <label key={b} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.barrio?.includes(b) || false}
                  onChange={e => handle("barrio", b, e.target.checked)}
                />
                {b}
              </label>
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer font-medium">Unidad</summary>
          <div className="mt-2 space-y-1 pl-2">
            {facets.units.map(u => (
              <label key={u} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.unit?.includes(u) || false}
                  onChange={e => handle("unit", u, e.target.checked)}
                />
                {u}
              </label>
            ))}
          </div>
        </details>

        <details>
          <summary className="cursor-pointer font-medium">Título</summary>
          <div className="mt-2 space-y-1 pl-2">
            {facets.titles.map(t => (
              <label key={t} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.title?.includes(t) || false}
                  onChange={e => handle("title", t, e.target.checked)}
                />
                {t}
              </label>
            ))}
          </div>
        </details>

        <div className="pt-2 border-t border-slate-200 space-y-2">
          <label className="flex gap-2 text-sm">
            <input type="checkbox" checked={value.withGeo || false} onChange={toggleGeo} />
            Solo con mapa
          </label>
          <div className="space-y-1">
            <button onClick={toggleNear} className="text-sm text-indigo-700">
              {value.near ? "Borrar ubicación" : "Cerca de mí"}
            </button>
            {value.near && (
              <input
                type="number"
                className="w-full border border-slate-200 rounded p-1 text-sm"
                value={value.radiusKm ?? 2}
                min={1}
                max={20}
                onChange={e => onChange({ ...value, radiusKm: Number(e.target.value) })}
              />
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
