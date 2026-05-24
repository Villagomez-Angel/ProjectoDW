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
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onMouseDown={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 shadow-[0_20px_60px_rgba(15,23,42,0.10)]",
          "motion-safe:animate-[cb-pop_180ms_ease-out]",
          className
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 bg-white/70">
          <div className="min-w-0">
            {title ? (
              <h2 className="truncate text-base font-semibold text-slate-900">{title}</h2>
            ) : null}
          </div>
          <button
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            aria-label="Cerrar"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white/70 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
