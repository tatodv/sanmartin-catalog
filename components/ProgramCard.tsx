"use client";
import React from "react";
import "./program-card.css";
import type { Program } from "@/types/program";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, BookOpen, Award, Wrench, MapPin, Globe, Mail, Navigation, Info } from "lucide-react";

const toKey = (t?: string) => (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const typeConfig: Record<string, any> = {
  licenciatura: { color: "#16a34a", bg: "bg-emerald-500/10", border: "border-emerald-600", icon: GraduationCap },
  maestria:     { color: "#2563eb", bg: "bg-blue-500/10",     border: "border-blue-600",     icon: BookOpen },
  doctorado:    { color: "#7c3aed", bg: "bg-violet-500/10",   border: "border-violet-600",   icon: Award },
  tecnicatura:  { color: "#0ea5a4", bg: "bg-teal-500/10",      border: "border-teal-600",     icon: Wrench },
  especializacion:{ color:"#d97706", bg:"bg-amber-500/10",     border:"border-amber-600",     icon: Award },
};

const COLOR: Record<string, string> = {
  licenciatura: "licenciatura",
  maestria: "maestria",
  doctorado: "doctorado",
  tecnicatura: "tecnicatura",
  especializacion: "especializacion",
  profesorado: "profesorado",
  ingenieria: "ingenieria",
  diplomatura: "diplomatura",
  curso: "curso",
};

function ProgramCard({ program: p }: { program: Program }) {
  const k = toKey(p.degree_title);
  const cfg = typeConfig[k] || { color: "#64748b", bg: "bg-slate-500/10", border: "border-slate-600", icon: GraduationCap };
  const ringClass = COLOR[k] ? `ring--${COLOR[k]}` : "";
  const Icon = cfg.icon;

  const web = p.links?.find((l) => (l.label || "").toLowerCase().includes("web"))?.url;
  const contact = p.links?.find((l) => (l.label || "").toLowerCase().includes("contacto"))?.url;
  const maps = p.links?.find((l) => (l.label || "").toLowerCase().includes("llegar"))?.url;

  return (
    <Card className={`program-card ${ringClass} transition-all duration-300 hover:shadow-xl group overflow-hidden`}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${cfg.bg}`}>
            <Icon className="w-6 h-6" style={{ color: cfg.color }} />
          </div>
          {p.degree_title && (
            <Badge variant="outline" className="font-medium" style={{ borderColor: cfg.color, color: cfg.color }}>
              {p.degree_title}
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2 text-balance">{p.title}</h3>
          {p.unit && <p className="text-muted-foreground text-base">{p.unit}</p>}
        </div>

        {p.enrollment_period_text && (
          <div className={`p-3 rounded-lg ${cfg.bg} border`} style={{ borderColor: cfg.color }}>
            <p className="text-base font-medium mb-1">Período de Inscripción</p>
            <p className="text-sm" style={{ color: cfg.color }}>{p.enrollment_period_text}</p>
            {(p.phone || p.info) && (
              <div className="mt-1 text-sm opacity-90">
                {p.phone && (<div className="flex items-center gap-2"><Info className="w-4 h-4" aria-hidden />Tel: {p.phone}</div>)}
                {p.info && (<div className="mt-0.5">{p.info}</div>)}
              </div>
            )}
          </div>
        )}

        {(p.institution || p.address) && (
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
            <div className="text-base whitespace-pre-line">
              <p className="font-medium">{p.institution}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.address}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!web}
            onClick={() => web && window.open(web, "_blank")}
            className="transition-all duration-200 hover:scale-105"
            style={{ borderColor: cfg.color, color: web ? cfg.color : undefined }}
          >
            <Globe className="w-4 h-4 mr-1" /> Web
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!contact}
            onClick={() => contact && window.open(contact, "_blank")}
            className="transition-all duration-200 hover:scale-105"
            style={{ borderColor: cfg.color, color: contact ? cfg.color : undefined }}
          >
            <Mail className="w-4 h-4 mr-1" /> Contacto
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!maps}
            onClick={() => maps && window.open(maps, "_blank")}
            className="transition-all duration-200 hover:scale-105"
            style={{ borderColor: cfg.color, color: maps ? cfg.color : undefined }}
          >
            <Navigation className="w-4 h-4 mr-1" /> Llegar
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default React.memo(ProgramCard)
