"use client";

// DO NOT MODIFY: data wiring & filtering logic
import type { Item } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DataTable({ data }: { data: Item[] }) {
  return (
    <div className="space-y-4">
      {data.map((it, idx) => (
        <Card key={idx}>
          <CardHeader className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{it.program_name || it.provider_name}</h3>
              {it.program_name && (
                <p className="text-sm text-slate-600">{it.provider_name}</p>
              )}
            </div>
            {it.level_norm && (
              <Badge className="bg-indigo-100 border-indigo-200 text-indigo-800">
                {it.level_norm}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            {it.address && <p>{it.address}</p>}
            <div className="flex flex-wrap gap-3">
              {it.website && (
                <a
                  href={it.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-700 hover:underline"
                >
                  Web ↗
                </a>
              )}
              {it.maps_url && (
                <a
                  href={it.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-700 hover:underline"
                >
                  Cómo llegar ↗
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
