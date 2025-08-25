// /src/main.ts
import { normalizeItem, applyFilters, buildFacets } from "./lib/filters";

type Selected = {
  level: Set<string>;
  barrio: Set<string>;
  unidad: Set<string>;
  titulo: Set<string>;
  text: string;
};

let RAW: any[] = [];
let DATA: any[] = [];
let selected: Selected = {
  level: new Set(),
  barrio: new Set(),
  unidad: new Set(),
  titulo: new Set(),
  text: "",
};

async function load() {
  const res = await fetch("/catalog.json");
  RAW = await res.json();
  DATA = RAW.map(normalizeItem);
  render();
  wireUI();
}

function render() {
  const filtered = applyFilters(DATA, selected);
  const facets = buildFacets(DATA, selected);

  renderCounts(facets);
  renderResults(filtered);

  const countEl = document.querySelector("#result-count");
  if (countEl) countEl.textContent = `Mostrando ${filtered.length} de ${DATA.length} ofertas`;
}

function toggle(set: Set<string>, value: string) {
  if (set.has(value)) set.delete(value);
  else set.add(value);
}

function wireUI() {
  document.addEventListener("change", (e) => {
    const el = e.target as HTMLElement;
    if (el && el.matches?.("[data-facet]")) {
      const facet = (el as HTMLElement).getAttribute("data-facet") as keyof Selected;
      const value = (el as HTMLElement).getAttribute("data-value") || "";
      if (!facet || !value) return;
      // @ts-ignore
      toggle(selected[facet], value);
      render();
    }
  });

  const input = document.querySelector<HTMLInputElement>("#search");
  input?.addEventListener("input", (e) => {
    selected.text = (e.target as HTMLInputElement).value;
    render();
  });

  const clear = document.querySelector("#clear-filters");
  clear?.addEventListener("click", () => {
    selected = { level: new Set(), barrio: new Set(), unidad: new Set(), titulo: new Set(), text: "" };
    render();
  });
}

function renderCounts(facets: any) {
  // Implementación de ejemplo: actualizar listas de facetas
}
function renderResults(list: any[]) {
  // Implementación de ejemplo: renderizar resultados
}

load();
