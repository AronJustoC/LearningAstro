import { describe, expect, test } from "bun:test";
import {
  clampQty,
  resolveLines,
  shippingCents,
  subtotalCents,
  totalCents,
  type CartItem,
} from "./pricing";
import type { Catalog } from "./catalog";
import { SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS, MAX_QTY_PER_LINE } from "../../config/store";

const MACETA = { productSlug: "maceta-bulbasaur", variantId: "mb-con-planta" };
const UNIT_CENTS = 3500;

// Catálogo mínimo de prueba: 1 producto, 2 variantes.
const CATALOG: Catalog = {
  categories: [{ id: 1, slug: "macetas", name: "Macetas" }],
  products: [
    {
      id: 1,
      slug: "maceta-bulbasaur",
      name: "Maceta Bulbasaur",
      description: "Maceta impresa en 3D.",
      priceCents: UNIT_CENTS,
      categoryId: 1,
      images: [],
      variants: [
        { id: "mb-con-planta", label: "Con planta", priceCents: UNIT_CENTS },
        { id: "mb-sin-planta", label: "Sin planta", priceCents: 3000 },
      ],
      soldOut: false,
      active: true,
    },
  ],
};

describe("clampQty", () => {
  test("limita al máximo por línea y nunca baja de 1", () => {
    expect(clampQty(50)).toBe(MAX_QTY_PER_LINE);
    expect(clampQty(50, 8)).toBe(8);
    expect(clampQty(0)).toBe(1);
    expect(clampQty(3)).toBe(3);
  });
});

describe("resolveLines", () => {
  test("recalcula precios desde el catálogo, no desde el carrito", () => {
    const items: CartItem[] = [{ ...MACETA, qty: 2 }];
    const { lines, removed } = resolveLines(items, CATALOG);
    expect(removed).toEqual([]);
    expect(lines[0].unitPriceCents).toBe(UNIT_CENTS);
    expect(lines[0].lineTotalCents).toBe(2 * UNIT_CENTS);
  });

  test("descarta líneas huérfanas", () => {
    const { lines, removed } = resolveLines(
      [{ productSlug: "no-existe", variantId: "x", qty: 1 }],
      CATALOG,
    );
    expect(lines).toEqual([]);
    expect(removed.length).toBe(1);
  });

  test("ajusta cantidad al máximo por línea", () => {
    const { lines } = resolveLines([{ ...MACETA, qty: 99 }], CATALOG);
    expect(lines[0].qty).toBe(MAX_QTY_PER_LINE);
  });
});

describe("totales", () => {
  test("subtotal con varias líneas", () => {
    const { lines } = resolveLines(
      [
        { ...MACETA, qty: 2 },
        { ...MACETA, qty: 1 },
      ],
      CATALOG,
    );
    expect(subtotalCents(lines)).toBe(3 * UNIT_CENTS);
  });

  test("envío 0 con carrito vacío", () => {
    expect(shippingCents([])).toBe(0);
    expect(totalCents([])).toBe(0);
  });

  test("envío fijo por debajo del umbral y gratis desde el umbral", () => {
    const { lines } = resolveLines([{ ...MACETA, qty: 1 }], CATALOG);
    expect(UNIT_CENTS).toBeLessThan(FREE_SHIPPING_THRESHOLD_CENTS);
    expect(shippingCents(lines)).toBe(SHIPPING_FLAT_CENTS);
    expect(totalCents(lines)).toBe(UNIT_CENTS + SHIPPING_FLAT_CENTS);

    const big = resolveLines([{ ...MACETA, qty: 5 }], CATALOG);
    expect(subtotalCents(big.lines)).toBeGreaterThanOrEqual(FREE_SHIPPING_THRESHOLD_CENTS);
    expect(shippingCents(big.lines)).toBe(0);
  });
});
