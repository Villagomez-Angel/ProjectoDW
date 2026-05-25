"use server";

import type { Phone, PhoneDraft } from "@/types/inventory";
import { seedPhones } from "@/data/seedPhones";
import { prisma } from "@/lib/prisma";

function normalizeImageUrl(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : "/generic.png";
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
