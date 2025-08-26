"use client";
import * as React from "react";

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className="border-b last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3 text-sm font-medium"
      >
        <span>{title}</span>
        <span className="text-muted-foreground">{open ? "–" : "+"}</span>
      </button>
      <div className={open ? "pb-3 space-y-2" : "hidden"}>{children}</div>
    </section>
  );
}
