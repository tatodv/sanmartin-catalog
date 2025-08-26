"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterGroup } from "@/components/filter-group"
import { cn } from "@/lib/utils"

interface SidebarProps {
  searchValue?: string
  onSearchChange?: (v: string) => void

  levels: string[];    levelCounts: Record<string, number>;    onLevelChange: (v: string)=>void
  families: string[];  familyCounts: Record<string, number>;   onFamilyChange: (v: string)=>void
  barrios: string[];   barrioCounts: Record<string, number>;   onBarrioChange: (v: string)=>void
  providers: string[]; providerCounts: Record<string, number>; onProviderChange: (v: string)=>void
  units: string[];     unitCounts: Record<string, number>;     onUnitChange: (v: string)=>void
  titles: string[];    titleCounts: Record<string, number>;    onTitleChange: (v: string)=>void

  onClear?: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({
  searchValue = "",
  onSearchChange,
  levels, levelCounts, onLevelChange,
  families, familyCounts, onFamilyChange,
  barrios, barrioCounts, onBarrioChange,
  providers, providerCounts, onProviderChange,
  units, unitCounts, onUnitChange,
  titles, titleCounts, onTitleChange,
  onClear,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    // Selección simple por grupo (si UI requiere multi, adaptar aquí)
    const newVal = checked ? [optionId] : []
    setSelectedFilters(prev => ({ ...prev, [groupId]: newVal }))

    switch (groupId) {
      case "nivel": onLevelChange(checked ? optionId : ""); break
      case "familia": onFamilyChange(checked ? optionId : ""); break
      case "barrio": onBarrioChange(checked ? optionId : ""); break
      case "unidad-academica": onUnitChange(checked ? optionId : ""); break
      case "titulo": onTitleChange(checked ? optionId : ""); break
      case "institucion": onProviderChange(checked ? optionId : ""); break
    }
  }

  const clearFilters = () => {
    setSelectedFilters({})
    onLevelChange(""); onFamilyChange(""); onBarrioChange(""); onUnitChange(""); onTitleChange(""); onProviderChange("")
    onClear?.()
  }

  const hasActiveFilters = Object.values(selectedFilters).some((filters) => filters.length > 0)

  const groups = [
    {
      id: "nivel",
      title: "Nivel",
      options: levels.map(l => ({ id: l, label: l, count: levelCounts[l] || 0 })).filter(o => o.count > 0)
    },
    {
      id: "familia",
      title: "Familia",
      options: families.map(v => ({ id: v, label: v, count: familyCounts[v] || 0 })).filter(o => o.count > 0)
    },
    {
      id: "barrio",
      title: "Barrio",
      options: barrios.map(v => ({ id: v, label: v, count: barrioCounts[v] || 0 })).filter(o => o.count > 0)
    },
    {
      id: "institucion",
      title: "Institución",
      options: providers.map(v => ({ id: v, label: v, count: providerCounts[v] || 0 })).filter(o => o.count > 0)
    },
    {
      id: "unidad-academica",
      title: "Unidad académica",
      options: units.map(v => ({ id: v, label: v, count: unitCounts[v] || 0 })).filter(o => o.count > 0)
    },
    {
      id: "titulo",
      title: "Título",
      options: titles.map(v => ({ id: v, label: v, count: titleCounts[v] || 0 })).filter(o => o.count > 0)
    },
  ]

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          "relative border-r border-border bg-card/20 backdrop-blur-sm transition-all duration-300",
          // visible como panel deslizante en móvil, fijo en desktop
          "block lg:block",
          isCollapsed ? "w-12" : "w-80",
          "lg:relative lg:translate-x-0",
          "fixed inset-y-0 left-0 z-50 w-80 lg:z-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileClose}
          className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full lg:hidden"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar filtros</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-background p-0 shadow-lg hover:bg-accent/10 hover:border-accent/30 focus-visible:ring-primary transition-all hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          <span className="sr-only">{isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}</span>
        </Button>

        <div
          className={cn(
            "flex h-full flex-col overflow-hidden transition-opacity duration-300",
            "lg:opacity-100",
            isCollapsed && "lg:opacity-0",
          )}
        >
          <div className="p-6 pb-4 border-b border-border/50 pt-16 lg:pt-6">
            <h2 className="text-xl font-black text-foreground tracking-tight">Filtros</h2>
            <p className="text-sm text-muted-foreground">Refina tu búsqueda</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 overscroll-contain">
            <div className="space-y-3">
              {groups.map((group) => (
                <FilterGroup
                  key={group.id}
                  title={group.title}
                  options={group.options}
                  selectedOptions={selectedFilters[group.id] || []}
                  onOptionChange={(optionId, checked) => handleFilterChange(group.id, optionId, checked)}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-border/50 p-6 pt-4 pb-8 lg:pb-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex-1 h-12 lg:h-10 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 focus-visible:ring-primary transition-all disabled:opacity-50 bg-transparent text-base lg:text-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button
                size="sm"
                onClick={() => {/* en esta versión los filtros aplican en vivo */}}
                disabled={!hasActiveFilters}
                className="flex-1 h-12 lg:h-10 rounded-xl bg-primary hover:bg-primary/90 focus-visible:ring-primary shadow-lg transition-all disabled:opacity-50 text-base lg:text-sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
