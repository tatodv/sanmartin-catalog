"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  GraduationCap,
  BookOpen,
  Award,
  Briefcase as Certificate,
  Wrench,
  MapPin,
  Globe,
  Mail,
  Navigation,
} from "lucide-react"
import type { AcademicProgram } from "./academic-programs-grid"

const typeConfig = {
  Licenciatura: {
    color: "#10b981",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500",
    shadowColor: "shadow-emerald-500/20",
    hoverShadow: "hover:shadow-emerald-500/40",
    icon: GraduationCap,
  },
  Maestría: {
    color: "#3b82f6",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
    shadowColor: "shadow-blue-500/20",
    hoverShadow: "hover:shadow-blue-500/40",
    icon: BookOpen,
  },
  Doctorado: {
    color: "#8b5cf6",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500",
    shadowColor: "shadow-violet-500/20",
    hoverShadow: "hover:shadow-violet-500/40",
    icon: Award,
  },
  Especialización: {
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500",
    shadowColor: "shadow-amber-500/20",
    hoverShadow: "hover:shadow-amber-500/40",
    icon: Certificate,
  },
  Tecnicatura: {
    color: "#14b8a6",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500",
    shadowColor: "shadow-teal-500/20",
    hoverShadow: "hover:shadow-teal-500/40",
    icon: Wrench,
  },
}

interface AcademicProgramCardProps {
  program: AcademicProgram
}

export function AcademicProgramCard({ program }: AcademicProgramCardProps) {
  const config = typeConfig[program.type as keyof typeof typeConfig] || typeConfig["Licenciatura"]
  const IconComponent = config.icon

  const handleWebClick = () => {
    if (program.website) {
      window.open(program.website, "_blank")
    }
  }

  const handleContactClick = () => {
    if (program.email) {
      window.open(`mailto:${program.email}`, "_blank")
    }
  }

  const handleDirectionsClick = () => {
    const query = encodeURIComponent(`${program.location.institution}, ${program.location.address}`)
    window.open(`https://maps.google.com/maps?q=${query}`, "_blank")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    })
  }

  const hasMaps = Boolean(program.location?.institution || program.location?.address)
  // Mostrar distancia si viene calculada desde la lista (program as any).distanceLabel
  const distanceLabel = (program as any).distanceLabel as string | undefined
  return (
    <Card
      className={`
      border-2 ${config.borderColor} ${config.shadowColor} hover:shadow-xl ${config.hoverShadow}
      transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group overflow-hidden
      bg-white text-[#0b0b0d] dark:bg-[#0f1a2b] dark:text-[#e8e9ee]
    `}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <IconComponent className="w-6 h-6" style={{ color: config.color }} />
          </div>
          <Badge
            variant="outline"
            className={`${config.borderColor} text-white font-medium`}
            style={{ borderColor: config.color, color: config.color }}
          >
            {program.type}
          </Badge>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold mb-2 text-balance">
            {program.title}
          </h3>
          <p className="text-base font-medium text-gray-600 dark:text-gray-400">{program.academicUnit}</p>
        </div>

        {/* Enrollment Period */}
        {program.enrollmentPeriod && (
          <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
            <p className="text-base font-medium mb-1">Período de Inscripción</p>
            <p className="text-sm" style={{ color: config.color }}>
              {formatDate(program.enrollmentPeriod.start)} - {formatDate(program.enrollmentPeriod.end)}
            </p>
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-base">
              <p className="font-medium">{program.location.institution}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{program.location.address}</p>
              {distanceLabel ? (
                <p className="text-xs text-emerald-500 mt-1">{distanceLabel} de ti</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWebClick}
            disabled={!program.website}
            className={`${config.borderColor} hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all duration-200 hover:scale-105`}
            style={{
              borderColor: config.color,
              color: program.website ? config.color : undefined,
            }}
          >
            <Globe className="w-4 h-4 mr-1" />
            Web
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleContactClick}
            disabled={!program.email}
            className={`${config.borderColor} hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all duration-200 hover:scale-105`}
            style={{
              borderColor: config.color,
              color: program.email ? config.color : undefined,
            }}
          >
            <Mail className="w-4 h-4 mr-1" />
            Contacto
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDirectionsClick}
            disabled={!hasMaps}
            className={`${config.borderColor} hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-all duration-200 hover:scale-105`}
            style={{ borderColor: config.color, color: hasMaps ? config.color : undefined }}
          >
            <Navigation className="w-4 h-4 mr-1" />
            Llegar
          </Button>
        </div>
      </div>
    </Card>
  )
}
