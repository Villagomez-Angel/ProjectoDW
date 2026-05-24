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
        "group fixed left-0 top-0 z-40 h-dvh w-[280px]",
        "transition-transform duration-300 ease-out",
        pinnedOpen
          ? "translate-x-0"
          : "-translate-x-[236px] sm:-translate-x-[260px] hover:translate-x-0 focus-within:translate-x-0"
      )}
      aria-label="Menú lateral"
    >
      {/* glow rail visible when collapsed */}
      <div className="absolute right-0 top-0 h-full w-11 sm:w-5">
        <div className="mx-auto h-full w-[3px] bg-[var(--accent)] opacity-80 shadow-[0_0_18px_rgba(34,211,238,0.65)]" />
        <button
          type="button"
          aria-label={pinnedOpen ? "Cerrar menú" : "Abrir menú"}
          className="absolute inset-0 rounded-l-xl bg-transparent"
          onClick={() => setPinnedOpen((v) => !v)}
        />
      </div>

      <div className="h-full w-full bg-[var(--panel)]/95 backdrop-blur-md ring-1 ring-white/10">
        <div className="px-5 py-5">
          <div className="text-sm font-semibold tracking-wide text-white/90">Celulares Bienestar</div>
          <div className="mt-1 text-xs text-white/50">Inventario · Ventas · Servicio</div>
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
                        ? "bg-white/8 text-white ring-1 ring-white/10"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => setPinnedOpen(false)}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        active ? "bg-[var(--accent)]" : "bg-white/25"
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
