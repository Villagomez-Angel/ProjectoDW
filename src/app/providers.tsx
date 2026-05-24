"use client";

import type * as React from "react";
import { InventoryProvider } from "@/context/InventoryContext";

/**
 * Envoltorio único de providers de la aplicación.
 *
 * Facilita agregar nuevos contextos globales sin ensuciar el layout raíz.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <InventoryProvider>{children}</InventoryProvider>;
}
