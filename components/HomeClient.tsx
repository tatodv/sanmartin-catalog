"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Program } from "@/types/program"
import { debounce } from "@/lib/debounce"
import { TopBar } from "@/components/top-bar"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useNearby } from "@/app/(catalog)/useNearby"
import type { LatLng } from "@/lib/geo"
import { FiltersSidebar as Sidebar } from "@/components/FiltersSidebar"
import ProgramCard from "@/components/ProgramCard"
import { AcademicProgramCard } from "@/components/academic-program-card"
import type { AcademicProgram } from "@/components/academic-programs-grid"

function uniqSorted(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.map(v => (v || "").trim()).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
}

function buildIndex(items: Program[]) {
  return items.map(p => ({
    raw: p,
    t: (p.title || "").toLowerCase(),
    u: (p.unit || "").toLowerCase(),
    i: (p.institution || "").toLowerCase(),
    a: (p.address || "").toLowerCase(),
    g: (p.degree_title || "").toLowerCase(),
  }))
}

function getFacets(items: Program[]) {
  return {
    tipo: uniqSorted(items.map(x => x.degree_title)),
    carrera: uniqSorted(items.map(x => x.title)),
    institucion: uniqSorted(items.map(x => x.institution)),
    unidad: uniqSorted(items.map(x => x.unit)),
  }
}

function getFacetCounts(items: Program[], filters: any) {
  const countBy = (rows: Program[], key: keyof Program) =>
    rows.reduce<Record<string, number>>((acc, it) => {
      const v = (it[key] as any) || "";
      if (!v) return acc
      acc[v] = (acc[v] || 0) + 1
      return acc
    }, {})

  const base = applyFilters(items, { q: filters.q })
  return {
    tipo: countBy(base, "degree_title"),
    carrera: countBy(base, "title"),
    institucion: countBy(base, "institution"),
    unidad: countBy(base, "unit"),
  }
}

function applyFilters(items: Program[], filters: any) {
  let list = items
  if (filters.q) {
    const q = filters.q.toLowerCase()
    list = list.filter(p =>
      (p.title||"").toLowerCase().includes(q) ||
      (p.unit||"").toLowerCase().includes(q) ||
      (p.institution||"").toLowerCase().includes(q) ||
      (p.address||"").toLowerCase().includes(q)
    )
  }
  if (filters.tipo) list = list.filter(p => p.degree_title === filters.tipo)
  if (filters.carrera) list = list.filter(p => p.title === filters.carrera)
  if (filters.institucion) list = list.filter(p => p.institution === filters.institucion)
  if (filters.unidad) list = list.filter(p => p.unit === filters.unidad)
  return list
}

function decodeFilters(sp: URLSearchParams) {
  return {
    q: sp.get("q") || "",
    tipo: sp.get("tipo") || "",
    carrera: sp.get("carrera") || "",
    institucion: sp.get("institucion") || "",
    unidad: sp.get("unidad") || "",
  }
}

function encodeFilters(f: any) {
  const params = new URLSearchParams()
  Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v as string) })
  return params.toString()
}

export default function HomeClient({ items }: { items: Program[] }) {
  const router = useRouter()
  const sp = useSearchParams()

  const [filters, setFilters] = React.useState(() => decodeFilters(sp as unknown as URLSearchParams))
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)
  const [nearbyOn, setNearbyOn] = React.useState<boolean>(false) // mapeo local del switch existente
  const [radiusKm, setRadiusKm] = React.useState<number>(5)
  const index = React.useMemo(() => buildIndex(items), [items])

  const pushUrl = React.useMemo(() => debounce((f: any) => {
    const qs = encodeFilters(f)
    router.replace(qs ? `/?${qs}` : "/", { scroll: false })
  }, 200), [router])

  React.useEffect(() => { pushUrl(filters) }, [filters, pushUrl])

  const facets = React.useMemo(() => getFacets(items), [items])
  const counts = React.useMemo(() => getFacetCounts(items, filters), [items, filters])
  const results = React.useMemo(() => {
    let base = items
    if (filters.q) {
      const q = filters.q.toLowerCase()
      const matched = new Set(index.filter(e => e.t.includes(q) || e.u.includes(q) || e.i.includes(q) || e.a.includes(q)).map(e => e.raw.id))
      base = items.filter(p => matched.has(p.id))
    }
    return applyFilters(base, { ...filters, q: "" })
  }, [items, index, filters])

  // Geolocalización (se solicita sólo cuando nearbyOn se enciende)
  const { status, coords, request } = useGeolocation()
  React.useEffect(() => {
    if (nearbyOn && !coords && status !== "loading") request()
  }, [nearbyOn, coords, status, request])

  // Normalizar coords de items si existieran como lat/lon en datos (no romper si no están)
  const baseWithCoords = React.useMemo(() => {
    const parseFromLinks = (links?: { label?: string; url?: string }[]): LatLng | undefined => {
      if (!Array.isArray(links)) return undefined
      const link = links.find(l => typeof l?.url === "string" && /maps\.google\./i.test(l.url))
      if (!link?.url) return undefined
      try {
        const u = new URL(link.url)
        // Buscar parámetros q o ll con "lat,lng"
        const q = u.searchParams.get("q") || u.searchParams.get("ll") || ""
        const m = q.match(/(-?[0-9]+\.?[0-9]*),\s*(-?[0-9]+\.?[0-9]*)/)
        if (m) {
          const lat = Number(m[1]); const lng = Number(m[2])
          if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
        }
      } catch {}
      return undefined
    }

    return results.map((p) => {
      const anyP = p as any
      const lat = typeof anyP.lat === "number" ? anyP.lat : undefined
      const lng = typeof anyP.lng === "number" ? anyP.lng : (typeof anyP.lon === "number" ? anyP.lon : undefined)
      let coords: LatLng | undefined = (typeof lat === "number" && typeof lng === "number") ? { lat, lng } : undefined
      if (!coords) coords = parseFromLinks(anyP.links)
      return { ...p, coords }
    })
  }, [results])

  const userCoords = nearbyOn && coords ? coords : null
  const { list } = useNearby(baseWithCoords as any[], userCoords, nearbyOn ? radiusKm : null)

  const setFilter = (k: string, v?: string) => setFilters(prev => ({ ...prev, [k]: v || "" }))
  const clearAll = () => setFilters({ q: "", tipo: "", carrera: "", institucion: "", unidad: "" })

  const sidebarProps = {
    levels: facets.tipo,        levelCounts: counts.tipo,        onLevelChange: (v:string)=>setFilter("tipo", v),
    families: facets.carrera,   familyCounts: counts.carrera,    onFamilyChange: (v:string)=>setFilter("carrera", v),
    barrios: facets.institucion,barrioCounts: counts.institucion,onBarrioChange: (v:string)=>setFilter("institucion", v),
    providers: facets.unidad,   providerCounts: counts.unidad,   onProviderChange: (v:string)=>setFilter("unidad", v),
    onClear: clearAll,
    isMobileOpen: isMobileSidebarOpen,
    onMobileClose: () => setIsMobileSidebarOpen(false),
  }

  const toAcademic = (p: Program): AcademicProgram => ({
    id: p.id,
    title: p.title,
    type: (p.degree_title as any) as AcademicProgram["type"],
    academicUnit: p.unit || "",
    location: { institution: p.institution || "", address: p.address || "" },
    website: p.links?.find(l => (l.label||"").toLowerCase().includes("web"))?.url,
    email: p.links?.find(l => (l.label||"").toLowerCase().includes("contacto"))?.url?.replace(/^mailto:/, ""),
  })

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        searchQuery={filters.q || ""}
        onSearchChange={(v: string) => setFilter("q", v)}
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onNearbyRequest={() => setNearbyOn(true)}
        onRadiusChange={(km)=> setRadiusKm(km)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar {...sidebarProps} />
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {(list as Program[]).map((p) => (
              <AcademicProgramCard key={p.id} program={toAcademic(p)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
