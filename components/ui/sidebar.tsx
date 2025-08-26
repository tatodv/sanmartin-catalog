import React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <aside className={cn("w-64 shrink-0 bg-white border-r border-slate-200 p-4", className)}>{children}</aside>;
}
