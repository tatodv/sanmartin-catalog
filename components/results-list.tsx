"use client"

import { useState, useMemo } from "react"
import { MapPin, ExternalLink, Clock, Users, Phone, Mail, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const generateMockResults = () => {
  const programs = [
    { name: "Bachillerato en Ciencias Sociales", unidad: "humanidades", nivel: "secundario", titulo: "curso" },
    { name: "Bachillerato en Ciencias Naturales", unidad: "ciencia-tecnologia", nivel: "secundario", titulo: "curso" },
    {
      name: "Bachillerato en Economía y Administración",
      unidad: "economia-negocios",
      nivel: "secundario",
      titulo: "curso",
    },
    { name: "Bachillerato en Arte y Comunicación", unidad: "arte-patrimonio", nivel: "secundario", titulo: "curso" },
    { name: "Bachillerato en Informática", unidad: "ciencia-tecnologia", nivel: "secundario", titulo: "curso" },
    { name: "Bachillerato en Biotecnología", unidad: "bio-nanotecnologias", nivel: "secundario", titulo: "curso" },
    {
      name: "Bachillerato en Gestión Ambiental",
      unidad: "habitat-sostenibilidad",
      nivel: "secundario",
      titulo: "curso",
    },
    { name: "Bachillerato en Políticas Públicas", unidad: "politica-gobierno", nivel: "secundario", titulo: "curso" },
    { name: "Bachillerato en Tecnología Nuclear", unidad: "dan-beninson", nivel: "secundario", titulo: "curso" },
    {
      name: "Bachillerato en Rehabilitación",
      unidad: "rehabilitacion-movimiento",
      nivel: "secundario",
      titulo: "curso",
    },

    // Licenciaturas
    { name: "Licenciatura en Sociología", unidad: "IDAES", nivel: "superior", titulo: "licenciatura" },
    {
      name: "Licenciatura en Antropología Social y Cultural",
      unidad: "IDAES",
      nivel: "superior",
      titulo: "licenciatura",
    },
    { name: "Licenciatura en Historia", unidad: "humanidades", nivel: "superior", titulo: "licenciatura" },
    { name: "Licenciatura en Filosofía", unidad: "humanidades", nivel: "superior", titulo: "licenciatura" },
    { name: "Licenciatura en Economía", unidad: "economia-negocios", nivel: "superior", titulo: "licenciatura" },
    { name: "Licenciatura en Administración", unidad: "economia-negocios", nivel: "superior", titulo: "licenciatura" },
    {
      name: "Licenciatura en Ciencias Ambientales",
      unidad: "ciencia-tecnologia",
      nivel: "superior",
      titulo: "licenciatura",
    },
    { name: "Licenciatura en Biotecnología", unidad: "bio-nanotecnologias", nivel: "superior", titulo: "licenciatura" },
    {
      name: "Licenciatura en Política y Administración Pública",
      unidad: "politica-gobierno",
      nivel: "superior",
      titulo: "licenciatura",
    },
    {
      name: "Licenciatura en Artes Electrónicas",
      unidad: "arte-patrimonio",
      nivel: "superior",
      titulo: "licenciatura",
    },

    // Ingenierías
    { name: "Ingeniería Industrial", unidad: "sabato", nivel: "superior", titulo: "ingenieria" },
    { name: "Ingeniería en Materiales", unidad: "sabato", nivel: "superior", titulo: "ingenieria" },
    { name: "Ingeniería Nuclear", unidad: "dan-beninson", nivel: "superior", titulo: "ingenieria" },
    { name: "Ingeniería Ambiental", unidad: "habitat-sostenibilidad", nivel: "superior", titulo: "ingenieria" },

    // Maestrías
    { name: "Maestría en Antropología Social", unidad: "IDAES", nivel: "superior", titulo: "maestria" },
    { name: "Maestría en Sociología Económica", unidad: "IDAES", nivel: "superior", titulo: "maestria" },
    { name: "Maestría en Economía", unidad: "economia-negocios", nivel: "superior", titulo: "maestria" },
    {
      name: "Maestría en Ciencia, Tecnología y Sociedad",
      unidad: "ciencia-tecnologia",
      nivel: "superior",
      titulo: "maestria",
    },
    { name: "Maestría en Políticas Públicas", unidad: "politica-gobierno", nivel: "superior", titulo: "maestria" },

    // Doctorados
    { name: "Doctorado en Antropología Social", unidad: "IDAES", nivel: "superior", titulo: "doctorado" },
    { name: "Doctorado en Sociología", unidad: "IDAES", nivel: "superior", titulo: "doctorado" },
    { name: "Doctorado en Historia", unidad: "humanidades", nivel: "superior", titulo: "doctorado" },
    { name: "Doctorado en Filosofía", unidad: "humanidades", nivel: "superior", titulo: "doctorado" },
    { name: "Doctorado en Ciencia y Tecnología", unidad: "ciencia-tecnologia", nivel: "superior", titulo: "doctorado" },

    // Especializaciones
    {
      name: "Especialización en Gestión de la Ciencia y la Tecnología",
      unidad: "ciencia-tecnologia",
      nivel: "superior",
      titulo: "especializacion",
    },
    {
      name: "Especialización en Políticas Sociales",
      unidad: "politica-gobierno",
      nivel: "superior",
      titulo: "especializacion",
    },
    {
      name: "Especialización en Economía Social",
      unidad: "economia-negocios",
      nivel: "superior",
      titulo: "especializacion",
    },

    // Tecnicaturas
    { name: "Tecnicatura en Programación", unidad: "ciencia-tecnologia", nivel: "tecnica", titulo: "tecnicatura" },
    { name: "Tecnicatura en Biotecnología", unidad: "bio-nanotecnologias", nivel: "tecnica", titulo: "tecnicatura" },
    {
      name: "Tecnicatura en Gestión Ambiental",
      unidad: "habitat-sostenibilidad",
      nivel: "tecnica",
      titulo: "tecnicatura",
    },

    // Profesorados
    { name: "Profesorado en Historia", unidad: "humanidades", nivel: "superior", titulo: "profesorado" },
    { name: "Profesorado en Filosofía", unidad: "humanidades", nivel: "superior", titulo: "profesorado" },
    { name: "Profesorado en Ciencias Sociales", unidad: "IDAES", nivel: "superior", titulo: "profesorado" },
  ]

  const results = []
  let id = 1

  // Primero agregamos los programas de secundario (10 únicos)
  const secundarioPrograms = programs.filter((p) => p.nivel === "secundario")
  secundarioPrograms.forEach((program) => {
    results.push({
      id: id++,
      name: program.name,
      address: `Campus UNSAM, San Martín, Buenos Aires`,
      unidadAcademica: program.unidad,
      nivel: program.nivel,
      titulo: program.titulo,
      description: `Programa académico de excelencia en ${program.name.toLowerCase()}`,
      phone: "+54 11 4006-1500",
      email: "info@unsam.edu.ar",
      distance: `${(Math.random() * 10 + 1).toFixed(1)} km`,
      rating: Math.random() > 0.1 ? (4 + Math.random()).toFixed(1) : null,
      students: Math.random() > 0.2 ? Math.floor(Math.random() * 500 + 50) : null,
      hasLocation: Math.random() > 0.1,
      modalidad: Math.random() > 0.5 ? "Presencial" : "Virtual",
      duracion:
        program.nivel === "secundario"
          ? "3 años"
          : program.titulo === "doctorado"
            ? "4-6 años"
            : program.titulo === "maestria"
              ? "2 años"
              : program.titulo === "licenciatura"
                ? "4-5 años"
                : program.titulo === "tecnicatura"
                  ? "2-3 años"
                  : "Variable",
    })
  })

  // Luego completamos con el resto de programas hasta llegar a 431
  const otherPrograms = programs.filter((p) => p.nivel !== "secundario")
  for (let i = 0; results.length < 431; i++) {
    const program = otherPrograms[i % otherPrograms.length]
    results.push({
      id: id++,
      name: program.name,
      address: `Campus UNSAM, San Martín, Buenos Aires`,
      unidadAcademica: program.unidad,
      nivel: program.nivel,
      titulo: program.titulo,
      description: `Programa académico de excelencia en ${program.name.toLowerCase()}`,
      phone: "+54 11 4006-1500",
      email: "info@unsam.edu.ar",
      distance: `${(Math.random() * 10 + 1).toFixed(1)} km`,
      rating: Math.random() > 0.1 ? (4 + Math.random()).toFixed(1) : null,
      students: Math.random() > 0.2 ? Math.floor(Math.random() * 500 + 50) : null,
      hasLocation: Math.random() > 0.1,
      modalidad: Math.random() > 0.5 ? "Presencial" : "Virtual",
      duracion:
        program.titulo === "doctorado"
          ? "4-6 años"
          : program.titulo === "maestria"
            ? "2 años"
            : program.titulo === "licenciatura"
              ? "4-5 años"
              : program.titulo === "tecnicatura"
                ? "2-3 años"
                : "Variable",
    })
  }

  return results.slice(0, 431)
}

const mockResults = generateMockResults()

interface ResultsListProps {
  searchQuery?: string
  activeFilters?: Record<string, string[]>
}

export function ResultsList({ searchQuery = "", activeFilters = {} }: ResultsListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const { filteredResults, groupedResults } = useMemo(() => {
    let filtered = mockResults

    console.log("[v0] Total results:", mockResults.length)
    console.log("[v0] Secundario results:", mockResults.filter((r) => r.nivel === "secundario").length)

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (result) => result.name.toLowerCase().includes(query) || result.description.toLowerCase().includes(query),
      )
    }

    // Apply category filters
    Object.entries(activeFilters).forEach(([category, values]) => {
      if (values.length > 0) {
        console.log("[v0] Applying filter:", category, values)
        filtered = filtered.filter((result) => {
          switch (category) {
            case "nivel":
              const matches = values.includes(result.nivel)
              if (values.includes("secundario")) {
                console.log("[v0] Checking secundario for:", result.name, result.nivel, matches)
              }
              return matches
            case "unidad-academica":
              return values.includes(result.unidadAcademica)
            case "titulo":
              return values.includes(result.titulo)
            default:
              return true
          }
        })
      }
    })

    console.log("[v0] Filtered results:", filtered.length)

    // Group results by academic unit when no search query
    const grouped =
      !searchQuery.trim() && Object.keys(activeFilters).length === 0
        ? filtered.reduce(
            (acc, result) => {
              const key = result.unidadAcademica
              if (!acc[key]) acc[key] = []
              acc[key].push(result)
              return acc
            },
            {} as Record<string, typeof filtered>,
          )
        : null

    return { filteredResults: filtered, groupedResults: grouped }
  }, [searchQuery, activeFilters])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const getUnitDisplayName = (unitId: string) => {
    const unitNames: Record<string, string> = {
      IDAES: "Escuela Interdisciplinaria de Altos Estudios Sociales",
      "arte-patrimonio": "Escuela de Arte y Patrimonio",
      "bio-nanotecnologias": "Escuela de Bio y Nanotecnologías",
      "ciencia-tecnologia": "Escuela de Ciencia y Tecnología",
      "economia-negocios": "Escuela de Economía y Negocios",
      humanidades: "Escuela de Humanidades",
      "habitat-sostenibilidad": "Escuela de Hábitat y Sostenibilidad",
      "politica-gobierno": "Escuela de Política y Gobierno",
      "dan-beninson": "Instituto Dan Beninson",
      "rehabilitacion-movimiento": "Instituto de Rehabilitación y Movimiento",
      sabato: "Instituto de Tecnología Prof. Jorge Sabato",
      oespu: "Observatorio de Educación Superior y Políticas Universitarias",
    }
    return unitNames[unitId] || unitId
  }

  const getTitleColor = (titulo: string) => {
    const colors: Record<string, string> = {
      licenciatura: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      ingenieria: "bg-green-500/20 text-green-400 border-green-500/30",
      maestria: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      doctorado: "bg-red-500/20 text-red-400 border-red-500/30",
      especializacion: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      tecnicatura: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      profesorado: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      curso: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[titulo] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const ResultCard = ({ result }: { result: (typeof mockResults)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-accent/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {result.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{result.address}</span>
              <span className="text-accent font-medium">• {result.distance}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getTitleColor(result.titulo)}>
              {result.titulo.charAt(0).toUpperCase() + result.titulo.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {result.modalidad}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{result.description}</p>

        {/* Program Details */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Duración: {result.duracion}</span>
          </div>
          {result.students && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{result.students} estudiantes</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{result.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{result.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-xl bg-accent hover:bg-accent/90 focus-visible:ring-accent shadow-sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver más
          </Button>
          {result.hasLocation && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-border/50 hover:bg-accent/10 hover:text-accent focus-visible:ring-accent bg-background/80 shadow-sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Cómo llegar
            </Button>
          )}
          <Button variant="ghost" size="sm" className="rounded-xl hover:bg-muted/50 focus-visible:ring-accent">
            <Clock className="h-4 w-4 mr-2" />
            Horarios
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Results Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">Mostrando {filteredResults.length} de 431 ofertas</h2>
            <Badge variant="secondary" className="rounded-full">
              UNSAM
            </Badge>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-6 max-w-4xl">
          {groupedResults
            ? // Grouped by academic unit
              Object.entries(groupedResults).map(([unitId, results]) => (
                <Collapsible key={unitId} open={expandedCategories[unitId]} onOpenChange={() => toggleCategory(unitId)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto rounded-xl border border-border/50 hover:bg-card/50 focus-visible:ring-accent"
                    >
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-foreground">{getUnitDisplayName(unitId)}</h3>
                        <p className="text-sm text-muted-foreground">{results.length} programas disponibles</p>
                      </div>
                      {expandedCategories[unitId] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {results.map((result) => (
                      <ResultCard key={result.id} result={result} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            : // Flat list for search results or filtered results
              filteredResults.map((result) => <ResultCard key={result.id} result={result} />)}
        </div>
      </div>
    </main>
  )
}
