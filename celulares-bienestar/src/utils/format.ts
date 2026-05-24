/**
 * Formatea valores numéricos como moneda mexicana.
 *
 * Se usa en inventario y detalle de producto para mantener el mismo criterio
 * de presentación de precios en toda la app.
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}
