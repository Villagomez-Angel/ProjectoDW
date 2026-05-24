import type * as React from "react";
import { cn } from "@/utils/cn";

/**
 * Input base reutilizable.
 *
 * Centraliza la apariencia de todos los campos de texto del sistema para que
 * el diseño se mantenga consistente en inventario, alta y futuros formularios.
 */
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 shadow-sm transition",
        "placeholder:text-slate-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/60",
        className
      )}
      {...props}
    />
  );
}
