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
        "h-11 w-full rounded-xl bg-white/5 px-3 text-sm text-foreground ring-1 ring-white/10",
        "placeholder:text-white/35",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/60",
        className
      )}
      {...props}
    />
  );
}
