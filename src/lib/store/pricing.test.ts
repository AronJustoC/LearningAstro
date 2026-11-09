import { describe, expect, test } from "bun:test";
import {
  clampQty,
  resolveLines,
  shippingCents,
  subtotalCents,
  totalCents,
  type CartItem,
} from "./pricing";
import { SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "../../config/store";

describe("clampQty", () => {
  test("limita al stock y nunca baja de 1", () => {
    expect(clampQty(50, 8)).toBe(8);
    expect(clampQty(0, 8)).toBe(1);
    expect(clampQty(3, 8)).toBe(3);
  });
});

describe("resolveLines", () => {
  test("recalcula precios desde el catálogo, no desde el carrito", () => {
    const items: CartItem[] = [{ productSlug: "soporte-celular", variantId: "sc-negro", qty: 2 }];
    const { lines, removed } = resolveLines(items);
    expect(removed).toEqual([]);
    expect(lines[0].unitPriceCents).toBe(2500);
    expect(lines[0].lineTotalCents).toBe(5000);
  });

  test("descarta líneas huérfanas y líneas agotadas", () => {
    const items: CartItem[] = [
      { productSlug: "no-existe", variantId: "x", qty: 1 },
      { productSlug: "figura-gato-azotea", variantId: "ga-petg", qty: 1 },
    ];
    const { lines, removed } = resolveLines(items);
    expect(lines).toEqual([]);
    expect(removed.length).toBe(2);
  });

  test("ajusta cantidad al stock disponible", () => {
    const { lines } = resolveLines([{ productSlug: "maceta-modular", variantId: "mm-m", qty: 99 }]);
    expect(lines[0].qty).toBe(2);
  });
});

describe("totales", () => {
  test("subtotal con varias variantes", () => {
    const { lines } = resolveLines([
      { productSlug: "soporte-celular", variantId: "sc-negro", qty: 2 },
      { productSlug: "organizador-cables", variantId: "oc-pack4", qty: 1 },
    ]);
    expect(subtotalCents(lines)).toBe(2 * 2500 + 1800);
  });

  test("envío 0 con carrito vacío", () => {
    expect(shippingCents([])).toBe(0);
    expect(totalCents([])).toBe(0);
  });

  test("envío fijo por debajo del umbral y gratis desde el umbral", () => {
    const { lines } = resolveLines([{ productSlug: "soporte-celular", variantId: "sc-negro", qty: 1 }]);
    expect(shippingCents(lines)).toBe(SHIPPING_FLAT_CENTS);
    expect(totalCents(lines)).toBe(2500 + SHIPPING_FLAT_CENTS);

    const big = resolveLines([{ productSlug: "lampara-atardecer", variantId: "la-terracota", qty: 2 }]);
    expect(subtotalCents(big.lines)).toBeGreaterThanOrEqual(FREE_SHIPPING_THRESHOLD_CENTS);
    expect(shippingCents(big.lines)).toBe(0);
  });
});
