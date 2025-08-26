"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterGroup } from "@/components/filter-group"
import { cn } from "@/lib/utils"
import catalog from "@/app/(data)/catalog.json"
import type { Item } from "@/lib/types"
import { deriveFacets } from "@/lib/filters"

interface SidebarProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ onFiltersChange, isMobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const dataset = catalog as unknown as Item[]

  const filterGroups = useMemo(() => {
    const facets = deriveFacets(dataset)

    const countBy = (getter: (item: Item) => string | null | undefined) =>
      dataset.reduce<Record<string, number>>((acc, item) => {
        const val = getter(item)
        if (!val) return acc
        acc[val] = (acc[val] ?? 0) + 1
        return acc
      }, {})

    const counts = {
      level: countBy((d) => d.level_norm ?? d.level_or_modality),
      barrio: countBy((d) => d.barrio),
      unit: countBy((d) => d.unit),
      title: countBy((d) => d.title),
    }

    return [
      {
        id: "nivel",
        title: "Nivel",
        options: facets.levels.map((level) => ({
          id: level,
          label: level,
          count: counts.level[level] || 0,
        })),
      },
      {
        id: "barrio",
        title: "Barrio",
        options: facets.barrios.map((barrio) => ({
          id: barrio,
          label: barrio,
          count: counts.barrio[barrio] || 0,
        })),
      },
      {
        id: "unidad-academica",
        title: "Unidad académica",
        options: facets.units.map((unit) => ({
          id: unit,
          label: unit,
          count: counts.unit[unit] || 0,
        })),
      },
      {
        id: "titulo",
        title: "Título",
        options: facets.titles.map((title) => ({
          id: title,
          label: title,
          count: counts.title[title] || 0,
        })),
      },
    ]
  }, [dataset])

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const groupFilters = prev[groupId] || []
      const newFilters = checked
        ? { ...prev, [groupId]: [...groupFilters, optionId] }
        : { ...prev, [groupId]: groupFilters.filter((id) => id !== optionId) }

      // No propagar al padre durante el render del hijo para evitar
      // "Cannot update a component while rendering a different component".
      // La propagación ocurre explícitamente con los botones "Aplicar"/"Limpiar".
      return newFilters
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
    onFiltersChange?.({})
  }

  const applyFilters = () => {
    console.log("Aplicando filtros:", selectedFilters)
    onFiltersChange?.(selectedFilters)
  }

  const hasActiveFilters = Object.values(selectedFilters).some((filters) => filters.length > 0)

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          "relative border-r border-border bg-card/20 backdrop-blur-sm transition-all duration-300",
          "hidden lg:block",
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
            <h2 className="text-lg font-bold text-foreground">Filtros</h2>
            <p className="text-sm text-muted-foreground">Refina tu búsqueda</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 overscroll-contain">
            <div className="space-y-6">
              {filterGroups.map((group) => (
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
                onClick={applyFilters}
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
