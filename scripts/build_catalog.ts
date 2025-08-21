/// <reference types="node" />
import fs from "node:fs";
import path from "node:path";
import type { Item } from "@/lib/types";
import { enrich } from "@/lib/classify";
import overrides from "@/app/(data)/overrides.json";

const CAT = path.join(process.cwd(), "app", "(data)", "catalog.json");
const OUT = CAT; // sobreescribe con enriquecido

function main() {
  const raw = fs.readFileSync(CAT, "utf8");
  // Limpieza de BOM y espacios extraños que rompen JSON.parse
  const cleaned = raw.replace(/^\uFEFF/, "").trim();
  const data = JSON.parse(cleaned) as Item[];

  function keyOf(it: Item) {
    return [it.provider_name, it.program_name ?? "", it.unit ?? ""].join("|");
  }

  const out = data.map(enrich).map(it => {
    const k = keyOf(it);
    // @ts-ignore - estructura simple de overrides
    if ((overrides as any).byKey?.[k]) {
      // @ts-ignore
      return { ...it, ...(overrides as any).byKey[k] } as Item;
    }
    return it;
  });

  // Validaciones mínimas
  const missingProvider = out.filter(x => !x.provider_name);
  const dupKeys = new Set<string>();
  const ids = new Set<string>();
  for (const it of out) {
    const key = (it.provider_name + "|" + (it.program_name ?? "") + "|" + (it.unit ?? "")).toLowerCase();
    if (ids.has(key)) dupKeys.add(key); else ids.add(key);
  }

  const report = {
    total: out.length,
    withLevel: out.filter(x => x.level_norm).length,
    withFamily: out.filter(x => x.family).length,
    missingProvider: missingProvider.length,
    dupKeys: dupKeys.size
  };
  console.log(report);

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf-8");
}

main();


