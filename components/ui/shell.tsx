import React from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-800">{children}</div>;
}
