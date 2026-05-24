import type * as React from "react";
import { cn } from "@/utils/cn";

/**
 * Textarea base para descripciones largas y notas de negocio.
 *
 * Mantiene la misma jerarquía visual que el resto de controles del sistema.
 */
export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none rounded-xl bg-white/5 px-3 py-2 text-sm text-foreground ring-1 ring-white/10",
        "placeholder:text-white/35",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/60",
        className
      )}
      {...props}
    />
  );
}
