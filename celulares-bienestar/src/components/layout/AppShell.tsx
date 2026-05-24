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
    <div className="min-h-dvh bg-[radial-gradient(900px_500px_at_0%_0%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(900px_500px_at_100%_20%,rgba(59,130,246,0.10),transparent_55%),var(--bg)]">
      <Sidebar />
      <div className="relative">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
