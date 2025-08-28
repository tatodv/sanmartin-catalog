import data from "../(data)/catalog.json";
import ProgramCard from "@/components/ProgramCard";
import type { Program } from "@/types/program";

export const dynamic = "force-static";

export default function CatalogPage() {
  const items = data as Program[];
  return (
    <main className="p-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => <ProgramCard key={p.id} program={p} />)}
    </main>
  );
}
