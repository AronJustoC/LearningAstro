import { CURRENCY, LOCALE, SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS, MAX_QTY_PER_LINE } from "../../config/store";
import { getProductBySlug, getVariant, isAvailable, type Catalog } from "./catalog";

// Línea del carrito: solo identificadores y cantidad. El precio NUNCA se guarda aquí.
export type CartItem = {
  productSlug: string;
  variantId: string;
  qty: number;
};

export type ResolvedLine = {
  productSlug: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  unitPriceCents: number;
  qty: number;
  lineTotalCents: number;
};

export type ResolvedCart = {
  lines: ResolvedLine[];
  // Líneas descartadas porque el producto o la variante ya no existen o están agotados.
  removed: CartItem[];
};

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY }).format(cents / 100);
}

// Cantidad válida entre 1 y el máximo por línea.
export function clampQty(qty: number, max = MAX_QTY_PER_LINE): number {
  if (!Number.isFinite(qty)) return 1;
  const limit = Math.max(0, Math.floor(max));
  return Math.min(Math.max(1, Math.floor(qty)), limit);
}

// Cruza las líneas con el catálogo vigente. Recalcula precios desde el catálogo.
export function resolveLines(items: CartItem[], catalog: Catalog): ResolvedCart {
  const lines: ResolvedLine[] = [];
  const removed: CartItem[] = [];

  for (const item of items) {
    const product = getProductBySlug(catalog, item.productSlug);
    const variant = product ? getVariant(product, item.variantId) : undefined;
    if (!product || !variant || !isAvailable(product)) {
      removed.push(item);
      continue;
    }
    const qty = clampQty(item.qty);
    lines.push({
      productSlug: product.slug,
      productName: product.name,
      variantId: variant.id,
      variantLabel: variant.label,
      unitPriceCents: variant.priceCents,
      qty,
      lineTotalCents: variant.priceCents * qty,
    });
  }

  return { lines, removed };
}

export function subtotalCents(lines: ResolvedLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
}

// Envío: 0 con carrito vacío o si el subtotal alcanza el umbral; si no, tarifa fija.
export function shippingCents(lines: ResolvedLine[]): number {
  if (lines.length === 0) return 0;
  if (subtotalCents(lines) >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return SHIPPING_FLAT_CENTS;
}

export function totalCents(lines: ResolvedLine[]): number {
  return subtotalCents(lines) + shippingCents(lines);
}
