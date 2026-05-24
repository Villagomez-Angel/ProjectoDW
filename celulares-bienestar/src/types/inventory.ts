export type PhoneId = string;

/**
 * Modelo de datos principal del catálogo.
 *
 * Incluye la información que el modal necesita mostrar y lo mínimo para que
 * la tarjeta, búsqueda y edición funcionen sin lógica duplicada.
 */
export type Phone = {
  id: PhoneId;
  modelo: string;
  marca: string;
  anio: number;
  precio: number;
  descripcion: string;
  imagenUrl: string;
};

/**
 * Versión editable del producto sin identificador.
 *
 * Se usa en el formulario de alta/edición para que el ID siga siendo
 * responsabilidad de la capa de inventario.
 */
export type PhoneDraft = Omit<Phone, "id">;
