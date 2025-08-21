"use client";
import { useState, useEffect } from "react";
import type { Item } from "@/lib/types";

export default function DataTable({ data }: { data: Item[] }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("sanmartin-favorites");
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleFavorite = (item: Item) => {
    const key = `${item.provider_name}-${item.program_name}`;
    const newFavorites = new Set(favorites);
    
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem("sanmartin-favorites", JSON.stringify([...newFavorites]));
  };

  const isFavorite = (item: Item) => {
    const key = `${item.provider_name}-${item.program_name}`;
    return favorites.has(key);
  };

  if (!data.length) {
    return (
      <div className="border rounded-md p-6 text-sm text-slate-600">
        No hay resultados con esos filtros. Probá limpiar o escribir otra palabra.
      </div>
    );
  }

  const exportToCSV = () => {
    const headers = ["Institución", "Programa", "Título", "Nivel", "Unidad", "Dirección", "Barrio", "Contacto", "Teléfono", "Web", "Notas"];
    const csvContent = [
      headers.join(","),
      ...data.map(r => [
        r.provider_name,
        r.program_name,
        r.title || "",
        r.level_or_modality || "",
        r.unit || "",
        r.address || "",
        r.barrio || "",
        r.contact || "",
        r.phone || "",
        r.website || "",
        r.notes || ""
      ].map(field => `"${field.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `formacion-san-martin-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600">
          {data.length} resultados
        </span>
        <button
          onClick={exportToCSV}
          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md border transition-colors"
        >
          📊 Exportar CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-md">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <Th>❤️</Th>
              <Th>Institución</Th>
              <Th>Programa</Th>
              <Th>Título</Th>
              <Th>Nivel</Th>
              <Th>Modalidad</Th>
              <Th>Unidad</Th>
              <Th>Dirección</Th>
              <Th>Contacto / Web</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className={i % 2 ? "border-t bg-white" : "border-t bg-slate-50/40"}>
                <Td>
                  <button
                    onClick={() => toggleFavorite(r)}
                    className={`text-lg transition-colors ${
                      isFavorite(r) ? "text-red-500" : "text-gray-300 hover:text-red-400"
                    }`}
                    title={isFavorite(r) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    {isFavorite(r) ? "❤️" : "🤍"}
                  </button>
                </Td>
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
                <Td>
                  {r.modality ? (
                    <span className={`inline-block px-2 py-0.5 text-[11px] rounded ${
                      r.modality.toLowerCase().includes('presencial') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {r.modality}
                    </span>
                  ) : null}
                </Td>
                <Td>{r.unit}</Td>
                <Td>
                  <div className="truncate max-w-[320px]">{r.address}</div>
                  {r.barrio && (
                    <span
                      className={
                        "inline-block mt-1 rounded px-2 py-0.5 text-[11px] " +
                        (r.barrio.toLowerCase().includes("validar")
                          ? "bg-amber-100 text-amber-900"   // A validar (UNSAM)
                          : "bg-slate-200 text-slate-800")  // barrio conocido
                      }
                    >
                      {r.barrio}
                    </span>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left p-2 font-semibold text-slate-700">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="p-2 align-top">{children}</td>;
}
