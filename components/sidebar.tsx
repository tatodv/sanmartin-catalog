// Adaptador para mantener compatibilidad con imports antiguos:
// "@/components/Sidebar" → reexporta tu Sidebar real (FiltersSidebar).

export { default } from "./FiltersSidebar";
export { FiltersSidebar as Sidebar } from "./FiltersSidebar";
export * from "./FiltersSidebar";
