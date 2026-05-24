import type * as React from "react";
import { cn } from "@/utils/cn";

/**
 * Select estilizado para el panel de inventario.
 *
 * Se apoya en el tema oscuro del proyecto para evitar el contraste pobre
 * de los elementos nativos del sistema operativo cuando el menú se despliega.
 */
export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 shadow-sm transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/60",
        className
      )}
      style={{ colorScheme: "light" }}
      {...props}
    />
  );
}
