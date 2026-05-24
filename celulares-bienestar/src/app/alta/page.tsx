import { Suspense } from "react";
import AltaClient from "@/app/alta/AltaClient";

/**
 * Página server que envuelve el formulario de alta en Suspense.
 *
 * Esta capa existe para cumplir con las restricciones de renderizado de
 * `useSearchParams` durante el build estático.
 */
export default function AltaPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white">Cargando…</div>
          <div className="mt-1 text-sm text-white/60">Preparando el formulario.</div>
        </div>
      }
    >
      <AltaClient />
    </Suspense>
  );
}
