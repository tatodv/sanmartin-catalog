"use client";

export function Accordion({
  title, badge, children, defaultOpen = false
}: { title: string; badge?: string | number; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-sm" {...(defaultOpen ? { open: true } : {})}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl p-3">
        <div className="font-medium text-slate-900">{title}</div>
        {badge !== undefined && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{badge}</span>
        )}
      </summary>
      <div className="border-t border-slate-100 p-3">{children}</div>
    </details>
  );
}


