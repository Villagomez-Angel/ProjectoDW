import type * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";

/**
 * Contenedor estructural de la app.
 *
 * Mantiene el sidebar fijo y el contenido principal independiente para que el
 * menú nunca empuje el layout ni rompa el flujo visual.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(900px_500px_at_0%_0%,rgba(255,255,255,0.34),transparent_52%),radial-gradient(800px_420px_at_100%_12%,rgba(96,165,250,0.30),transparent_48%),radial-gradient(700px_360px_at_30%_100%,rgba(56,189,248,0.22),transparent_44%),linear-gradient(180deg,rgba(199,233,255,0.92),rgba(212,238,255,0.98)),var(--bg)]">
      <Sidebar />
      <div className="relative">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:pl-10">
          {children}
        </main>
      </div>
    </div>
  );
}
