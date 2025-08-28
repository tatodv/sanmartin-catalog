"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";

export type TypeItem = { label: string; count: number };

/**
 * Hero de onboarding para el Home.
 * - No depende del grid: setea query params y se cierra.
 * - Si ya hay ?q= o ?type= o ?inst=, no se muestra.
 */
export default function OnboardingHome({
  types,
  storageKey = "onboarding:home:v2",
  logoSrc = "/sanmartin-logo.png",
}: {
  types: TypeItem[];
  storageKey?: string;
  logoSrc?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // si ya hay filtros/búsqueda, no se muestra
  const hasQuery = Boolean(
    (searchParams.get("q") || (searchParams.getAll("type").length > 0) || searchParams.get("inst"))
  );
  const seen = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
  const [open, setOpen] = useState<boolean>(() => !hasQuery && !seen);

  // estado
  const [step, setStep] = useState<0 | 1>(0);
  const [track, setTrack] = useState<"laboral" | "grado" | "posgrado" | "explorar" | null>(null);
  const [inst, setInst] = useState<"unsam" | "potenciate" | "cualquiera">("cualquiera");
  const [hasPeriod, setHasPeriod] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && step === 1 && inputRef.current) inputRef.current.focus();
  }, [open, step]);

  // ordenar tipos por popularidad (usa tu dataset ya cargado)
  const sortedTypes = useMemo(() => [...types].sort((a, b) => b.count - a.count), [types]);

  // Mapea “camino” → tipos (usa tus labels)
  function typesForTrack(): string[] {
    switch (track) {
      case "laboral":
        return ["Curso", "Tecnicatura"]; // FP/Potenciate suele mapear a Curso
      case "grado":
        return ["Licenciatura", "Ingeniería", "Profesorado"];
      case "posgrado":
        return ["Maestría", "Especialización", "Doctorado", "Diplomatura"];
      case "explorar":
      default:
        return [];
    }
  }

  function apply() {
    const params = new URLSearchParams();
    typesForTrack().forEach((t) => params.append("type", t));
    if (q.trim()) params.set("q", q.trim());
    if (hasPeriod) params.set("has", "period");
    if (inst !== "cualquiera") params.set("inst", inst);

    try {
      localStorage.setItem(storageKey, "done");
    } catch {}
    const url = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <section aria-labelledby="onb-title" className="mx-auto w-full max-w-5xl p-4">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        {/* Logo + bienvenida */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-neutral-900 overflow-hidden grid place-items-center">
              <img
                src={logoSrc}
                alt="San Martín"
                className="w-full h-full object-cover hidden md:block"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="md:hidden text-emerald-400 font-bold">SM</span>
            </div>
            <div>
              <h1 id="onb-title" className="text-2xl md:text-3xl font-extrabold">
                ¡Bienvenido/a a la Red de Formación de San Martín!
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Te hacemos 2 preguntas rápidas para llevarte directo a lo que necesitás.
              </p>
            </div>
          </div>

          {/* Paso 1 */}
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">1 de 2 — ¿Qué estás buscando?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setTrack("laboral")}
                  className={`text-left p-3 rounded-xl border transition ${
                    track === "laboral"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <span className="font-medium">Inserción laboral rápida</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Cursos, FP y tecnicaturas</p>
                </button>

                <button
                  onClick={() => setTrack("grado")}
                  className={`text-left p-3 rounded-xl border transition ${
                    track === "grado"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <span className="font-medium">Carrera universitaria</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Licenciaturas, profesorados, ingenierías</p>
                </button>

                <button
                  onClick={() => setTrack("posgrado")}
                  className={`text-left p-3 rounded-xl border transition ${
                    track === "posgrado"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <span className="font-medium">Posgrado / especialización</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Maestrías, especializaciones y doctorados</p>
                </button>

                <button
                  onClick={() => setTrack("explorar")}
                  className={`text-left p-3 rounded-xl border transition ${
                    track === "explorar"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <span className="font-medium">Explorar todo</span>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Ver toda la oferta disponible</p>
                </button>
              </div>
            </div>
          )}

          {/* Paso 2 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">2 de 2 — Preferencias</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setInst("unsam")}
                    className={`text-sm px-3 py-1.5 rounded-xl border transition ${
                      inst === "unsam"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    UNSAM / Universidades
                  </button>
                  <button
                    onClick={() => setInst("potenciate")}
                    className={`text-sm px-3 py-1.5 rounded-xl border transition ${
                      inst === "potenciate"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    Municipal / Potenciate
                  </button>
                  <button
                    onClick={() => setInst("cualquiera")}
                    className={`text-sm px-3 py-1.5 rounded-xl border transition ${
                      inst === "cualquiera"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    Cualquiera
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">¿Alguna palabra clave?</p>
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ej: programación, psicología, marketing…"
                    className="w-full rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 pl-9 pr-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm cursor-pointer text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    className="accent-emerald-500"
                    checked={hasPeriod}
                    onChange={(e) => setHasPeriod(e.target.checked)}
                  />
                  Solo ofertas con <em>Período de inscripción</em> publicado
                </label>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex items-center gap-3">
            {step === 0 ? (
              <button
                onClick={() => setStep(1)}
                disabled={!track}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 disabled:opacity-50"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={apply}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/10"
              >
                Ver resultados
              </button>
            )}

            <button onClick={() => setOpen(false)} className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              Saltar
            </button>
          </div>
        </div>

        {/* Tarjeta lateral de apoyo */}
        <div className="w-full max-w-xl rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Tipos más buscados</p>
          <div className="flex flex-wrap gap-2">
            {sortedTypes.slice(0, 8).map((t) => (
              <span key={t.label} className="text-xs px-2 py-1 rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                {t.label} <span className="opacity-60">({t.count})</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">Luego podés ajustar con los filtros de la izquierda.</p>
        </div>
      </div>
    </section>
  );
}


