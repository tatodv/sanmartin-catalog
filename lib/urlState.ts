export type FilterState = {
  q?: string;
  level_norm?: string;
  family?: string;
  barrio?: string;
  provider_name?: string;
  unit?: string;
  title?: string;
};

const map = { q:"q", level_norm:"lvl", family:"fam", barrio:"bar", provider_name:"prov", unit:"unit", title:"tit" } as const;

export function encodeFilters(f: FilterState) {
  const sp = new URLSearchParams();
  (Object.keys(map) as (keyof FilterState)[]).forEach(k => {
    const v = f[k]; if (v) sp.set(map[k as keyof typeof map], v);
  });
  return sp.toString();
}

export function decodeFilters(sp: URLSearchParams): FilterState {
  const out: FilterState = {};
  (Object.keys(map) as (keyof FilterState)[]).forEach(k => {
    const v = sp.get(map[k as keyof typeof map]); if (v) (out as any)[k] = v;
  });
  return out;
}
