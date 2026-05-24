"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Modal genérico con overlay, escape y footer opcional.
 *
 * Se usa como base para detalles de productos y confirmaciones, evitando
 * repetir la misma estructura de diálogo en múltiples lugares.
 */
export function Modal({ open, title, onClose, children, footer, className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onMouseDown={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-2xl bg-(--panel) ring-1 ring-white/10",
          "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
          "motion-safe:animate-[cb-pop_180ms_ease-out]",
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
            ) : null}
          </div>
          <button
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
