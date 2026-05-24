"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Diálogo de confirmación reutilizable.
 *
 * Encapsula la decisión destructiva para que borrar, cerrar o cancelar tenga
 * siempre el mismo patrón visual y de interacción.
 */
export function ConfirmDialog({
  open,
  title = "Confirmar",
  description = "¿Seguro que deseas continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      className="max-w-lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            type="button"
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </Modal>
  );
}
