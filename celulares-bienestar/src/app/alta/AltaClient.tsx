"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
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

/**
 * Lee una imagen local y la convierte en data URL para el preview.
 */
async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
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
      onSave={(draft) => {
        if (editing) updatePhone(editing.id, draft);
        else createPhone(draft);
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
  onSave: (draft: PhoneDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = React.useState<PhoneDraft>(initialDraft);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [imageBusy, setImageBusy] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState("Ningún archivo seleccionado");

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate(draft);
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    onSave(draft);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">
          {editingId ? "Editar celular" : "Alta de celulares"}
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Formulario moderno con validación y preview. El ID se genera automáticamente.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl bg-[var(--panel)] p-6 ring-1 ring-white/10 sm:p-8"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-white/55">Marca</label>
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
                <label className="text-xs font-semibold text-white/55">Modelo</label>
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
                <label className="text-xs font-semibold text-white/55">Año</label>
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
                <label className="text-xs font-semibold text-white/55">Precio (MXN)</label>
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
              <label className="text-xs font-semibold text-white/55">Descripción</label>
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
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold text-white/55">Foto / Imagen</div>
              <p className="mt-1 text-xs text-white/45">
                Si no agregas imagen, se usa <span className="font-semibold">/public/generic.png</span>.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl bg-black/25 ring-1 ring-white/10">
                <div className="aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.imagenUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  id="phone-image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageBusy(true);
                    setSelectedFileName(file.name);
                    try {
                      const dataUrl = await fileToDataUrl(file);
                      setDraft((p) => ({ ...p, imagenUrl: dataUrl }));
                    } finally {
                      setImageBusy(false);
                    }
                  }}
                />

                <label
                  htmlFor="phone-image-upload"
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white/8 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/12"
                >
                  Seleccionar archivo
                </label>

                <div className="w-full rounded-xl bg-black/20 px-3 py-2 text-xs text-white/60 ring-1 ring-white/10 break-words">
                  {selectedFileName}
                </div>

                {imageBusy ? <p className="text-xs text-white/55">Procesando imagen…</p> : null}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
