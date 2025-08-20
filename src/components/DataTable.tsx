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

  const getLevelBadgeColor = (level?: string | null) => {
    if (!level) return "bg-gray-100 text-gray-700";
    
    switch (level.toLowerCase()) {
      case "superior":
        return "bg-blue-100 text-blue-800";
      case "técnica":
      case "tecnica":
        return "bg-green-100 text-green-800";
      case "secundaria":
        return "bg-violet-100 text-violet-800";
      case "curso":
        return "bg-orange-100 text-orange-800";
      case "posgrado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
                {r.level_or_modality && (
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getLevelBadgeColor(r.level_or_modality)}`}>
                    {r.level_or_modality}
                  </span>
                )}
              </Td>
              <Td>{r.unit}</Td>
              <Td>
                <div className="truncate max-w-[320px]">{r.address}</div>
                {r.barrio && (
                  <span className="inline-block mt-1 rounded bg-amber-100 text-amber-900 text-[11px] px-2 py-0.5">
                    {r.barrio}
                  </span>
                )}
              </Td>
              <Td>
                {r.phone && <div>{r.phone}</div>}
                {r.contact && <div className="truncate max-w-[260px]">{r.contact}</div>}
                {r.website && (
                  <a
                    className="text-blue-600 underline"
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Web ↗
                  </a>
                )}
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
