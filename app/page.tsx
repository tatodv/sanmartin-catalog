"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { ResultsList } from "@/components/results-list"
import GroupedHome from "@/components/GroupedHome"
import catalog from "./(data)/catalog.json"
import type { Item } from "@/lib/types"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const dataset = (catalog as unknown) as Item[]
  
  // Estado inicial sin filtros de distancia activos
  const [geoFilters, setGeoFilters] = useState({
    withGeo: false,
    near: null,
    radiusKm: undefined
  })
  
  const isPristine =
    searchQuery.trim() === "" &&
    Object.values(activeFilters).every((arr) => (arr?.length ?? 0) === 0) &&
    !geoFilters.withGeo &&
    !geoFilters.near

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onFiltersChange={setActiveFilters}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        {isPristine ? (
          <div className="flex-1 overflow-y-auto p-4">
            <GroupedHome data={dataset} />
          </div>
        ) : (
          <ResultsList searchQuery={searchQuery} activeFilters={activeFilters} />
        )}
      </div>
    </div>
  )
}

