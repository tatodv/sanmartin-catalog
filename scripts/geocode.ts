/// <reference types="node" />
import fs from "node:fs";
import path from "node:path";

// === Config ===
const CATALOG_PATH = path.join(process.cwd(), "src", "app", "(data)", "catalog.json");
const CACHE_PATH   = path.join(process.cwd(), "src", "app", "(data)", "geocode_cache.json");
const BACKUP_PATH  = path.join(process.cwd(), "src", "app", "(data)", `catalog.backup.${Date.now()}.json`);
const EMAIL = process.env.GEOCODER_EMAIL || "contacto@example.com"; // poné tu mail en .env.local

type Item = {
  provider_name: string;
  program_name?: string | null;
  address?: string | null;
  address_kmz?: string | null;
  locality?: string | null;
  barrio?: string | null;
  lat?: number | null;
  lon?: number | null;
  maps_url?: string | null;
  geo_source?: string | null;
};

type Cache = Record<string, { lat: number; lon: number }>;

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

function buildQuery(it: Item) {
  // prioridad: address explícita → address_kmz → provider + locality
  const base =
    (it.address && it.address.trim()) ||
    (it.address_kmz && it.address_kmz.trim()) ||
    `${it.provider_name ?? ""} ${it.locality ?? ""}`.trim();

  // contexto geográfico para mejorar acierto
  const locality = it.locality?.trim() || "San Martín";
  const q = `${base}, ${locality}, Buenos Aires, Argentina`.replace(/\s+/g, " ").trim();
  return q;
}

function mapsUrlFor(it: Item) {
  if (typeof it.lat === "number" && typeof it.lon === "number")
    return `https://www.google.com/maps?q=${it.lat},${it.lon}`;
  const addr = it.address || it.address_kmz || "";
  return addr ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}` : null;
}

async function geocode(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": `sanmartin-catalog/1.0 (${EMAIL})`,
      "Accept-Language": "es",
    },
  });
  if (!res.ok) return null;
  const arr = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!arr?.length) return null;
  return { lat: Number(arr[0].lat), lon: Number(arr[0].lon) };
}

async function main() {
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error("No existe src/app/(data)/catalog.json");
    process.exit(1);
  }
  const raw = fs.readFileSync(CATALOG_PATH, "utf-8");
  const data: Item[] = JSON.parse(raw);

  const cache: Cache = fs.existsSync(CACHE_PATH)
    ? JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"))
    : {};

  let updated = 0, skipped = 0, errors = 0, hits = 0, reqs = 0;

  // backup
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(data, null, 2), "utf-8");

  for (let i = 0; i < data.length; i++) {
    const it = data[i];

    // ya tiene coords → saltear
    if (typeof it.lat === "number" && typeof it.lon === "number") { skipped++; continue; }

    const q = buildQuery(it);
    if (!q) { skipped++; continue; }

    if (cache[q]) {
      // cache hit
      it.lat = cache[q].lat;
      it.lon = cache[q].lon;
      it.geo_source = it.geo_source || "geocode";
      hits++; updated++;
      continue;
    }

    // respetar rate limit (1 req/seg)
    await sleep(1100);
    try {
      const res = await geocode(q);
      reqs++;
      if (res) {
        cache[q] = res;
        it.lat = res.lat;
        it.lon = res.lon;
        it.geo_source = it.geo_source || "geocode";
        updated++;
      }
    } catch (e) {
      errors++;
      if (process.env.DEBUG) console.error("Error geocoding:", q, e);
    }

    // flush cache progresivo cada 20
    if ((i % 20) === 0) {
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
    }
  }

  // maps_url
  for (const it of data) {
    it.maps_url = mapsUrlFor(it) ?? it.maps_url ?? null;
  }

  // persistir
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(data, null, 2), "utf-8");

  console.log(JSON.stringify({ total: data.length, updated, skipped, errors, cacheHits: hits, requests: reqs }, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
