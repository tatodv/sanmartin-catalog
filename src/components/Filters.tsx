"use client";
import { ActiveFilters } from "@/lib/filters";

type Facets = {
  units: string[];
  titles: string[];
};

export default function Filters({
  facets, value, onChange
}: {
  facets: Facets;
  value: ActiveFilters;
  onChange: (v: ActiveFilters) => void;
}) {
  const set = (patch: Partial<ActiveFilters>) => onChange({ ...value, ...patch });

  const Multi = ({
    label, options, keyName
  }: {
    label: string;
    options: string[];
    keyName: keyof Omit<ActiveFilters, "q">;
  }) => (
    <label className="flex flex-col gap-1">
      <span className="text-sm">{label}</span>
      <select
        multiple
        className="min-h-28 rounded border p-2 bg-white"
        value={(value[keyName] as string[] | undefined) ?? []}
        onChange={(e) =>
          set({
            [keyName]: Array.from(e.target.selectedOptions).map((o) => o.value),
          } as Partial<ActiveFilters>)
        }
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="grid md:grid-cols-5 gap-3">
      <label className="md:col-span-2 flex flex-col gap-1">
        <span className="text-sm">Buscar</span>
        <input
          className="rounded border p-2"
          placeholder="ej: Licenciatura, UNSAM, Economía..."
          value={value.q}
          onChange={(e) => set({ q: e.target.value })}
        />
      </label>

      <Multi label="Unidad académica" options={facets.units} keyName="unit" />
      <Multi label="Título" options={facets.titles} keyName="title" />
    </div>
  );
}
