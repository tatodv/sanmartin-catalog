"use client";
import React from "react";
import "./program-card.css";
import type { Program } from "@/types/program";
import { GraduationCap, BookOpen, UserRound, Wrench, MapPin, Mail, ExternalLink, Info } from "lucide-react";

const toKey = (t?: string) =>
  (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

const tipoIcon = (tipo?: string) => {
  const k = toKey(tipo);
  if (k.includes("doctorado")) return <UserRound className="icon" aria-hidden />;
  if (k.includes("maestr"))   return <BookOpen className="icon" aria-hidden />;
  if (k.includes("tecnic"))   return <Wrench className="icon" aria-hidden />;
  return <GraduationCap className="icon" aria-hidden />;
};

export default function ProgramCard({ program: p }: { program: Program }) {
  const k = toKey(p.degree_title);
  const ringClass = COLOR[k] ? `ring--${COLOR[k]}` : "";
  const badgeClass = COLOR[k] ? `badge badge--${COLOR[k]}` : "badge";

  return (
    <article className={`program-card ${ringClass}`} aria-labelledby={`${p.id}-title`}>
      {/* Header: icono + título + badge Tipo */}
      <header className="program-card__header">
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          {tipoIcon(p.degree_title)}
          <h3 id={`${p.id}-title`} className="text-lg font-semibold">{p.title}</h3>
        </div>
        {p.degree_title && <span className={badgeClass}>{p.degree_title}</span>}
      </header>

      {/* Unidad académica */}
      {p.unit && <p className="program-card__unit">{p.unit}</p>}

      {/* Período de Inscripción - solo si existe */}
      {p.enrollment_period_text && (
        <div className="program-card__pill">
          <strong>Período de Inscripción</strong>
          <div>{p.enrollment_period_text}</div>
          {/* Teléfono e Info adicional dentro del mismo bloque si existen */}
          {(p.phone || p.info) && (
            <div className="mt-1 text-sm" style={{opacity:.9}}>
              {p.phone && (<div><Info className="icon" style={{marginRight:6}} aria-hidden /> Tel: {p.phone}</div>)}
              {p.info && (<div className="mt-0.5">{p.info}</div>)}
            </div>
          )}
        </div>
      )}

      {/* Institución + Dirección */}
      {(p.institution || p.address) && (
        <p className="program-card__address">
          <MapPin className="icon" style={{marginRight:6}} aria-hidden />
          {[p.institution, p.address].filter(Boolean).join("\n")}
        </p>
      )}

      {/* Acciones - siempre mostrar los 3 botones, deshabilitados si no hay datos */}
      <div className="actions" role="group" aria-label="Acciones">
        {/* Botón Web */}
        <a 
          className={`action-btn ${!p.links?.find(l => l.label === "Web") ? "disabled" : ""}`}
          href={p.links?.find(l => l.label === "Web")?.url || "#"}
          target="_blank" 
          rel="noreferrer"
          onClick={(e) => !p.links?.find(l => l.label === "Web") && e.preventDefault()}
        >
          <ExternalLink className="icon" aria-hidden /> Web
        </a>

        {/* Botón Contacto */}
        <a 
          className={`action-btn ${!p.links?.find(l => l.label === "Contacto") ? "disabled" : ""}`}
          href={p.links?.find(l => l.label === "Contacto")?.url || "#"}
          target="_blank" 
          rel="noreferrer"
          onClick={(e) => !p.links?.find(l => l.label === "Contacto") && e.preventDefault()}
        >
          <Mail className="icon" aria-hidden /> Contacto
        </a>

        {/* Botón Llegar */}
        <a 
          className={`action-btn ${!p.links?.find(l => l.label === "Llegar") ? "disabled" : ""}`}
          href={p.links?.find(l => l.label === "Llegar")?.url || "#"}
          target="_blank" 
          rel="noreferrer"
          onClick={(e) => !p.links?.find(l => l.label === "Llegar") && e.preventDefault()}
        >
          <MapPin className="icon" aria-hidden /> Llegar
        </a>
      </div>
    </article>
  );
}
