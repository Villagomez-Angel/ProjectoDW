"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Modal } from "@/components/ui/Modal";
import { PhoneImage } from "@/components/inventory/PhoneImage";
import { PageHeader } from "@/components/layout/PageHeader";
import { uploadLocalPhoneImage } from "@/app/actions/inventory";
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

function resolvePreviewImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "/generic.png") return "/localPhones/generic.png";
  if (trimmed.startsWith("/localPhones/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `/localPhones/${trimmed.slice(1)}`;
  return `/localPhones/${trimmed}`;
}

function getLocalPhoneFileName(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/localPhones/")) return "";
  return trimmed.slice("/localPhones/".length);
}

function getFilePreviewUrl(file: File | null) {
  if (!file) return "";
  return URL.createObjectURL(file);
}

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;
const MAX_IMAGE_SIZE_LABEL = "1 MB";

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
              imagenUrl: editing.imagenUrl || "/localPhones/generic.png",
            }
          : {
              marca: "",
              modelo: "",
              anio: new Date().getFullYear(),
              precio: 0,
              descripcion: "",
              imagenUrl: "/localPhones/generic.png",
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
  const [isVercel, setIsVercel] = React.useState(true);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [selectedFilePreview, setSelectedFilePreview] = React.useState("");

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
      imagenUrl: draft.imagenUrl?.trim() ? draft.imagenUrl : "/localPhones/generic.png",
    };
    await onSave(payload);
  };

  const previewImageUrl = resolvePreviewImageUrl(draft.imagenUrl);
  const generatedFileName = getLocalPhoneFileName(draft.imagenUrl);

  React.useEffect(() => {
    if (!selectedFile) {
      setSelectedFilePreview("");
      return;
    }

    const previewUrl = getFilePreviewUrl(selectedFile);
    setSelectedFilePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  const openImageDialog = () => {
    setUploadError(null);

    if (!draft.modelo.trim()) {
      setErrors((prev) => ({ ...prev, modelo: "Escribe el modelo antes de subir una imagen local" }));
      return;
    }

    if (!Number.isFinite(draft.anio) || draft.anio < 2000) {
      setErrors((prev) => ({ ...prev, anio: "Escribe un año válido antes de subir una imagen local" }));
      return;
    }

    setImageDialogOpen(true);
  };

  const handleUploadImage = async () => {
    setUploadError(null);

    if (!selectedFile) {
      setUploadError("Selecciona una imagen primero.");
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
      setUploadError("La imagen supera el máximo de 1 MB.");
      return;
    }

    if (!draft.modelo.trim()) {
      setErrors((prev) => ({ ...prev, modelo: "Escribe el modelo antes de subir la imagen" }));
      return;
    }

    if (!Number.isFinite(draft.anio) || draft.anio < 2000) {
      setErrors((prev) => ({ ...prev, anio: "Escribe un año válido antes de subir la imagen" }));
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("modelo", draft.modelo);
      formData.append("anio", String(draft.anio));

      const result = await uploadLocalPhoneImage(formData);
      setDraft((prev) => ({ ...prev, imagenUrl: result.imageUrl }));
      setSelectedFile(null);
      setImageDialogOpen(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploadingImage(false);
    }
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
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
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
                Usa una URL externa o un archivo dentro de <span className="font-semibold">/localPhones</span>.
              </p>

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500">URL de imagen o nombre local</label>
                <div className="mt-2">
                  <Input
                    value={draft.imagenUrl}
                    onChange={(e) => setDraft((p) => ({ ...p, imagenUrl: e.target.value }))}
                    placeholder="/localPhones/generic.png"
                  />
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">
                <div className="aspect-square">
                  <PhoneImage src={previewImageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Entorno
                    </p>
                    <p className="mt-1 text-sm text-slate-700">¿Estás usando Vercel?</p>
                  </div>

                  <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
                    <Button
                      type="button"
                      variant={isVercel ? "primary" : "secondary"}
                      className="rounded-full px-3 py-1.5 text-xs"
                      onClick={() => setIsVercel(true)}
                    >
                      Sí
                    </Button>
                    <Button
                      type="button"
                      variant={!isVercel ? "primary" : "secondary"}
                      className="rounded-full px-3 py-1.5 text-xs"
                      onClick={() => setIsVercel(false)}
                    >
                      No
                    </Button>
                  </div>
                </div>

                {!isVercel ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Alternativa
                    </p>

                    <Button type="button" className="mt-4 h-12 w-full text-base" onClick={openImageDialog}>
                      Subir una imagen local a la computadora
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </form>

      <Modal
        open={imageDialogOpen}
        onClose={() => {
          setImageDialogOpen(false);
          setUploadError(null);
        }}
        title="Subir imagen local"
        className="max-w-3xl"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Subir imagen local</div>
              <p className="mt-1 text-xs text-amber-700">
                Máximo 1 MB por imagen.
              </p>
              <div className="mt-3 space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (file && file.size > MAX_IMAGE_SIZE_BYTES) {
                      setSelectedFile(null);
                      setSelectedFilePreview("");
                      setUploadError("La imagen supera el máximo de 1 MB.");
                      return;
                    }

                    setSelectedFile(file);
                    setUploadError(null);
                  }}
                />
                <Button type="button" onClick={handleUploadImage} disabled={!selectedFile || uploadingImage} className="w-full">
                  {uploadingImage ? "Subiendo…" : "Subir imagen"}
                </Button>
                {uploadError ? <p className="text-xs text-red-500">{uploadError}</p> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mt-2 text-xs text-slate-500">
                Al subir la imagen, esta URL se coloca automáticamente en el campo principal.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-500">Preview</div>
              <div className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                <div className="aspect-square">
                  <PhoneImage
                    src={selectedFilePreview || previewImageUrl}
                    alt="Preview local"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
