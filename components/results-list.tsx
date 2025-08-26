"use client"

import { useMemo } from "react"
import { MapPin, ExternalLink, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ——— Normalizador para mantener el diseño y corregir campos ———
type ResultCard = {
  id?: string;
  heading?: string;      // program_name
  badgeRight?: string;   // title (tipo)
  chips?: string[];      // [provider_name, unit]
  level?: string;        // level_norm
  area?: string;         // family
  barrio?: string;
  address?: string;
  notes?: string;
  phone?: string;
  email?: string;
  modality?: string;
  maps?: string;

  // compat inputs
  program_name?: string;
  title?: string;
  provider?: string;
  provider_name?: string;
  unit?: string;
  level_norm?: string;
  family?: string;
};

const toView = (i: ResultCard) => ({
  id: i.id,
  heading: i.heading ?? i.program_name ?? "",
  badgeRight: i.badgeRight ?? i.title ?? "",
  chips: i.chips ?? ([i.provider ?? i.provider_name, i.unit].filter(Boolean) as string[]),
  level: i.level ?? i.level_norm ?? "",
  area: i.area ?? i.family ?? "",
  barrio: i.barrio ?? "Barrio no especificado",
  address: i.address ?? "",
  notes: i.notes ?? "",
  phone: i.phone ?? "",
  email: i.email ?? "",
  maps: i.maps ?? "",
  modality: i.modality ?? "",
  raw: i,
});

export default function ResultsList({ items }: { items: ResultCard[] }) {
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    const len = Array.isArray(items) ? items.length : 0;
    const first = len ? toView(items[0] as ResultCard) : null;
    console.log("[ResultsList] items:", len, "first:", first?.heading, "/", first?.badgeRight)
  }

  const view = useMemo(() => (Array.isArray(items) ? items.map(it => toView(it)) : []), [items])

  if (!view.length) {
    return (
      <div className="flex-1 p-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
          <p className="text-muted-foreground">Intenta ajustar los filtros o la búsqueda.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {view.map((it, i) => (
          <Card key={it.id ?? `${it.heading ?? "item"}-${i}`} className="hover:shadow-lg transition-shadow bg-card border-border">
      <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold leading-tight text-foreground">{it.heading}</h3>
                {it.badgeRight ? (
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">{it.badgeRight}</Badge>
                ) : null}
        </div>
      </CardHeader>
            <CardContent className="space-y-3">
              {it.chips?.length ? (
                <div className="flex flex-wrap gap-2">
                  {it.chips.map((chip, j) => (
                    <Badge key={`${it.id ?? `${i}`}-chip-${j}`} variant="outline" className="text-xs">{chip}</Badge>
                  ))}
                </div>
              ) : null}

              {(it.barrio || it.address) && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
                  <p className="text-sm flex items-center text-foreground">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    {it.barrio || "Barrio no especificado"}{it.address ? ` • ${it.address}` : ""}
                  </p>
                </div>
              )}

              {it.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{it.notes}</p>
            </div>
          )}

              {(it.phone || it.email) && (
                <div className="flex items-center gap-4 mb-1 text-sm text-muted-foreground">
                  {it.phone && (
                    <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{it.phone}</span>
                  )}
                  {it.email && (
                    <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{it.email}</span>
                  )}
          </div>
              )}

        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-xl bg-accent hover:bg-accent/90 focus-visible:ring-accent shadow-sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver más
          </Button>
                {it.maps && (
                  <a href={it.maps} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:bg-accent/10 hover:text-accent focus-visible:ring-accent bg-background/80 shadow-sm">Cómo llegar</Button>
                  </a>
                )}
        </div>
      </CardContent>
    </Card>
        ))}
        </div>
      </div>
  )
}
