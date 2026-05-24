"use client";

import * as React from "react";
import type { Phone, PhoneDraft, PhoneId } from "@/types/inventory";
import { seedPhones } from "@/data/seedPhones";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type SortMode = "ASC" | "DESC" | "PRICE_ASC" | "PRICE_DESC";

type InventoryContextValue = {
  phones: Phone[];
  hydrated: boolean;

  createPhone: (draft: PhoneDraft) => Phone;
  updatePhone: (id: PhoneId, draft: PhoneDraft) => void;
  deletePhone: (id: PhoneId) => void;

  getPhoneById: (id: PhoneId) => Phone | undefined;

  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  query: string;
  setQuery: (value: string) => void;
};

const InventoryContext = React.createContext<InventoryContextValue | null>(null);

/**
 * Genera IDs seguros para productos nuevos.
 *
 * Usa `crypto.randomUUID()` cuando está disponible y cae a un identificador
 * derivado de tiempo + aleatoriedad como respaldo para entornos antiguos.
 */
function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Provider del inventario.
 *
 * Centraliza CRUD, búsqueda y ordenamiento para que las páginas no manejen
 * lógica de dominio directamente y puedan enfocarse en la UI.
 */
export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { state: phones, setState: setPhones, hydrated } = useLocalStorageState<Phone[]>(
    "cb.inventory.v1",
    seedPhones
  );

  const [sortMode, setSortMode] = React.useState<SortMode>("ASC");
  const [query, setQuery] = React.useState("");

  const createPhone = React.useCallback(
    (draft: PhoneDraft) => {
      const created: Phone = { id: generateId(), ...draft };
      setPhones((prev) => [created, ...prev]);
      return created;
    },
    [setPhones]
  );

  const updatePhone = React.useCallback(
    (id: PhoneId, draft: PhoneDraft) => {
      setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, ...draft, id } : p)));
    },
    [setPhones]
  );

  const deletePhone = React.useCallback(
    (id: PhoneId) => {
      setPhones((prev) => prev.filter((p) => p.id !== id));
    },
    [setPhones]
  );

  const getPhoneById = React.useCallback(
    (id: PhoneId) => {
      return phones.find((p) => p.id === id);
    },
    [phones]
  );

  const value: InventoryContextValue = {
    phones,
    hydrated,
    createPhone,
    updatePhone,
    deletePhone,
    getPhoneById,
    sortMode,
    setSortMode,
    query,
    setQuery,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

/**
 * Hook de acceso al estado del inventario.
 *
 * Obliga a consumir el contexto dentro del provider correcto y evita errores
 * silenciosos cuando una pantalla intenta usar inventario fuera de la app.
 */
export function useInventory() {
  const ctx = React.useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}

export type { SortMode };
