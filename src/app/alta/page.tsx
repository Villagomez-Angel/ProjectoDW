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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Cargando…</div>
          <div className="mt-1 text-sm text-slate-600">Preparando el formulario.</div>
        </div>
      }
    >
      <AltaClient />
    </Suspense>
  );
}
