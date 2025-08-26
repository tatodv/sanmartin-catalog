"use client";

import * as React from "react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onApply?: () => void;
  onClear?: () => void;
  children: React.ReactNode;
};

export default function MobileFiltersDrawer({
  open,
  title = "Filtros",
  onClose,
  onApply,
  onClear,
  children,
}: Props) {
  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        data-state={open ? "open" : "closed"}
        className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100 lg:hidden"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        data-state={open ? "open" : "closed"}
        className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm h-[100svh] bg-card shadow-xl overflow-y-auto transition-transform will-change-transform data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 lg:hidden"
      >
        <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <h2 id="filters-title" className="text-sm font-semibold">{title}</h2>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onClose} aria-label="Cerrar filtros">Cerrar</button>
        </header>

        <div className="px-4 py-4">{children}</div>

        <footer className="sticky bottom-0 bg-card/95 backdrop-blur border-t p-3 flex gap-2">
          {onClear && (
            <button className="w-1/2 rounded-md border px-3 py-2 text-sm hover:bg-muted" onClick={onClear}>Limpiar</button>
          )}
          {onApply && (
            <button className="w-1/2 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90" onClick={onApply}>Aplicar</button>
          )}
        </footer>
      </aside>
    </>
  );
}
