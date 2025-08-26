"use client";

// DO NOT MODIFY: data wiring & filtering logic
import type { Item } from "@/lib/types";
import { buildHomeGroups } from "@/lib/grouping";
import DataTable from "./DataTable";

export default function GroupedHome({ data }: { data: Item[] }) {
  const groups = buildHomeGroups(data);

  return (
    <div className="space-y-4">
      {groups.map(g => (
        <details key={g.id} className="bg-white border border-slate-200 rounded-lg">
          <summary className="cursor-pointer p-3 font-medium flex justify-between">
            <span>{g.title}</span>
            <span className="text-sm text-slate-600">{g.count}</span>
          </summary>
          <div className="p-3 space-y-3">
            {g.type === "flat" && g.items && <DataTable data={g.items} />}
            {g.type === "nested" && g.groups && (
              <div className="space-y-2">
                {g.groups.map(sub => (
                  <details key={sub.id} className="border border-slate-200 rounded-lg">
                    <summary className="cursor-pointer p-2 font-medium flex justify-between bg-slate-50">
                      <span>{sub.title}</span>
                      <span className="text-sm text-slate-600">{sub.count}</span>
                    </summary>
                    <div className="p-2">
                      <DataTable data={sub.items} />
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
