/**
 * Une clases condicionales en una sola cadena lista para `className`.
 *
 * Mantiene el código de estilos más legible y evita repetir filtros manuales
 * en cada componente visual.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
