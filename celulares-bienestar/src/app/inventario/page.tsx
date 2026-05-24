"use client";

import * as React from "react";
import { PhoneCard } from "@/components/inventory/PhoneCard";
import { PhoneDetailsModal } from "@/components/inventory/PhoneDetailsModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useInventory, type SortMode } from "@/context/InventoryContext";
import type { Phone } from "@/types/inventory";

/**
 * Normaliza texto libre para búsquedas insensibles a mayúsculas y espacios.
 */
function normalize(value: string) {
  return value.trim().toLowerCase();
}

/**
 * Ordena una copia del inventario sin mutar el arreglo original.
 *
 * Así el ordenamiento no afecta el estado compartido y la UI puede combinarse
 * libremente con búsqueda, filtrado y otras vistas derivadas.
 */
function sortPhones(phones: Phone[], mode: SortMode) {
  const copy = [...phones];
  switch (mode) {
    case "ASC":
      copy.sort((a, b) => `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`));
      break;
    case "DESC":
      copy.sort((a, b) => `${b.marca} ${b.modelo}`.localeCompare(`${a.marca} ${a.modelo}`));
      break;
    case "PRICE_ASC":
      copy.sort((a, b) => a.precio - b.precio);
      break;
    case "PRICE_DESC":
      copy.sort((a, b) => b.precio - a.precio);
      break;
  }
  return copy;
}

export default function InventarioPage() {
  const { phones, sortMode, setSortMode, query, setQuery } = useInventory();
  const [selected, setSelected] = React.useState<Phone | null>(null);
  const [open, setOpen] = React.useState(false);

  const q = normalize(query);
  const filtered = React.useMemo(() => {
    const base = q
      ? phones.filter((p) => {
          const hay = `${p.marca} ${p.modelo} ${p.descripcion}`.toLowerCase();
          return hay.includes(q);
        })
      : phones;
    return sortPhones(base, sortMode);
  }, [phones, q, sortMode]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Inventario</h1>
        <p className="mt-1 text-sm text-white/60">
          Panel de control + tarjetas responsivas. Todo el contenido se mantiene estable.
        </p>
      </header>

      {/* DIV SUPERIOR: toolbar */}
      <section className="rounded-2xl bg-white/3 p-4 ring-1 ring-white/10 backdrop-blur-sm">
        <div className="grid items-center gap-3 lg:grid-cols-[220px_220px_1fr_auto]">
          <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="text-xs font-semibold text-white/45">Total registrados</div>
            <div className="mt-1 text-xl font-semibold text-white">{phones.length}</div>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold text-white/45">Ordenar</div>
            <div className="mt-2">
              <Select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                aria-label="Ordenar"
              >
                <option className="bg-slate-950 text-white" value="ASC">Ascendente</option>
                <option className="bg-slate-950 text-white" value="DESC">Descendente</option>
                <option className="bg-slate-950 text-white" value="PRICE_ASC">Precio menor a mayor</option>
                <option className="bg-slate-950 text-white" value="PRICE_DESC">Precio mayor a menor</option>
              </Select>
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold text-white/45">Buscar</div>
            <div className="mt-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por marca, modelo o descripción…"
                aria-label="Buscar"
              />
            </div>
          </div>

          <div className="flex items-end justify-start lg:justify-end">
            <Button type="button" onClick={() => {}}>
              Imprimir reporte
            </Button>
          </div>
        </div>
      </section>

      {/* DIV INFERIOR: grid */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((phone) => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              onMore={() => {
                setSelected(phone);
                setOpen(true);
              }}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Sin resultados</div>
            <div className="mt-1 text-sm text-white/60">
              Prueba con otra búsqueda u orden.
            </div>
          </div>
        ) : null}
      </section>

      <PhoneDetailsModal
        open={open}
        phone={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}
