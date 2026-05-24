import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

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
      <PageHeader
        eyebrow="Acerca de nosotros"
        title="Tecnología, servicio y confianza"
        description="Somos una tienda tecnológica enfocada en smartphones y soluciones reales: venta, reparación y accesorios. Nuestra prioridad es que te lleves un equipo que se sienta rápido, confiable y a tu medida."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
            <div className="text-2xl font-semibold text-slate-900">{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">{c.title}</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold text-slate-500">Misión</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Hacer que la tecnología se sienta simple: asesoría honesta, inventario ordenado y servicio rápido.
        </p>
        <h2 className="mt-6 text-sm font-semibold text-slate-500">Visión</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Convertirnos en la tienda de confianza del barrio para celulares, reparación y accesorios, manteniendo siempre una
          experiencia moderna y transparente.
        </p>

        <div className="mt-6">
          <Link
            href="/inventario"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Ir al inventario →
          </Link>
        </div>
      </section>
    </div>
  );
}
