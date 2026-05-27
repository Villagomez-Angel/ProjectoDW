"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PhoneImage } from "@/components/inventory/PhoneImage";
import { formatCurrency } from "@/utils/format";
import { useInventory } from "@/context/InventoryContext";
import { toast } from "react-toastify";

export function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart, deletePhone } = useInventory();
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [confirmCheckoutOpen, setConfirmCheckoutOpen] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);

  const total = React.useMemo(
    () => cartItems.reduce((acc, item) => acc + item.precio, 0),
    [cartItems]
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setConfirmCheckoutOpen(true);
  };

  const performCheckout = async () => {
    if (cartItems.length === 0) return;
    setProcessing(true);
    try {
      // delete phones from inventory on the backend
      const promises = cartItems.map((p) => deletePhone?.(p.id));
      await Promise.allSettled(promises);
      clearCart();
      setSuccessOpen(true);
      toast.success("Compra realizada correctamente");
      onClose();
    } catch (err) {
      toast.error("Ocurrió un error durante la compra");
    } finally {
      setProcessing(false);
      setConfirmCheckoutOpen(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        title={`Carrito (${cartItems.length})`}
        onClose={onClose}
        className="max-w-4xl"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">Total: {formatCurrency(total)}</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={onClose} type="button">
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckout}
                type="button"
                disabled={cartItems.length === 0 || processing}
              >
                Comprar todo
              </Button>
            </div>
          </div>
        }
      >
        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            Tu carrito está vacío. Agrega un celular desde los detalles para empezar.
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((phone) => (
              <div
                key={phone.id}
                className="grid items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[90px_1fr_auto]"
              >
                <div className="overflow-hidden rounded-3xl bg-slate-50">
                  <PhoneImage
                    src={phone.imagenUrl}
                    alt={`${phone.marca} ${phone.modelo}`}
                    className="h-24 w-24 object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {phone.marca} {phone.modelo}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{phone.descripcion}</div>
                  <div className="mt-3 text-sm font-semibold text-sky-700">
                    {formatCurrency(phone.precio)}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-900"
                    onClick={() => removeFromCart(phone.id)}
                    type="button"
                  >
                    Quitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={confirmCheckoutOpen}
        title="Confirmar compra"
        description="¿Deseas confirmar la compra de los productos en el carrito? Esta acción eliminará los artículos del inventario."
        confirmText="Sí, comprar"
        cancelText="Cancelar"
        onConfirm={async () => {
          await performCheckout();
        }}
        onClose={() => setConfirmCheckoutOpen(false)}
      />

      <Modal
        open={successOpen}
        title="Compra exitosa"
        onClose={() => setSuccessOpen(false)}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-600">
            ¡Listo! Tus productos están en camino.
          </p>
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setSuccessOpen(false)}
              type="button"
            >
              Genial
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
