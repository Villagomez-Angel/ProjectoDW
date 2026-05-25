import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { seedPhones } from "../src/data/seedPhones";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool, { disposeExternalPool: true });

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

function normalizeImageUrl(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : "/generic.png";
}

async function main() {
  await prisma.phone.createMany({
    data: seedPhones.map((phone) => ({
      ...phone,
      imagenUrl: normalizeImageUrl(phone.imagenUrl),
    })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 