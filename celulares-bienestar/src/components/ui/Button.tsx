import type * as React from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";

/**
 * Botón base del sistema.
 *
 * Concentrar estilos y variantes en un solo componente evita duplicar clases y
 * facilita que el diseño completo conserve una misma voz visual.
 */
export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-sky-600 text-white hover:bg-sky-700",
        variant === "secondary" &&
          "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
        variant === "danger" &&
          "bg-rose-600 text-white hover:bg-rose-700",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}
