import React from "react";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white border border-slate-200 rounded-lg", className)}>{children}</div>;
}
