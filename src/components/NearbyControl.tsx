"use client";

export default function NearbyControl({
  value,
  onChange
}: {
  value: { near: {lat:number; lon:number} | null; radiusKm?: number };
  onChange: (patch: Partial<{ near: {lat:number; lon:number} | null; radiusKm?: number }>) => void;
}) {
  const askGeoloc = () => {
    if (!navigator.geolocation) return alert("Tu navegador no permite geolocalización.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ near: { lat: pos.coords.latitude, lon: pos.coords.longitude } });
      },
      (err) => alert("No se pudo obtener tu ubicación: " + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border rounded-md p-3">
      <button
        onClick={askGeoloc}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
      >
        Usar mi ubicación
      </button>

      <label className="flex items-center gap-2 text-sm">
        Radio (km)
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value.radiusKm ?? 3}
          onChange={(e) => onChange({ radiusKm: Number(e.target.value) })}
        />
        <span className="text-xs tabular-nums">{value.radiusKm ?? 3} km</span>
      </label>

      {value.near ? (
        <span className="text-xs text-green-700">
          Centro fijado ({value.near.lat.toFixed(4)}, {value.near.lon.toFixed(4)})
        </span>
      ) : (
        <span className="text-xs text-slate-500">Sin centro</span>
      )}

      <button
        onClick={() => onChange({ near: null })}
        className="ml-auto rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
      >
        Limpiar &quot;Cerca de mí&quot;
      </button>
    </div>
  );
}
