import type { Program } from "@/types/program";
import HomeClient from "../components/HomeClient";

export const dynamic = "force-static";

export default async function HomePage() {
  const data = await import("./(data)/catalog.json");
  const items = data.default as Program[];
  return <HomeClient items={items} />;
}

