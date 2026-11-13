import { STORAGE_KEYS } from "../../config/store";
import { getCartSnapshot, clearCart } from "./cart";
import { resolveLines, subtotalCents, shippingCents, totalCents, type ResolvedLine, type CartItem } from "./pricing";

export type ShippingInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  reference?: string;
};

export type OrderStatus = "pendiente_pago";

export type Order = {
  id: string;
  createdAt: string;
  lines: ResolvedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shipping: ShippingInfo;
  status: OrderStatus;
};

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: "empty" | "unavailable" | "storage"; removed: CartItem[] };

function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.orders);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    return true;
  } catch {
    return false;
  }
}

// PUNTO DE INTEGRACIÓN DE PAGOS.
// Hoy: recalcula desde el catálogo, guarda el pedido en localStorage y vacía el carrito.
// Para una pasarela real: esta función pasa a un backend que
//   1) recibe solo { items, shipping } (nunca montos),
//   2) recalcula precios y crea la orden en estado pendiente,
//   3) crea la sesión de pago en el proveedor y devuelve su URL,
//   4) un webhook firmado e idempotente marca la orden como pagada.
// Ver README, sección "Integración de pagos".
export function placeOrder(shipping: ShippingInfo): PlaceOrderResult {
  const items = getCartSnapshot();
  if (items.length === 0) return { ok: false, error: "empty", removed: [] };

  const { lines, removed } = resolveLines(items);
  if (removed.length > 0 || lines.length === 0) {
    // Purga los no disponibles para que el carrito no quede bloqueado.
    removed.forEach((i) => removeFromCart(i.productSlug, i.variantId));
    return { ok: false, error: "unavailable", removed };
  }

  const order: Order = {
    id: crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    lines,
    subtotalCents: subtotalCents(lines),
    shippingCents: shippingCents(lines),
    totalCents: totalCents(lines),
    shipping,
    status: "pendiente_pago",
  };

  // Si no se puede guardar, no vaciamos el carrito: el pedido no se perdió del todo.
  if (!writeOrders([order, ...readOrders()])) {
    return { ok: false, error: "storage", removed: [] };
  }
  clearCart();
  return { ok: true, orderId: order.id };
}

export function getOrder(id: string): Order | undefined {
  return readOrders().find((o) => o.id === id);
}

export function listOrders(): Order[] {
  return readOrders();
}
