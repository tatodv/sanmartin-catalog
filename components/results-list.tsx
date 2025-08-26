"use client"

import { useMemo } from "react"
import { MapPin, ExternalLink, Clock, Users, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultItem {
  id: string
  heading: string          // program_name
  badgeRight: string       // title (tipo)
  chips?: string[]         // [provider_name, unit]
  barrio?: string
  address?: string
  notes?: string
  level?: string
  family?: string
  unit?: string
  provider?: string
  phone?: string
  email?: string
  modality?: string
  maps?: string
  raw?: any
}

interface ResultsListProps {
  items: ResultItem[]
  total?: number
}

const titleColor = (titulo: string) => {
  const key = (titulo || "").toLowerCase()
  const colors: Record<string, string> = {
    licenciatura: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ingenieria: "bg-green-500/20 text-green-400 border-green-500/30",
    maestria: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    doctorado: "bg-red-500/20 text-red-400 border-red-500/30",
    especializacion: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    tecnicatura: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    profesorado: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    curso: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  }
  return colors[key] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

export function ResultsList({ items, total }: ResultsListProps) {
  if (process.env.NODE_ENV !== "production") {
    // depuración: garantizar que renderizamos lo que llega por props
    console.log("[ResultsList] items:", items.length, items.slice(0, 3).map(i => i.heading))
  }

  const view = useMemo(() => {
    return items.map((it) => ({
      id: it.id,
      name: it.heading,
      titulo: it.badgeRight || "",
      provider: it.provider || it.chips?.[0] || "",
      unit: it.unit || it.chips?.[1] || "",
      addressLine: [it.barrio || "Barrio no especificado", it.address || ""].filter(Boolean).join(" • "),
      description: it.notes || "",
      phone: it.phone,
      email: it.email,
      modality: it.modality,
      maps: it.maps,
      raw: it.raw,
    }))
  }, [items])

  if (!view.length) {
    return (
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-foreground">Mostrando 0 de {total ?? 0} ofertas</h2>
              <Badge variant="secondary" className="rounded-full">UNSAM</Badge>
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground">Intenta ajustar los filtros o la búsqueda.</p>
          </div>
        </div>
      </main>
    )
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[ResultsList] view:", view.length, view.slice(0,3).map(v => v.name))
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">Mostrando {view.length} de {total ?? view.length} ofertas</h2>
            <Badge variant="secondary" className="rounded-full">UNSAM</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-6 max-w-4xl">
          {view.map((result) => (
            <Card key={result.id} className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-accent/30 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {result.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{result.addressLine}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {result.titulo ? (
                      <Badge className={titleColor(result.titulo)}>
                        {result.titulo.charAt(0).toUpperCase() + result.titulo.slice(1)}
                      </Badge>
                    ) : null}
                    {result.modality ? (
                      <Badge variant="outline" className="text-xs">
                        {result.modality}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {result.description ? (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{result.description}</p>
                ) : null}

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  {result.provider && (
                    <div className="flex items-center gap-1">
                      <span>{result.provider}</span>
                    </div>
                  )}
                  {result.unit && (
                    <div className="flex items-center gap-1">
                      <span>{result.unit}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  {result.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{result.phone}</span>
                    </div>
                  )}
                  {result.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{result.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="rounded-xl bg-accent hover:bg-accent/90 focus-visible:ring-accent shadow-sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver más
                  </Button>
                  {result.maps && (
                    <a href={result.maps} target="_blank" rel="noreferrer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-border/50 hover:bg-accent/10 hover:text-accent focus-visible:ring-accent bg-background/80 shadow-sm"
                      >
                        Cómo llegar
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
