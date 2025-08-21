"use client";
import type { Item } from "@/lib/types";
import { buildHomeGroups, isTechCourse } from "@/lib/grouping";
import { Accordion } from "@/components/ui/Accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ItemCard({ r }: { r: Item }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-accent/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {r.provider_name}
            </h3>
            {r.program_name && (
              <div className="mt-1 text-sm text-muted-foreground truncate">{r.program_name}</div>
            )}
          </div>
          <div className="flex gap-2">
            {r.level_or_modality && (
              <Badge variant="outline" className="text-xs">
                {r.level_or_modality}
              </Badge>
            )}
            {isTechCourse(r) && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Tecnológico</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">
        {r.address && <div className="truncate">{r.address}</div>}
        {r.website && (
          <a className="text-accent hover:underline" href={r.website} target="_blank" rel="noopener noreferrer">
            Web ↗
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export default function GroupedHome({ data }: { data: Item[] }) {
  const groups = buildHomeGroups(data).filter((g: any) => (g.type === "nested" ? g.groups?.length : g.items?.length));

  return (
    <div className="space-y-4">
      {groups.map((g: any) => (
        <Accordion key={g.id} title={g.title} badge={g.count}>
          {g.type === "nested" ? (
            <div className="space-y-3">
              {g.groups!.map((sub: any) => (
                <Accordion key={sub.id} title={sub.title} badge={sub.items.length}>
                  <div className="space-y-3">
                    {sub.items.map((it: Item, idx: number) => (
                      <ItemCard key={idx} r={it} />
                    ))}
                  </div>
                </Accordion>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(g.items as Item[]).map((it: Item, idx: number) => (
                <ItemCard key={idx} r={it} />
              ))}
            </div>
          )}
        </Accordion>
      ))}
    </div>
  );
}


