"use client"

import { useState, useMemo } from "react"
import { MapPin, ExternalLink, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import catalog from "@/app/(data)/catalog.json"
import type { Item } from "@/lib/types"

const data = catalog as Item[]

interface ResultsListProps {
  searchQuery?: string
  activeFilters?: Record<string, string[]>
}

const nivelMap: Record<string, string> = {
  curso: "Curso",
  secundaria: "Secundaria",
  superior: "Superior",
  tecnica: "Técnica",
}

const unitMap: Record<string, string> = {
  idaes: "Escuela Interdisciplinaria de Altos Estudios Sociales - IDAES",
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
  oespu: "Observatorio de Educación Superior y Políticas Universitarias (OESPU)",
}

const titleMap: Record<string, string | string[]> = {
  doctorado: "Doctorado",
  especializacion: "Especialización",
  ingenieria: "Ingeniería",
  licenciatura: "Licenciatura",
  "licenciatura-tecnicatura": ["Licenciatura", "Tecnicatura"],
  maestria: "Maestría",
  profesorado: "Profesorado",
  tecnicatura: "Tecnicatura",
  arquitectura: "Arquitectura",
  contador: "Contador",
  martillero: "Martillero",
}

export function ResultsList({ searchQuery = "", activeFilters = {} }: ResultsListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const totalResults = data.length

  const { filteredResults, groupedResults } = useMemo(() => {
    let filtered = data

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((result) => {
        const hay = [
          result.provider_name,
          result.program_name,
          result.title,
          result.unit,
          result.address,
          result._search,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return hay.includes(query)
      })
    }

    Object.entries(activeFilters).forEach(([category, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((result) => {
          switch (category) {
            case "nivel":
              return values.some((v) => nivelMap[v] === (result.level_norm || ""))
            case "unidad-academica":
              return values.some((v) => unitMap[v] === (result.unit || ""))
            case "titulo":
              return values.some((v) => {
                const mapped = titleMap[v]
                if (Array.isArray(mapped)) {
                  return mapped.includes(result.title || "")
                }
                return mapped === (result.title || "")
              })
            default:
              return true
          }
        })
      }
    })

    const grouped =
      !searchQuery.trim() && Object.keys(activeFilters).length === 0
        ? filtered.reduce((acc, result) => {
            const key = result.unit || "Sin unidad académica"
            ;(acc[key] = acc[key] || []).push(result)
            return acc
          }, {} as Record<string, Item[]>)
        : null

    return { filteredResults: filtered, groupedResults: grouped }
  }, [searchQuery, activeFilters])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
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

  const ResultCard = ({ result }: { result: Item }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-accent/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {result.provider_name}
            </h3>
            {result.program_name && (
              <div className="mt-1 text-sm text-muted-foreground truncate">{result.program_name}</div>
            )}
            {result.address && (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{result.address}</span>
              </div>
            )}
          </div>
          {result.title && (
            <Badge className={getTitleColor(result.title.toLowerCase())}>
              {result.title}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {result.unit && (
          <p className="text-sm text-muted-foreground mb-4">{result.unit}</p>
        )}
        {result.website && (
          <Button
            size="sm"
            className="rounded-xl bg-accent hover:bg-accent/90 focus-visible:ring-accent shadow-sm"
            asChild
          >
            <a href={result.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver más
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border bg-card/30 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Mostrando {filteredResults.length} de {totalResults} ofertas
            </h2>
            <Badge variant="secondary" className="rounded-full">
              UNSAM
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="space-y-6 max-w-4xl">
          {groupedResults
            ? Object.entries(groupedResults).map(([unitName, results]) => (
                <Collapsible
                  key={unitName}
                  open={expandedCategories[unitName]}
                  onOpenChange={() => toggleCategory(unitName)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto rounded-xl border border-border/50 hover:bg-card/50 focus-visible:ring-accent"
                    >
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-foreground">{unitName}</h3>
                        <p className="text-sm text-muted-foreground">{results.length} programas disponibles</p>
                      </div>
                      {expandedCategories[unitName] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {results.map((result, idx) => (
                      <ResultCard key={idx} result={result} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            : filteredResults.map((result, idx) => <ResultCard key={idx} result={result} />)}
        </div>
      </div>
    </main>
  )
}

