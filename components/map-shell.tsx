"use client"

import { useState } from "react"
import { Navigation, Layers, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MapShell() {
  const [clusteringEnabled, setClusteringEnabled] = useState(true)
  const resultCount = 42

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-card/30 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
            {resultCount} resultados
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClusteringEnabled(!clusteringEnabled)}
            className="rounded-xl hover:bg-accent/10 focus-visible:ring-primary"
          >
            {clusteringEnabled ? (
              <ToggleRight className="h-4 w-4 text-primary" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="ml-2 text-sm">Clustering {clusteringEnabled ? "on" : "off"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/50 hover:bg-accent/10 focus-visible:ring-primary bg-transparent"
          >
            <Navigation className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Cómo llegar</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <div
          id="map"
          className="h-full w-full bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center"
        >
          <div className="text-center space-y-2">
            <Layers className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">El mapa se cargará aquí</p>
            <p className="text-sm text-muted-foreground/70">Integra tu biblioteca de mapas preferida</p>
          </div>
        </div>
      </div>
    </main>
  )
}
