"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Phone } from "@/types/inventory";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatCurrency } from "@/utils/format";
import { useInventory } from "@/context/InventoryContext";

/**
 * Modal principal de detalle del producto.
 *
 * Desde aquí se disparan las tres acciones de negocio: comprar, editar y borrar.
 * El componente concentra la navegación de edición y la confirmación destructiva.
 */
export function PhoneDetailsModal({
  open,
  phone,
  onClose,
}: {
  open: boolean;
  phone: Phone | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { deletePhone } = useInventory();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!phone) {
    return (
      <Modal open={open} title="Detalles" onClose={onClose}>
        <div />
      </Modal>
    );
  }

  return (
    <>
      <Modal
        open={open}
        title={`${phone.marca} · ${phone.modelo}`}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" type="button" onClick={() => {}}>
              Comprar
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                onClose();
                router.push(`/alta?edit=${encodeURIComponent(phone.id)}`);
              }}
            >
              Editar
            </Button>
            <Button variant="danger" type="button" onClick={() => setConfirmOpen(true)}>
              Borrar
            </Button>
          </>
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-black/25 ring-1 ring-white/10">
            <div className="aspect-square md:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={phone.imagenUrl}
                alt={`${phone.marca} ${phone.modelo}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <dl className="grid gap-3">
              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <dt className="text-xs font-semibold text-white/45">ID</dt>
                <dd className="mt-1 truncate text-sm font-semibold text-white">{phone.id}</dd>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <dt className="text-xs font-semibold text-white/45">Marca</dt>
                  <dd className="mt-1 truncate text-sm font-semibold text-white">{phone.marca}</dd>
                </div>
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <dt className="text-xs font-semibold text-white/45">Modelo</dt>
                  <dd className="mt-1 truncate text-sm font-semibold text-white">{phone.modelo}</dd>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <dt className="text-xs font-semibold text-white/45">Año</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{phone.anio}</dd>
                </div>
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <dt className="text-xs font-semibold text-white/45">Precio</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--accent)]">
                    {formatCurrency(phone.precio)}
                  </dd>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <dt className="text-xs font-semibold text-white/45">Descripción</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/75">{phone.descripcion}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        description="Esta acción no se puede deshacer. ¿Deseas eliminar este celular del inventario?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={() => {
          deletePhone(phone.id);
          onClose();
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
