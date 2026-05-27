"use client";

import * as React from "react";
import type { Phone, PhoneDraft, PhoneId } from "@/types/inventory";
import {
  createPhone as createPhoneAction,
  deletePhone as deletePhoneAction,
  importPhones as importPhonesAction,
  listPhones as listPhonesAction,
  updatePhone as updatePhoneAction,
} from "@/app/actions/inventory";

type SortMode = "ASC" | "DESC" | "PRICE_ASC" | "PRICE_DESC";

type InventoryContextValue = {
  phones: Phone[];
  loading: boolean;

  createPhone: (draft: PhoneDraft) => Promise<Phone>;
  updatePhone: (id: PhoneId, draft: PhoneDraft) => Promise<Phone>;
  deletePhone: (id: PhoneId) => Promise<void>;

  getPhoneById: (id: PhoneId) => Phone | undefined;

  cartItems: Phone[];
  addToCart: (phone: Phone) => void;
  removeFromCart: (id: PhoneId) => void;
  clearCart: () => void;

  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  query: string;
  setQuery: (value: string) => void;
};

const InventoryContext = React.createContext<InventoryContextValue | null>(null);

/**
 * Provider del inventario.
 *
 * Centraliza CRUD, búsqueda y ordenamiento para que las páginas no manejen
 * lógica de dominio directamente y puedan enfocarse en la UI.
 */
export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [phones, setPhones] = React.useState<Phone[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [sortMode, setSortMode] = React.useState<SortMode>("ASC");
  const [query, setQuery] = React.useState("");
  const [cartItems, setCartItems] = React.useState<Phone[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("cb.cart.v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Phone[];
      if (Array.isArray(parsed)) {
        setCartItems(parsed);
      }
    } catch {
      // ignore invalid local storage
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cb.cart.v1", JSON.stringify(cartItems));
  }, [cartItems]);

  React.useEffect(() => {
    let active = true;

    const migrateLocalInventory = async () => {
      if (typeof window === "undefined") return;
      const key = "cb.inventory.v1";
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as Phone[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          await importPhonesAction(parsed);
        }
      } catch {
        // Ignorará el entorno local si el formato es inválido o la importación falla, para evitar bloquear la app.
      } finally {
        window.localStorage.removeItem(key);
      }
    };

    const load = async () => {
      setLoading(true);
      try {
        await migrateLocalInventory();
        const data = await listPhonesAction();
        if (active) setPhones(data);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const createPhone = React.useCallback(
    async (draft: PhoneDraft) => {
      const created = await createPhoneAction(draft);
      setPhones((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updatePhone = React.useCallback(
    async (id: PhoneId, draft: PhoneDraft) => {
      const updated = await updatePhoneAction(id, draft);
      setPhones((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    },
    []
  );

  const deletePhone = React.useCallback(
    async (id: PhoneId) => {
      await deletePhoneAction(id);
      setPhones((prev) => prev.filter((p) => p.id !== id));
    },
    []
  );

  const getPhoneById = React.useCallback(
    (id: PhoneId) => {
      return phones.find((p) => p.id === id);
    },
    [phones]
  );

  const addToCart = React.useCallback((phone: Phone) => {
    setCartItems((prev) => {
      if (prev.some((item) => item.id === phone.id)) return prev;
      return [...prev, phone];
    });
  }, []);

  const removeFromCart = React.useCallback((id: PhoneId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  const value: InventoryContextValue = {
    phones,
    loading,
    createPhone,
    updatePhone,
    deletePhone,
    getPhoneById,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
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
