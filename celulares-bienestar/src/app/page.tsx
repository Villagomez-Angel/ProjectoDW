import Link from "next/link";

/**
 * Landing simple del sistema.
 *
 * Funciona como punto de entrada visual hacia inventario, alta y la página
 * institucional, manteniendo una jerarquía muy ligera.
 */
export default function HomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10 sm:p-8">
        <p className="text-xs font-semibold tracking-wider text-white/50">DASHBOARD</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-white sm:text-4xl">
          Celulares Bienestar
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/70">
          Sistema de inventario pensado para una tienda tecnológica: rápido, ordenado y agradable de usar.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/inventario"
            className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/8"
          >
            <div className="text-sm font-semibold text-white">Inventario</div>
            <div className="mt-1 text-xs text-white/55">Explora, busca y ordena tus productos.</div>
          </Link>
          <Link
            href="/alta"
            className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/8"
          >
            <div className="text-sm font-semibold text-white">Alta de celulares</div>
            <div className="mt-1 text-xs text-white/55">Registra o edita información en segundos.</div>
          </Link>
        </div>
      </section>

      <aside className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10 sm:p-8">
        <h2 className="text-sm font-semibold text-white">Accesos</h2>
        <div className="mt-4 grid gap-3">
          <Link
            href="/about"
            className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/8"
          >
            <div className="text-sm font-semibold text-white">Acerca de nosotros</div>
            <div className="mt-1 text-xs text-white/55">Conoce la misión y el servicio.</div>
          </Link>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white/45">Tip</div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              El menú lateral se expande al acercar el cursor al borde izquierdo.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
