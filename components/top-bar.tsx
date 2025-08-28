"use client"

import { useEffect, useState } from "react"
import { Search, MapPin, Loader2, Menu, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "./theme-provider"

interface TopBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onMobileMenuToggle?: () => void
  // Integración Cerca de mí (opcional):
  // nearbyOn ⇔ botón "Cerca de mí"; radiusKm ⇔ Select de km
  onNearbyRequest?: () => void
  onRadiusChange?: (km: number) => void
}

export function TopBar({ searchQuery = "", onSearchChange, onMobileMenuToggle, onNearbyRequest, onRadiusChange }: TopBarProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [radius, setRadius] = useState("5")
  const { theme, toggleTheme } = useTheme()

  // debounce 300ms
  const [raw, setRaw] = useState(searchQuery)
  useEffect(() => setRaw(searchQuery), [searchQuery])
  useEffect(() => {
    const id = setTimeout(() => { if (raw !== searchQuery) onSearchChange?.(raw) }, 300)
    return () => clearTimeout(id)
  }, [raw])

  const handleLocationRequest = async () => {
    setIsLocating(true)
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Ubicación obtenida:", position.coords)
            setIsLocating(false)
            // Notificar al contenedor que se solicitó ubicación
            onNearbyRequest?.()
          },
          (error) => {
            console.error("Error obteniendo ubicación:", error)
            setIsLocating(false)
          },
        )
      }
    } catch (error) {
      console.error("Error:", error)
      setIsLocating(false)
    }
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="px-4 lg:px-6 flex flex-col gap-2">
        <div className="flex h-16 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMobileMenuToggle}
            className="h-10 w-10 p-0 rounded-xl border-border/50 hover:bg-muted/50 focus-visible:ring-accent lg:hidden bg-background/80 shadow-sm"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Mostrar filtros</span>
          </Button>

          <div className="h-12 sm:h-12 lg:h-12 flex-1 min-w-0 sm:flex-none">
            {theme === 'dark' ? (
              <img
                src="/logos/micro_logo-oscuro.svg"
                alt="Red de Formación San Martín"
                className="h-full w-full sm:w-auto object-contain"
                width={240}
                height={48}
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <img
                src="/logos/micro_logo_claro.svg"
                alt="Red de Formación San Martín"
                className="h-full w-full sm:w-auto object-contain"
                width={240}
                height={48}
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
            )}
          </div>

          <div className="flex flex-1 items-center gap-2 lg:gap-3 hidden sm:flex min-w-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 lg:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por institución, programa, título..."
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                className="pl-10 lg:pl-12 h-10 lg:h-12 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm focus-visible:ring-accent focus-visible:ring-2 focus-visible:border-accent/50 transition-all shadow-sm text-sm lg:text-base"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationRequest}
              disabled={isLocating}
              className="h-10 lg:h-12 px-3 lg:px-4 rounded-xl border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30 focus-visible:ring-accent transition-all bg-background/80 shadow-sm hidden sm:flex"
            >
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              <span className="ml-2 hidden lg:inline font-medium">Cerca de mí</span>
            </Button>

            <Select value={radius} onValueChange={(v)=>{ setRadius(v); const n = Number(v); if (!Number.isNaN(n)) onRadiusChange?.(n); }}>
              <SelectTrigger className="w-20 lg:w-28 h-10 lg:h-12 rounded-xl border-border/50 focus:ring-accent focus:ring-2 focus:border-accent/50 transition-all bg-background/80 shadow-sm hidden sm:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="1">1 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.google.com/maps/d/edit?mid=1C0JAq7PfHwDLr-nwMGHfGPMZa1O6OhM&ll=-34.56723554242295%2C-58.55794084739809&z=13', '_blank')}
              className="h-10 lg:h-12 w-10 lg:w-12 p-0 rounded-xl border-border/50 hover:bg-accent/10 hover:border-accent/30 focus-visible:ring-accent transition-all bg-background/80 shadow-sm"
              title="Ver mapa de formación"
            >
              <Globe className="h-4 w-4" />
              <span className="sr-only">Ver mapa de formación</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-10 lg:h-12 w-10 lg:w-12 p-0 rounded-xl border-border/50 hover:bg-accent/10 hover:border-accent/30 focus-visible:ring-accent transition-all bg-background/80 shadow-sm"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </div>
        </div>

        <div className="sm:hidden pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por institución, programa, título..."
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="pl-10 h-10 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm focus-visible:ring-accent focus-visible:ring-2 focus-visible:border-accent/50 transition-all shadow-sm text-sm"
            />
          </div>
          <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationRequest}
              disabled={isLocating}
              className="h-10 px-3 w-full justify-center rounded-xl border-border/50 hover:bg-accent/10 hover:text-accent hover:border-accent/30 focus-visible:ring-accent transition-all bg-background/80 shadow-sm"
            >
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              <span className="ml-2 font-medium">Cerca de mí</span>
            </Button>

            <Select value={radius} onValueChange={(v)=>{ setRadius(v); const n = Number(v); if (!Number.isNaN(n)) onRadiusChange?.(n); }}>
              <SelectTrigger className="w-28 h-10 rounded-xl border-border/50 focus:ring-accent focus:ring-2 focus:border-accent/50 transition-all bg-background/80 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50">
                <SelectItem value="1">1 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  )
}
