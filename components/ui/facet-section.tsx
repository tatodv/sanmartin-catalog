"use client";
import * as React from "react";

type Props = {
  title: string;
  count?: number | string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  hideTitle?: boolean;
};

export default function FacetSection({
  title,
  count,
  defaultOpen = false,
  children,
  className = "",
  hideTitle = false,
}: Props) {
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();

  // Si hideTitle está activo, no renderizamos el header externo
  if (hideTitle) {
    return (
      <section className={`border-b last:border-b-0 ${className}`}>
        <div className="pb-3 space-y-2">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={`border-b last:border-b-0 ${className}`}>
      <h3 id={`facet-${id}-label`} className="sr-only">
        {title}
      </h3>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={`facet-${id}-content`}
        aria-labelledby={`facet-${id}-label`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-3 text-sm font-medium text-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <span className="flex items-center gap-2">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className={`transition-transform duration-200 text-muted-foreground ${open ? "rotate-90" : ""}`}
            aria-hidden="true"
          >
            <polygon points="2,1 8,5 2,9" fill="currentColor" />
          </svg>
          {!hideTitle && title ? <span>{title}</span> : null}
        </span>

        {typeof count !== "undefined" && (
          <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        )}
      </button>

      <div
        id={`facet-${id}-content`}
        role="region"
        aria-labelledby={`facet-${id}-label`}
        className={open ? "pb-3 space-y-2" : "hidden"}
      >
        {children}
      </div>
    </section>
  );
}
