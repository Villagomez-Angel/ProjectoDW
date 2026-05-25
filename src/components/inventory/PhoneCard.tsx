import type { Phone } from "@/types/inventory";
import { Button } from "@/components/ui/Button";
import { PhoneImage } from "@/components/inventory/PhoneImage";
import { formatCurrency } from "@/utils/format";

/**
 * Tarjeta compacta para cada celular del inventario.
 *
 * Mantiene la imagen en un contenedor cuadrado fijo para que el grid no se
 * desacomode con fotos rectangulares o proporciones inconsistentes.
 */
export function PhoneCard({ phone, onMore }: { phone: Phone; onMore: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
      <div className="p-4">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-linear-to-br from-white to-slate-100 ring-1 ring-slate-100">
          <PhoneImage
            src={phone.imagenUrl}
            alt={`${phone.marca} ${phone.modelo}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-4 min-w-0">
          <div className="text-xs font-semibold tracking-wide text-slate-500">{phone.marca}</div>
          <div className="mt-1 truncate text-sm font-semibold text-slate-900">{phone.modelo}</div>
          <div className="mt-2 text-sm font-semibold text-sky-700">
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
