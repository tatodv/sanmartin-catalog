import type { Program } from "@/types/program";
import HomeClient from "../../components/HomeClient";
import OnboardingHome from "@/components/OnboardingHome";

export const dynamic = "force-static";

export default async function ClonePage() {
  const data = await import("../(data)/catalog.json");
  const items = data.default as Program[];
  const m = new Map<string, number>();
  for (const it of items) { const k = (it.degree_title || "Otro").trim(); if (!k) continue; m.set(k, (m.get(k) || 0) + 1); }
  const typeCounts = Array.from(m.entries()).map(([label, count]) => ({ label, count }));
  return (
    <>
      <OnboardingHome types={typeCounts} />
      <HomeClient items={items} />
    </>
  );
}


