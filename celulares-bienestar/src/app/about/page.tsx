import Link from "next/link";

const stats = [
  { label: "Años atendiendo", value: "8+" },
  { label: "Reparaciones al mes", value: "120+" },
  { label: "Modelos en catálogo", value: "250+" },
] as const;

const cards = [
  {
    title: "Venta y financiamiento",
    body: "Trabajamos con marcas líderes y opciones de pago flexibles. Te ayudamos a elegir el equipo ideal según tu uso real.",
  },
  {
    title: "Servicio técnico",
    body: "Diagnóstico transparente, refacciones confiables y respaldo post-servicio. Pantallas, baterías, puertos y más.",
  },
  {
    title: "Accesorios",
    body: "Fundas, cargadores, micas, audífonos y gadgets para mantener tu equipo protegido y listo para el día a día.",
  },
] as const;

/**
 * Página institucional con narrativa de marca y bloques informativos.
 *
 * Sirve para mostrar una presencia más real del negocio y complementar el
 * flujo operativo del inventario.
 */
export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10 sm:p-8">
        <p className="text-xs font-semibold tracking-wider text-white/50">ACERCA DE</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Celulares Bienestar</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
          Somos una tienda tecnológica enfocada en smartphones y soluciones reales: venta, reparación y accesorios.
          Nuestra prioridad es que te lleves un equipo que se sienta rápido, confiable y a tu medida.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-2xl font-semibold text-white">{s.value}</div>
              <div className="mt-1 text-xs font-semibold text-white/45">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">{c.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{c.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10 sm:p-8">
        <h2 className="text-sm font-semibold text-white">Misión</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Hacer que la tecnología se sienta simple: asesoría honesta, inventario ordenado y servicio rápido.
        </p>
        <h2 className="mt-6 text-sm font-semibold text-white">Visión</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Convertirnos en la tienda de confianza del barrio para celulares, reparación y accesorios, manteniendo siempre una
          experiencia moderna y transparente.
        </p>

        <div className="mt-6">
          <Link
            href="/inventario"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/8"
          >
            Ir al inventario →
          </Link>
        </div>
      </section>
    </div>
  );
}
