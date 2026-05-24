"use client";

import * as React from "react";

/**
 * Sincroniza un valor con localStorage sin perder la simplicidad de useState.
 *
 * Se inicializa leyendo del navegador y luego persiste cada cambio de estado.
 * Es útil para mantener el inventario entre recargas sin introducir un store
 * externo más pesado.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = React.useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw) as T;
    } catch {
      // ignore corrupt storage
    }
    return initialValue;
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or blocked
    }
  }, [key, state]);

  return { state, setState, hydrated: true } as const;
}
