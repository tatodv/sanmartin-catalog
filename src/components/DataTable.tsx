"use client";
import type { Item } from "@/lib/types";

export default function DataTable({ data }: { data: Item[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50">
          <tr>
            <Th>Institución</Th>
            <Th>Programa</Th>
            <Th>Título</Th>
            <Th>Unidad</Th>
            <Th>Dirección</Th>
            <Th>Contacto / Web</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border-t">
              <Td>{r.provider_name}</Td>
              <Td>
                <div className="font-medium">{r.program_name}</div>
                {r.notes && (
                  <div className="text-xs text-muted-foreground">{r.notes}</div>
                )}
              </Td>
              <Td>{r.title}</Td>
              <Td>{r.unit}</Td>
              <Td>
                <div>{r.address}</div>
                {r.barrio && (
                  <div className="text-[11px] text-gray-500">{r.barrio}</div>
                )}
              </Td>
              <Td>
                {r.phone && <div>{r.phone}</div>}
                {r.contact && <div className="truncate">{r.contact}</div>}
                {r.website && (
                  <a className="text-blue-600 underline" href={r.website} target="_blank">
                    Web
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
  return <th className="text-left p-2">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="p-2 align-top">{children}</td>;
}
