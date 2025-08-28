import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import slugify from "slugify";

const SRC = path.join(process.cwd(), "app/(data)/catalog.csv");
const OUT = path.join(process.cwd(), "app/(data)/catalog.json");

const norm = (v) => (v ?? "").toString().trim();
const cap1 = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// Normaliza "Tipo" → badge/estilos
function cleanTipo(t) {
  const s = norm(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const map = {
    licenciatura: "Licenciatura",
    maestria: "Maestría",
    master: "Maestría",
    doctorado: "Doctorado",
    phd: "Doctorado",
    tecnicatura: "Tecnicatura",
    especializacion: "Especialización",
    profesorado: "Profesorado",
    ingenieria: "Ingeniería",
    diplomatura: "Diplomatura",
    curso: "Curso",
    "formacion profesional": "Curso",
    "sedes potenciate": "Curso",
    "educacion tecnica": "Educación Técnica",
    "educacion secundaria": "Educación Secundaria",
    "educacion superior": "Educación Superior",
  };
  return map[s] || cap1(norm(t)) || "Otro";
}

const DEGREE_PREFIX = {
  Licenciatura: "Licenciatura en ",
  Maestría: "Maestría en ",
  Doctorado: "Doctorado en ",
  Tecnicatura: "Tecnicatura en ",
  Especialización: "Especialización en ",
  Profesorado: "Profesorado en ",
  Ingeniería: "Ingeniería en ",
  Diplomatura: "Diplomatura en ",
  Curso: "",
  Otro: "",
};

const mapsUrl = (geo, dir) => {
  const g = norm(geo);
  if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(g)) return `https://maps.google.com/?q=${g.replace(/\s+/g,"")}`;
  const d = norm(dir);
  return d ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d)}` : null;
};
const isEmail = (s) => /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(s);
const telLink = (s) => {
  const nums = norm(s).replace(/[^\d+]/g, "");
  return nums ? `tel:${nums}` : null;
};

// 1) Leer CSV
if (!fs.existsSync(SRC)) {
  console.error("❌ Falta data/catalog.csv");
  process.exit(1);
}
const raw = fs.readFileSync(SRC, "utf8");
const rows = parse(raw, { columns: true, skip_empty_lines: true });

// 2) Mapear filas → objeto usado por la card
const items = [];
const seen = new Set();
for (const r of rows) {
  const institucion = norm(r["institución"] || r["Institución"] || r["INSTITUCIÓN"]);
  const unidad = norm(r["UNIDAD ACADÉMICA / ÁREA"] || r["Unidad"] || r["Escuela"]);
  const carrera = norm(r["CARRERAS"] || r["Carrera"] || r["Oferta"]);
  const tipo = cleanTipo(r["Tipo"] || r["TIPO"]);
  const periodo = norm(r["PERIODO DE INSCRIPCIÓN"] || r["Período de inscripción"] || r["PERIODO"]);
  const telefono = norm(r["Teléfono"] || r["Telefono"]);
  const info = norm(r["INFO ADICIONAL"] || r["Notas"] || r["Observaciones"]);
  const direccion = norm(r["DIRECCIÓN"] || r["Direccion"]);
  const geo = norm(r["GEOLOCALIZACIÓN"] || r["Geolocalización"] || r["Geo"]);
  const link = norm(r["LINK"] || r["Web"] || r["URL"] || r["Sitio"]);
  const contacto = norm(r["CONTACTO"] || r["Email"] || r["Correo"]);

  const title =
    (DEGREE_PREFIX[tipo] || "") + (carrera || "").trim() || (tipo ? `${tipo} - ${unidad || institucion}` : "Programa");

  const id = slugify(
    [institucion, tipo || "", carrera || unidad || direccion].filter(Boolean).join(" "),
    { lower: true, strict: true }
  );
  if (seen.has(id)) continue;
  seen.add(id);

  const btns = [];
  if (link) btns.push({ label: "Web", url: link });
  if (isEmail(contacto)) btns.push({ label: "Contacto", url: `mailto:${contacto}` });
  else if (telefono) {
    const t = telLink(telefono);
    if (t) btns.push({ label: "Contacto", url: t });
  }
  const maps = mapsUrl(geo, direccion);
  if (maps) btns.push({ label: "Llegar", url: maps });

  items.push({
    id,
    // ——— campos usados por la card ———
    degree_title: tipo,              // "Tipo" (badge)
    title,                           // "Carreras" (con prefijo)
    unit: unidad,                    // UNIDAD ACADÉMICA / ÁREA
    enrollment_period_text: periodo, // PERÍODO DE INSCRIPCIÓN (texto)
    phone: telefono || "",           // Teléfono (se muestra junto al período)
    info: info || "",                // INFO ADICIONAL (junto al período)
    institution: institucion,        // Institución
    address: direccion,              // Dirección
    links: btns,                     // Web / Contacto / Llegar
  });
}

// 3) Escribir JSON (fuente del front)
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(items, null, 2), "utf8");
console.log(`✅ Generado ${OUT} con ${items.length} registros.`);
