import type * as React from "react";
import { cn } from "@/utils/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/**
 * Encabezado decorativo reutilizable para las páginas.
 *
 * Da identidad visual al contenido sin ocupar demasiado espacio y ayuda a que
 * cada pantalla tenga una jerarquía clara: subtítulo, título y contexto.
 */
export function PageHeader({ eyebrow, title, description, action, className }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/90 to-blue-50/70 px-6 py-5 shadow-sm backdrop-blur",
        "sm:px-8 sm:py-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-600 shadow-[0_0_18px_rgba(37,99,235,0.32)]" />
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
            ) : null}
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.95rem]">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-[0.96rem]">
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}