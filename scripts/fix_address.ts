import fs from "node:fs";
import path from "node:path";

type Row = Record<string, any>;

const TARGET_ADDRESS = "Av. 25 de Mayo 1169, B1650 San Martín, Provincia de Buenos Aires";
const TARGET_PLACE = "UNSAM";
const TARGET_BARRIO = "San Martín";

function fixFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[skip] No existe: ${filePath}`);
    return { filePath, total: 0, changed: 0 };
  }
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();
  const data = JSON.parse(raw) as Row[];

  let changed = 0;
  for (const it of data) {
    const isProviderEqualsAddress = it && typeof it === "object" && it.provider_name === TARGET_ADDRESS;
    const isAddressMatch = it && typeof it === "object" && it.address === TARGET_ADDRESS;

    if (isProviderEqualsAddress || isAddressMatch) {
      // Asegurar address correcto
      it.address = TARGET_ADDRESS;
      // Nombre del lugar estandarizado
      it.provider_name = TARGET_PLACE;
      // Barrio por defecto
      if (!it.barrio || String(it.barrio).trim() === "") {
        it.barrio = TARGET_BARRIO;
      }
      changed++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return { filePath, total: data.length, changed };
}

function main() {
  const files = [
    path.join(process.cwd(), "data", "catalog-master.json"),
    path.join(process.cwd(), "app", "(data)", "catalog-master.json"),
  ];

  const results = files.map(fixFile);
  for (const r of results) {
    console.log(`[fixed] ${r.filePath} → cambios: ${r.changed}/${r.total}`);
  }
}

main();


