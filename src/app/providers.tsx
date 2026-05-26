"use client";

import type * as React from "react";
import { InventoryProvider } from "@/context/InventoryContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Envoltorio único de providers de la aplicación.
 *
 * Facilita agregar nuevos contextos globales sin ensuciar el layout raíz.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      {children}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </InventoryProvider>
  );
}
