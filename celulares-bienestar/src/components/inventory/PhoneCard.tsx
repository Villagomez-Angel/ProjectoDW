import type { Phone } from "@/types/inventory";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";

/**
 * Tarjeta compacta para cada celular del inventario.
 *
 * Mantiene la imagen en un contenedor cuadrado fijo para que el grid no se
 * desacomode con fotos rectangulares o proporciones inconsistentes.
 */
export function PhoneCard({ phone, onMore }: { phone: Phone; onMore: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[var(--panel)] ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/6 hover:shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
      <div className="p-4">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-black/25 ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={phone.imagenUrl}
            alt={`${phone.marca} ${phone.modelo}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-4 min-w-0">
          <div className="text-xs font-semibold tracking-wide text-white/55">{phone.marca}</div>
          <div className="mt-1 truncate text-sm font-semibold text-white">{phone.modelo}</div>
          <div className="mt-2 text-sm font-semibold text-[var(--accent)]">
            {formatCurrency(phone.precio)}
          </div>
        </div>

        <div className="mt-4">
          <Button variant="secondary" className="w-full" onClick={onMore} type="button">
            Más información
          </Button>
        </div>
      </div>
    </div>
  );
}
