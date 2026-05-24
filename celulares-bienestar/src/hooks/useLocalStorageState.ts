"use client";

import * as React from "react";

/**
 * Sincroniza un valor con localStorage sin perder la simplicidad de useState.
 *
 * Primero renderiza con el valor inicial para que SSR y cliente coincidan, y
 * después carga el estado guardado en el navegador sin provocar hydration
 * mismatch. Es útil para mantener el inventario entre recargas sin introducir
 * un store externo más pesado.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = React.useState<T>(initialValue);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw != null) setState(JSON.parse(raw) as T);
      } catch {
        // ignore corrupt storage
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [key]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or blocked
    }
  }, [hydrated, key, state]);

  return { state, setState, hydrated } as const;
}
