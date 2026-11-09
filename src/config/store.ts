// Configuración de la tienda Rooftop. Valores PLACEHOLDER: confirmar antes de publicar.

export const STORE_NAME = "Rooftop";

// PLACEHOLDER: confirmar moneda y mercado.
export const CURRENCY = "PEN";
export const LOCALE = "es-PE";

// PLACEHOLDER: tarifa de envío fija en céntimos (ej. 1500 = S/ 15,00).
export const SHIPPING_FLAT_CENTS = 1500;

// Envío gratis desde este subtotal (céntimos). PLACEHOLDER.
export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;

// Correo de contacto: misma fuente que el resto del portafolio (nadie importa esta constante hoy).
export { CONTACT_EMAIL } from "../lib/contact";

export const STORAGE_KEYS = {
  cart: "adn-store-cart",
  orders: "adn-store-orders",
} as const;

export const DEMO_NOTICE =
  "Catálogo de demostración: productos y precios de ejemplo.";
