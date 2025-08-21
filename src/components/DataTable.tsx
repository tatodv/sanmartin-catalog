"use client";
import type { Item } from "@/lib/types";

export default function DataTable({ data }: { data: Item[] }) {
  if (!data.length) {
    return (
      <div className="border rounded-md p-6 text-sm text-slate-600">
        No hay resultados con esos filtros. Probá limpiar o escribir otra palabra.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-md">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr>
            <Th>Institución</Th>
            <Th>Programa</Th>
            <Th>Título</Th>
            <Th>Nivel</Th>
            <Th>Unidad</Th>
            <Th>Dirección</Th>
            <Th>Contacto / Web</Th>
            <Th>Mapa</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className={i % 2 ? "border-t bg-white" : "border-t bg-slate-50/40"}>
              <Td>{r.provider_name}</Td>
              <Td>
                <div className="font-medium">{r.program_name}</div>
                {r.notes && <div className="text-xs text-slate-500 line-clamp-2">{r.notes}</div>}
              </Td>
              <Td>{r.title}</Td>
              <Td>
                {r.level_or_modality ? (
                  <span className="inline-block rounded-full border px-2 py-0.5 text-[11px]">
                    {r.level_or_modality}
                  </span>
                ) : null}
              </Td>
              <Td>{r.unit}</Td>
              <Td>
                <div className="truncate max-w-[320px]">{r.address || r.address_kmz}</div>
                {r.barrio && (
                  <span className={
                    "inline-block mt-1 rounded px-2 py-0.5 text-[11px] " +
                    (r.barrio.toLowerCase().includes("validar")
                      ? "bg-amber-100 text-amber-900"
                      : "bg-slate-200 text-slate-800")
                  }>{r.barrio}</span>
                )}
              </Td>
              <Td>
                {r.phone && <div>{r.phone}</div>}
                {r.contact && <div className="truncate max-w-[260px]">{r.contact}</div>}
                {r.website && (
                  <a className="text-blue-600 underline" href={r.website} target="_blank" rel="noopener noreferrer">
                    Web ↗
                  </a>
                )}
              </Td>
              <Td>
                {r.maps_url ? (
                  <a
                    className="inline-block rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
                    href={r.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={r.lat && r.lon ? "Abrir ubicación (coordenadas)" : "Abrir en Google Maps (búsqueda por dirección)"}
                  >
                    Ver en mapa ↗
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Sin mapa</span>
                )}
                {r.lat && r.lon ? (
                  <span className="ml-2 text-[10px] text-green-700">● geo</span>
                ) : r.geo_source === "mymaps" ? (
                  <span className="ml-2 text-[10px] text-blue-700">● mymaps</span>
                ) : null}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left p-2 font-semibold text-slate-700">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="p-2 align-top">{children}</td>;
}
