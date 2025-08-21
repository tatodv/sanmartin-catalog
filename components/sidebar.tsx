"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterGroup } from "@/components/filter-group"
import { cn } from "@/lib/utils"

const filterGroups = [
  {
    id: "nivel",
    title: "Nivel",
    options: [
      { id: "curso", label: "Curso", count: 45 },
      { id: "secundaria", label: "Secundaria", count: 32 },
      { id: "superior", label: "Superior", count: 298 },
      { id: "tecnica", label: "Técnica", count: 56 },
    ],
  },
  {
    id: "barrio",
    title: "Barrio",
    options: [{ id: "a-validar-unsam", label: "A validar (UNSAM)", count: 431 }],
  },
  {
    id: "unidad-academica",
    title: "Unidad académica",
    options: [
      { id: "idaes", label: "Escuela Interdisciplinaria de Altos Estudios Sociales - IDAES", count: 45 },
      { id: "arte-patrimonio", label: "Escuela de Arte y Patrimonio", count: 28 },
      { id: "bio-nanotecnologias", label: "Escuela de Bio y Nanotecnologías", count: 35 },
      { id: "ciencia-tecnologia", label: "Escuela de Ciencia y Tecnología", count: 52 },
      { id: "economia-negocios", label: "Escuela de Economía y Negocios", count: 38 },
      { id: "humanidades", label: "Escuela de Humanidades", count: 41 },
      { id: "habitat-sostenibilidad", label: "Escuela de Hábitat y Sostenibilidad", count: 29 },
      { id: "politica-gobierno", label: "Escuela de Política y Gobierno", count: 33 },
      { id: "dan-beninson", label: "Instituto Dan Beninson", count: 18 },
      { id: "rehabilitacion-movimiento", label: "Instituto de Rehabilitación y Movimiento", count: 22 },
      { id: "sabato", label: "Instituto de Tecnología Prof. Jorge Sabato", count: 47 },
      { id: "oespu", label: "Observatorio de Educación Superior y Políticas Universitarias (OESPU)", count: 43 },
    ],
  },
  {
    id: "titulo",
    title: "Título",
    options: [
      { id: "arquitectura", label: "Arquitectura", count: 12 },
      { id: "contador", label: "Contador", count: 8 },
      { id: "doctorado", label: "Doctorado", count: 67 },
      { id: "especializacion", label: "Especialización", count: 89 },
      { id: "ingenieria", label: "Ingeniería", count: 45 },
      { id: "licenciatura", label: "Licenciatura", count: 134 },
      { id: "licenciatura-tecnicatura", label: "Licenciatura, Tecnicatura", count: 23 },
      { id: "maestria", label: "Maestría", count: 78 },
      { id: "martillero", label: "Martillero", count: 3 },
      { id: "profesorado", label: "Profesorado", count: 56 },
      { id: "tecnicatura", label: "Tecnicatura", count: 67 },
    ],
  },
]

interface SidebarProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ onFiltersChange, isMobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const groupFilters = prev[groupId] || []
      const newFilters = checked
        ? { ...prev, [groupId]: [...groupFilters, optionId] }
        : { ...prev, [groupId]: groupFilters.filter((id) => id !== optionId) }

      onFiltersChange?.(newFilters)
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
