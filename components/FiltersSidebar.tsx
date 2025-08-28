"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterGroup } from "@/components/filter-group"
import { cn } from "@/lib/utils"
import MobileFiltersDrawer from "@/components/ui/mobile-filters-drawer"
import FacetSection from "@/components/ui/facet-section"

interface SidebarProps {
  // Tipo (degree_title)
  levels: string[];    levelCounts: Record<string, number>;    onLevelChange: (v: string)=>void
  // Carrera (title)
  families: string[];  familyCounts: Record<string, number>;   onFamilyChange: (v: string)=>void
  // Institución (institution)
  barrios: string[];   barrioCounts: Record<string, number>;   onBarrioChange: (v: string)=>void
  // Unidad Académica / Área (unit)
  providers: string[]; providerCounts: Record<string, number>; onProviderChange: (v: string)=>void

  onClear?: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function FiltersSidebar({
  levels, levelCounts, onLevelChange,
  families, familyCounts, onFamilyChange,
  barrios, barrioCounts, onBarrioChange,
  providers, providerCounts, onProviderChange,
  onClear,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const open = !!isMobileOpen
  const closeDrawer = () => onMobileClose?.()

  const groups = [
    { id: "nivel", title: "Tipo", options: levels.map(l => ({ id: l, label: l, count: levelCounts[l] || 0 })).filter(o => o.count > 0), count: Object.values(levelCounts).reduce((a,b)=>a+b,0) },
    { id: "familia", title: "Carrera", options: families.map(v => ({ id: v, label: v, count: familyCounts[v] || 0 })).filter(o => o.count > 0), count: Object.values(familyCounts).reduce((a,b)=>a+b,0) },
    { id: "institucion", title: "Institución", options: barrios.map(v => ({ id: v, label: v, count: barrioCounts[v] || 0 })).filter(o => o.count > 0), count: Object.values(barrioCounts).reduce((a,b)=>a+b,0) },
    { id: "unidad-academica", title: "Unidad Académica / Área", options: providers.map(v => ({ id: v, label: v, count: providerCounts[v] || 0 })).filter(o => o.count > 0), count: Object.values(providerCounts).reduce((a,b)=>a+b,0) },
  ]

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    const newVal = checked ? [optionId] : []
    setSelectedFilters(prev => ({ ...prev, [groupId]: newVal }))

    switch (groupId) {
      case "nivel": onLevelChange(checked ? optionId : ""); break
      case "familia": onFamilyChange(checked ? optionId : ""); break
      case "institucion": onBarrioChange(checked ? optionId : ""); break
      case "unidad-academica": onProviderChange(checked ? optionId : ""); break
    }
  }

  const clearFilters = () => {
    setSelectedFilters({})
    onLevelChange(""); onFamilyChange(""); onBarrioChange(""); onProviderChange("")
    onClear?.()
  }

  return (
    <>
      {/* Drawer mobile */}
      <MobileFiltersDrawer open={open} onClose={closeDrawer} onApply={closeDrawer} onClear={clearFilters} title="Filtros">
        {groups.map((g) => (
          <FacetSection key={g.id} title={g.title} hideTitle count={g.count} defaultOpen={g.id === "nivel"}>
            <FilterGroup
              title={g.title}
              options={g.options}
              selectedOptions={selectedFilters[g.id] || []}
              onOptionChange={(optionId, checked) => handleFilterChange(g.id, optionId, checked)}
            />
          </FacetSection>
        ))}
      </MobileFiltersDrawer>

      {/* Sidebar desktop */}
      <aside
        className={cn(
          "relative border-r border-border bg-card/20 backdrop-blur-sm transition-all duration-300",
          "hidden lg:block",
          isCollapsed ? "w-12" : "w-80",
          "lg:relative lg:translate-x-0",
          "fixed inset-y-0 left-0 z-50 w-80 lg:z-auto",
          "-translate-x-full lg:translate-x-0",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-background p-0 shadow-lg hover:bg-accent/10 hover:border-accent/30 focus-visible:ring-primary transition-all hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          <span className="sr-only">{isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}</span>
        </Button>

        <div className={cn("flex h-full flex-col overflow-hidden")}> 
          <div className="p-6 pb-4 border-b border-border/50 pt-16 lg:pt-6">
            <h2 className="text-lg font-bold text-foreground">Filtros</h2>
            <p className="text-sm text-muted-foreground">Refina tu búsqueda</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 overscroll-contain">
            <div className="space-y-2">
              {groups.map((g) => (
                <FacetSection key={g.id} title={g.title} hideTitle count={g.count} defaultOpen={g.id === "nivel"}>
                  <FilterGroup
                    title={g.title}
                    options={g.options}
                    selectedOptions={selectedFilters[g.id] || []}
                    onOptionChange={(optionId, checked) => handleFilterChange(g.id, optionId, checked)}
                  />
                </FacetSection>
              ))}
            </div>
          </div>

          <div className="border-t border-border/50 p-6 pt-4 pb-8 lg:pb-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={!Object.values(selectedFilters).some(a=>a.length)}
                className="flex-1 h-12 lg:h-10 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 focus-visible:ring-primary transition-all disabled:opacity-50 bg-transparent text-base lg:text-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
              <Button
                size="sm"
                onClick={() => { /* filtros aplican en vivo */ }}
                disabled={!Object.values(selectedFilters).some(a=>a.length)}
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

export default FiltersSidebar 