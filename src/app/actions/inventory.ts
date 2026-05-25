"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Phone, PhoneDraft } from "@/types/inventory";
import { seedPhones } from "@/data/seedPhones";
import { prisma } from "@/lib/prisma";

const LOCAL_PHONES_DIR = path.join(process.cwd(), "public", "localPhones");
const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;

function normalizeImageUrl(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "/localPhones/generic.png";
  if (trimmed === "/generic.png") return "/localPhones/generic.png";
  if (trimmed.startsWith("/localPhones/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `/localPhones/${trimmed.slice(1)}`;
  return `/localPhones/${trimmed}`;
}

function buildLocalPhoneBaseName(modelo: string, anio: number) {
  const safeModelo = modelo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .trim()
    .toLowerCase();
  return `${safeModelo}_${anio}`;
}

export async function listPhones(): Promise<Phone[]> {
  const total = await prisma.phone.count();
  if (total === 0) {
    await prisma.phone.createMany({
      data: seedPhones.map((phone) => ({
        ...phone,
        imagenUrl: normalizeImageUrl(phone.imagenUrl),
      })),
      skipDuplicates: true,
    });
  }

  return prisma.phone.findMany();
}

export async function createPhone(draft: PhoneDraft): Promise<Phone> {
  return prisma.phone.create({
    data: {
      ...draft,
      imagenUrl: normalizeImageUrl(draft.imagenUrl),
    },
  });
}

export async function updatePhone(id: string, draft: PhoneDraft): Promise<Phone> {
  return prisma.phone.update({
    where: { id },
    data: {
      ...draft,
      imagenUrl: normalizeImageUrl(draft.imagenUrl),
    },
  });
}

export async function deletePhone(id: string): Promise<void> {
  await prisma.phone.delete({ where: { id } });
}

export async function importPhones(phones: Phone[]): Promise<number> {
  if (phones.length === 0) return 0;
  const result = await prisma.phone.createMany({
    data: phones.map((phone) => ({
      ...phone,
      imagenUrl: normalizeImageUrl(phone.imagenUrl),
    })),
    skipDuplicates: true,
  });
  return result.count;
}

export async function uploadLocalPhoneImage(formData: FormData): Promise<{ imageUrl: string; fileName: string }> {
  const file = formData.get("file");
  const modelo = String(formData.get("modelo") ?? "").trim();
  const anio = Number(formData.get("anio"));

  if (!(file instanceof File)) {
    throw new Error("Selecciona una imagen válida.");
  }
  if (!modelo) {
    throw new Error("El modelo es obligatorio para generar el nombre.");
  }
  if (!Number.isFinite(anio)) {
    throw new Error("El año es obligatorio para generar el nombre.");
  }
  if (file.size === 0) {
    throw new Error("La imagen está vacía.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("La imagen supera el máximo de 1 MB.");
  }

  const extension = path.extname(file.name).toLowerCase() || ".png";
  const baseName = buildLocalPhoneBaseName(modelo, anio);
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(LOCAL_PHONES_DIR, { recursive: true });

  let counter = 0;
  while (true) {
    const fileName = `${baseName}_${counter}${extension}`;
    const fullPath = path.join(LOCAL_PHONES_DIR, fileName);

    try {
      await writeFile(fullPath, buffer, { flag: "wx" });
      return {
        fileName,
        imageUrl: `/localPhones/${fileName}`,
      };
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "EEXIST") {
        counter += 1;
        continue;
      }
      throw error;
    }
  }
}
