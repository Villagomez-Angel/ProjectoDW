import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

/**
 * Landing simple del sistema.
 *
 * Funciona como punto de entrada visual hacia inventario, alta y la página
 * institucional, manteniendo una jerarquía muy ligera.
 */
export default function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <PageHeader
        eyebrow="Dashboard"
        title="Celulares Bienestar"
        description="Sistema de inventario pensado para una tienda tecnológica: rápido, ordenado y agradable de usar."
        className="lg:col-span-2"
      />

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/inventario"
            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
          >
            <div className="text-sm font-semibold text-slate-900">Inventario</div>
            <div className="mt-1 text-xs text-slate-600">Explora, busca y ordena tus productos.</div>
          </Link>
          <Link
            href="/alta"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white"
          >
            <div className="text-sm font-semibold text-slate-900">Alta de celulares</div>
            <div className="mt-1 text-xs text-slate-600">Registra o edita información en segundos.</div>
          </Link>
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-slate-900">Accesos</h2>
        <div className="mt-4 grid gap-3">
          <Link
            href="/about"
            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
          >
            <div className="text-sm font-semibold text-slate-900">Acerca de nosotros</div>
            <div className="mt-1 text-xs text-slate-600">Conoce la misión y el servicio.</div>
          </Link>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold text-slate-500">Tip</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              El menú lateral se expande al acercar el cursor al borde izquierdo.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
