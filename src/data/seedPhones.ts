import type { Phone } from "@/types/inventory";

/**
 * Catálogo semilla.
 *
 * Sirve para que el inventario arranque con contenido realista y el sistema se
 * sienta como una aplicación ya en uso desde la primera carga.
 */
export const seedPhones: Phone[] = [
  {
    id: "seed-galaxy-s24",
    marca: "Samsung",
    modelo: "Galaxy S24",
    anio: 2024,
    precio: 19999,
    descripcion:
      "Smartphone premium con pantalla AMOLED de alta tasa de refresco, excelente cámara y rendimiento de primera.",
    imagenUrl: "/localPhones/generic.png",
  },
  {
    id: "seed-iphone-15-pro",
    marca: "Apple",
    modelo: "iPhone 15 Pro",
    anio: 2023,
    precio: 26999,
    descripcion:
      "Equipo de gama alta con gran desempeño, ecosistema robusto y un sistema de cámaras ideal para foto y video.",
    imagenUrl: "/localPhones/generic.png",
  },
  {
    id: "seed-pixel-9",
    marca: "Google",
    modelo: "Pixel 9",
    anio: 2024,
    precio: 17999,
    descripcion:
      "Android puro con IA, cámara excelente y actualizaciones directas. Ideal para quienes quieren simplicidad y potencia.",
    imagenUrl: "/localPhones/generic.png",
  },
];
