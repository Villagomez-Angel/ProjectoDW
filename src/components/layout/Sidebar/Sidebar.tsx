"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const nav = [
  { href: "/inventario", label: "Inventario" },
  { href: "/alta", label: "Alta de celulares" },
  { href: "/about", label: "Acerca de nosotros" },
] as const;

/**
 * Sidebar lateral fijo con comportamiento de expansión por hover o toque.
 *
 * El borde luminoso funciona como pista visual cuando el menú está colapsado,
 * pero la navegación completa aparece sin desplazar el contenido principal.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [pinnedOpen, setPinnedOpen] = React.useState(false);

  return (
    <aside
      className={cn(
        "group fixed left-0 top-0 z-40 h-dvh w-[280px] overflow-visible",
        "transition-transform duration-300 ease-out",
        pinnedOpen
          ? "translate-x-0"
          : "-translate-x-[236px] sm:-translate-x-[260px] hover:translate-x-0 focus-within:translate-x-0"
      )}
      aria-label="Menú lateral"
    >
      {/* blue sticker that highlights the sidebar edge */}
      <div className="absolute -right-12 -top-1 h-16 w-16 sm:-right-14 sm:-top-2 sm:h-[72px] sm:w-18">
        <button
          type="button"
          aria-label={pinnedOpen ? "Cerrar menú" : "Abrir menú"}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-l-2xl rounded-r-xl border border-sky-200",
            "bg-sky-600 text-white shadow-[0_18px_40px_rgba(37,99,235,0.42)] transition hover:-translate-y-0.5 hover:bg-sky-500"
          )}
          onClick={() => setPinnedOpen((v) => !v)}
        />
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-l-2xl bg-sky-300/85" />
        <span className="pointer-events-none absolute left-1/2 top-4 h-0.5 w-5 -translate-x-1/2 rounded-full bg-white/95 shadow-sm sm:top-5 sm:w-6" />
        <span className="pointer-events-none absolute left-1/2 top-7 h-0.5 w-4 -translate-x-1/2 rounded-full bg-white/95 shadow-sm sm:top-8 sm:w-5" />
        <span className="pointer-events-none absolute left-1/2 top-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-white/95 shadow-sm sm:top-11 sm:w-6" />
      </div>

      <div className="h-full w-full border-r border-sky-100 bg-gradient-to-b from-sky-50/95 via-sky-100/85 to-blue-100/80 backdrop-blur-md shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="px-5 py-5 pr-16">
          <div className="text-sm font-semibold tracking-wide text-slate-900">Celulares Bienestar</div>
          <div className="mt-1 text-xs text-slate-500">Inventario · Ventas · Servicio</div>
        </div>

        <nav className="px-3 pb-5">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                      active
                        ? "bg-white/80 text-slate-900 ring-1 ring-white/70"
                        : "text-slate-700 hover:bg-white/55 hover:text-slate-900"
                    )}
                    onClick={() => setPinnedOpen(false)}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        active ? "bg-sky-700" : "bg-sky-200"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
