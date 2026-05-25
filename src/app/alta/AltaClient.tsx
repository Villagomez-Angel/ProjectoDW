"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { PageHeader } from "@/components/layout/PageHeader";
import { useInventory } from "@/context/InventoryContext";
import type { PhoneDraft } from "@/types/inventory";

type FormErrors = Partial<Record<keyof PhoneDraft, string>>;

/**
 * Convierte una cadena numérica en un valor seguro para el formulario.
 */
function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function AltaClient() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const { createPhone, updatePhone, getPhoneById } = useInventory();

  const editing = editId ? getPhoneById(editId) : undefined;

  return (
    <AltaForm
      key={editing?.id ?? "new"}
      editingId={editing?.id}
      initialDraft={
        editing
          ? {
              marca: editing.marca,
              modelo: editing.modelo,
              anio: editing.anio,
              precio: editing.precio,
              descripcion: editing.descripcion,
              imagenUrl: editing.imagenUrl || "/generic.png",
            }
          : {
              marca: "",
              modelo: "",
              anio: new Date().getFullYear(),
              precio: 0,
              descripcion: "",
              imagenUrl: "/generic.png",
            }
      }
      onSave={async (draft) => {
        if (editing) await updatePhone(editing.id, draft);
        else await createPhone(draft);
        router.push("/inventario");
      }}
      onCancel={() => router.push("/inventario")}
    />
  );
}

function AltaForm({
  editingId,
  initialDraft,
  onSave,
  onCancel,
}: {
  editingId?: string;
  initialDraft: PhoneDraft;
  onSave: (draft: PhoneDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = React.useState<PhoneDraft>(initialDraft);
  const [errors, setErrors] = React.useState<FormErrors>({});

  /**
   * Valida los campos del formulario antes de persistir el producto.
   */
  const validate = React.useCallback((next: PhoneDraft) => {
    const e: FormErrors = {};
    if (!next.marca.trim()) e.marca = "La marca es obligatoria";
    if (!next.modelo.trim()) e.modelo = "El modelo es obligatorio";
    if (!next.descripcion.trim()) e.descripcion = "Agrega una descripción breve";
    if (!Number.isFinite(next.anio) || next.anio < 2000 || next.anio > new Date().getFullYear() + 1) {
      e.anio = "Año inválido";
    }
    if (!Number.isFinite(next.precio) || next.precio <= 0) e.precio = "Precio inválido";
    return e;
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate(draft);
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    const payload = {
      ...draft,
      imagenUrl: draft.imagenUrl?.trim() ? draft.imagenUrl : "/generic.png",
    };
    await onSave(payload);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={editingId ? "Edición" : "Alta de celulares"}
        title={editingId ? "Editar celular" : "Registrar nuevo producto"}
        description="Llena los campos para agregar un nuevo celular al inventario. Puedes editar la información o cambiar la foto cuando quieras."
      />

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-500">Marca</label>
                <div className="mt-2">
                  <Input
                    value={draft.marca}
                    onChange={(e) => setDraft((p) => ({ ...p, marca: e.target.value }))}
                    placeholder="Ej. Apple"
                  />
                  {errors.marca ? <p className="mt-2 text-xs text-red-300">{errors.marca}</p> : null}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Modelo</label>
                <div className="mt-2">
                  <Input
                    value={draft.modelo}
                    onChange={(e) => setDraft((p) => ({ ...p, modelo: e.target.value }))}
                    placeholder="Ej. iPhone 15"
                  />
                  {errors.modelo ? (
                    <p className="mt-2 text-xs text-red-300">{errors.modelo}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-500">Año</label>
                <div className="mt-2">
                  <Input
                    value={String(draft.anio)}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, anio: toNumber(e.target.value) }))
                    }
                    inputMode="numeric"
                    type="number"
                    min={2000}
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.anio ? <p className="mt-2 text-xs text-red-300">{errors.anio}</p> : null}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Precio (MXN)</label>
                <div className="mt-2">
                  <Input
                    value={draft.precio ? String(draft.precio) : ""}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, precio: toNumber(e.target.value) }))
                    }
                    inputMode="numeric"
                    type="number"
                    min={1}
                  />
                  {errors.precio ? (
                    <p className="mt-2 text-xs text-red-300">{errors.precio}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">Descripción</label>
              <div className="mt-2">
                <TextArea
                  value={draft.descripcion}
                  onChange={(e) => setDraft((p) => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Escribe una descripción clara y útil…"
                />
                {errors.descripcion ? (
                  <p className="mt-2 text-xs text-red-300">{errors.descripcion}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit">Guardar</Button>
              <Button variant="secondary" type="button" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Foto / Imagen</div>
              <p className="mt-1 text-xs text-slate-500">
                Usa una URL o ruta local (ej. <span className="font-semibold">/generic.png</span>).
              </p>

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500">URL de imagen</label>
                <div className="mt-2">
                  <Input
                    value={draft.imagenUrl}
                    onChange={(e) => setDraft((p) => ({ ...p, imagenUrl: e.target.value }))}
                    placeholder="/generic.png"
                  />
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
                <div className="aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.imagenUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
