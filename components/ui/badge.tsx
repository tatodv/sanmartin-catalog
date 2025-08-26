import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("inline-block rounded-full border px-2 py-0.5 text-xs font-medium", className)} {...props} />;
}
