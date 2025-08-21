"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { ResultsList } from "@/components/results-list"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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
        <ResultsList searchQuery={searchQuery} activeFilters={activeFilters} />
      </div>
    </div>
  )
}
