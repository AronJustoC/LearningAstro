import { STORAGE_KEYS } from "../../config/store";
import { clampQty, type CartItem } from "./pricing";
import { getProduct, getVariant } from "../../data/catalog";

// El carrito solo guarda identificadores y cantidad. Los precios se recalculan siempre.
// Estado compartido entre islas: caché en memoria + evento propio y evento "storage".

const CHANGE_EVENT = "adn-store-cart-change";
const EMPTY: CartItem[] = [];

let cache: CartItem[] | null = null;

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (i): i is CartItem =>
        typeof i?.productSlug === "string" &&
        typeof i?.variantId === "string" &&
        typeof i?.qty === "number",
    );
  } catch {
    // JSON corrupto: se trata como carrito vacío.
    return [];
  }
}

function readStorage(): CartItem[] {
  try {
    return parse(window.localStorage.getItem(STORAGE_KEYS.cart));
  } catch {
    // localStorage no disponible (modo privado, bloqueado): carrito vacío.
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  } catch {
    // Sin persistencia: el carrito sigue en memoria para esta pestaña.
  }
}

// Snapshot estable para useSyncExternalStore. En servidor devuelve un arreglo vacío.
export function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache === null) cache = readStorage();
  return cache;
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY;
}

function commit(items: CartItem[]) {
  cache = items;
  writeStorage(items);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addToCart(productSlug: string, variantId: string, qty = 1) {
  const product = getProduct(productSlug);
  const variant = product ? getVariant(product, variantId) : undefined;
  if (!variant || variant.stock <= 0) return;

  const items = [...getCartSnapshot()];
  const index = items.findIndex((i) => i.productSlug === productSlug && i.variantId === variantId);
  const current = index >= 0 ? items[index].qty : 0;
  const next = clampQty(current + qty, variant.stock);

  if (index >= 0) items[index] = { ...items[index], qty: next };
  else items.push({ productSlug, variantId, qty: next });
  commit(items);
}

export function setQty(productSlug: string, variantId: string, qty: number) {
  const product = getProduct(productSlug);
  const variant = product ? getVariant(product, variantId) : undefined;
  if (!variant) return;

  const items = getCartSnapshot().map((i) =>
    i.productSlug === productSlug && i.variantId === variantId
      ? { ...i, qty: clampQty(qty, variant.stock) }
      : i,
  );
  commit(items);
}

export function removeFromCart(productSlug: string, variantId: string) {
  commit(getCartSnapshot().filter((i) => !(i.productSlug === productSlug && i.variantId === variantId)));
}

export function clearCart() {
  commit([]);
}

// Suscripción a cambios: otra isla de la página, otra pestaña (storage) o el evento propio.
export function subscribeCart(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.cart || e.key === null) {
      cache = null;
      onChange();
    }
  };
  const onLocal = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onLocal);
  };
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}
