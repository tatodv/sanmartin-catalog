"use client";
import * as React from "react";

export default function MapModal({ open, address, onClose }: { open: boolean; address?: string; onClose: () => void }) {
  React.useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;
  const q = encodeURIComponent(address || "San Martín, Buenos Aires, Argentina");
  const src = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-lg bg-card shadow-xl overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-sm font-semibold">Cómo llegar</h3>
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onClose}>Cerrar</button>
          </header>
          <div className="aspect-video w-full">
            <iframe title="Mapa" src={src} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </div>
  );
}
