"use client";

import * as React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  GraduationCap,
  BookOpen,
  Users,
  Wrench,
  ScrollText,
  MapPin,
} from "lucide-react";

/* ========= 1) Normalizador (mantener) ========= */
type ResultCard = {
  id?: string;
  heading?: string;      // program_name
  badgeRight?: string;   // title (tipo)
  chips?: string[];      // [provider_name, unit]
  level?: string;        // level_norm
  area?: string;         // family
  barrio?: string;
  address?: string;
  place?: string;
  notes?: string;
  phone?: string;
  email?: string;
  modality?: string;
  maps?: string;

  // compat
  program_name?: string;
  title?: string;
  provider?: string;
  provider_name?: string;
  unit?: string;
  level_norm?: string;
  family?: string;
};

const toView = (i: ResultCard) => ({
  id: i.id,
  heading: i.heading ?? i.program_name ?? "",
  badgeRight: i.badgeRight ?? i.title ?? "",
  // Solo mostramos la unidad en la línea de chips; el nombre de la institución va en la sección de ubicación
  chips: i.chips ?? [i.unit].filter(Boolean) as string[],
  level: i.level ?? i.level_norm ?? "",
  area: i.area ?? i.family ?? "",
  barrio: i.barrio ?? "",
  address: i.address ?? "",
  place: i.place ?? i.provider_name ?? i.provider ?? "",
  notes: i.notes ?? "",
  phone: i.phone ?? "",
  email: i.email ?? "",
  maps: i.maps ?? "",
  modality: i.modality ?? "",
});

/* ========= 2) Acentos por tipo ========= */
// ¡Mantener estas clases “estáticas” para que Tailwind no las purgue!
const ACCENTS = {
  licenciatura: {
    left: "border-l-4 border-emerald-500 dark:border-emerald-500",
    iconWrap: "bg-emerald-500/10 dark:bg-emerald-400/15",
    icon: "text-emerald-600 dark:text-emerald-300",
    badge: "bg-emerald-500 text-white",
    btn: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
  "maestría": {
    left: "border-l-4 border-blue-500 dark:border-blue-500",
    iconWrap: "bg-blue-500/10 dark:bg-blue-400/15",
    icon: "text-blue-600 dark:text-blue-300",
    badge: "bg-blue-500 text-white",
    btn: "bg-blue-500 text-white hover:bg-blue-600",
  },
  doctorado: {
    left: "border-l-4 border-purple-500 dark:border-purple-500",
    iconWrap: "bg-purple-500/10 dark:bg-purple-400/15",
    icon: "text-purple-600 dark:text-purple-300",
    badge: "bg-purple-500 text-white",
    btn: "bg-purple-500 text-white hover:bg-purple-600",
  },
  profesorado: {
    left: "border-l-4 border-orange-500 dark:border-orange-500",
    iconWrap: "bg-orange-500/10 dark:bg-orange-400/15",
    icon: "text-orange-600 dark:text-orange-300",
    badge: "bg-orange-500 text-white",
    btn: "bg-orange-500 text-white hover:bg-orange-600",
  },
  tecnicatura: {
    left: "border-l-4 border-teal-500 dark:border-teal-500",
    iconWrap: "bg-teal-500/10 dark:bg-teal-400/15",
    icon: "text-teal-600 dark:text-teal-300",
    badge: "bg-teal-500 text-white",
    btn: "bg-teal-500 text-white hover:bg-teal-600",
  },
  "especialización": {
    left: "border-l-4 border-indigo-500 dark:border-indigo-500",
    iconWrap: "bg-indigo-500/10 dark:bg-indigo-400/15",
    icon: "text-indigo-600 dark:text-indigo-300",
    badge: "bg-indigo-500 text-white",
    btn: "bg-indigo-500 text-white hover:bg-indigo-600",
  },
  curso: {
    left: "border-l-4 border-sky-500 dark:border-sky-500",
    iconWrap: "bg-sky-500/10 dark:bg-sky-400/15",
    icon: "text-sky-600 dark:text-sky-300",
    badge: "bg-sky-500 text-white",
    btn: "bg-sky-500 text-white hover:bg-sky-600",
  },
  default: {
    left: "border-l-4 border-slate-300 dark:border-slate-600",
    iconWrap: "bg-muted",
    icon: "text-muted-foreground",
    badge: "bg-muted text-foreground",
    btn: "bg-muted text-foreground hover:bg-muted/80",
  },
} as const;

function pickAccent(label?: string) {
  const k = (label ?? "").toLowerCase().trim();
  if (k in ACCENTS) return ACCENTS[k as keyof typeof ACCENTS];
  return ACCENTS.default;
}

function pickIcon(label?: string) {
  const k = (label ?? "").toLowerCase().trim();
  if (k.includes("doctor")) return Award;
  if (k.includes("maestr")) return GraduationCap;
  if (k.includes("licenc")) return BookOpen;
  if (k.includes("profesor")) return Users;
  if (k.includes("tecnic")) return Wrench;
  if (k.includes("curso") || k.includes("especial")) return ScrollText;
  return BookOpen;
}

/* ========= 3) Listado ========= */
export default function ResultsList({ items = [] as ResultCard[] }) {
  const view = items.map(toView);

  if (process.env.NODE_ENV !== "production") {
    console.log("[ResultsList] items:", view.length, "first:", view[0]?.heading, "/", view[0]?.badgeRight);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {view.map((it, i) => {
        const accent = pickAccent(it.badgeRight);
        const Icon = pickIcon(it.badgeRight);

        return (
          <Card
            key={it.id ?? `${it.heading ?? "item"}-${i}`}
            className={`group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${accent.left} overflow-hidden bg-card/95 backdrop-blur-sm`}
          >
            {/* cabecera con icono + badge */}
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${accent.iconWrap}`}>
                    <Icon className={`w-5 h-5 ${accent.icon}`} />
                  </div>
                  {it.badgeRight ? (
                    <Badge className={`border-0 font-semibold px-3 py-1 text-xs ${accent.badge}`}>
                      {it.badgeRight}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {/* título */}
              <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                {it.heading}
              </h3>

              {/* unidad */}
              {it.chips?.length ? (
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${accent.icon.replace("text-", "bg-")}`} />
                  <p className="text-sm text-muted-foreground">
                    {it.chips.filter(Boolean).join(" • ")}
                  </p>
                </div>
              ) : null}

              {/* descripción (si hay) */}
              {it.notes ? (
                <p className="text-sm text-foreground/80 leading-relaxed mb-4 line-clamp-3">
                  {it.notes}
                </p>
              ) : null}

              {/* ubicación: nombre del lugar en negrita y dirección debajo */}
              {(it.place || it.address || it.barrio) ? (
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    {it.place ? (
                      <div className="font-bold text-foreground">{it.place}</div>
                    ) : null}
                    <div className="text-xs text-muted-foreground">
                      {it.address || it.barrio || ""}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* acciones */}
              <div className="pt-3 border-t border-border/50">
                {it.maps ? (
                  <a
                    href={it.maps}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-sm font-medium shadow-sm transition ${accent.btn}`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </a>
                ) : (
                  <div className="text-xs text-muted-foreground py-2 text-center">
                    Ubicación no disponible
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
