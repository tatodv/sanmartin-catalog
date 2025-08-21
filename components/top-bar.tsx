"use client"

import { useState } from "react"
import { Search, MapPin, Loader2, Filter, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "./theme-provider"

interface TopBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onMobileMenuToggle?: () => void
}

export function TopBar({ searchQuery = "", onSearchChange, onMobileMenuToggle }: TopBarProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [radius, setRadius] = useState("5")
  const { theme, toggleTheme } = useTheme()

  const handleLocationRequest = async () => {
    setIsLocating(true)
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Ubicación obtenida:", position.coords)
            setIsLocating(false)
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
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onMobileMenuToggle}
          className="h-10 w-10 p-0 rounded-xl border-border/50 hover:bg-muted/50 focus-visible:ring-accent lg:hidden bg-background/80 shadow-sm"
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">Mostrar filtros</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-secondary shadow-lg" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground">Red de Formación SM</h1>
            <p className="text-xs text-muted-foreground">Encuentra tu futuro</p>
          </div>
          <div className="block sm:hidden">
            <h1 className="text-base font-bold text-foreground">Red SM</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-2 lg:gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 lg:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por institución, programa, título..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
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

          <Select value={radius} onValueChange={setRadius}>
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
            onClick={toggleTheme}
            className="h-10 lg:h-12 w-10 lg:w-12 p-0 rounded-xl border-border/50 hover:bg-accent/10 hover:border-accent/30 focus-visible:ring-accent transition-all bg-background/80 shadow-sm"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
