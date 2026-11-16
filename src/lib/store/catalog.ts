// Único punto de acceso al catálogo de la tienda. Los datos vienen del backend
// (/store/products y /store/categories) y usan los tipos de ./types.
import { storeApi } from "./api";
import type { StoreCategory, StoreProduct, StoreVariant } from "./types";

export type Catalog = {
  products: StoreProduct[];
  categories: StoreCategory[];
};

// Carga productos y categorías en paralelo. Sirve en servidor y en navegador.
export async function loadCatalog(): Promise<Catalog> {
  const [productsRes, categoriesRes] = await Promise.all([
    storeApi.listPublicProducts(),
    storeApi.listPublicCategories(),
  ]);
  return {
    products: productsRes.products ?? [],
    categories: categoriesRes.categories ?? [],
  };
}

// Caché por página para islas React: comparte la misma promesa entre componentes.
let clientCatalog: Promise<Catalog> | null = null;

export function getClientCatalog(): Promise<Catalog> {
  if (!clientCatalog) {
    clientCatalog = loadCatalog().catch((error) => {
      clientCatalog = null;
      throw error;
    });
  }
  return clientCatalog;
}

export function getProductBySlug(catalog: Catalog, slug: string): StoreProduct | undefined {
  return catalog.products.find((product) => product.slug === slug);
}

export function getVariant(product: StoreProduct, variantId: string): StoreVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId);
}

export function getCategoryBySlug(catalog: Catalog, slug: string): StoreCategory | undefined {
  return catalog.categories.find((category) => category.slug === slug);
}

// Une productos y categorías por categoryId (no por slug anidado).
export function productsByCategorySlug(catalog: Catalog, slug: string): StoreProduct[] {
  const category = getCategoryBySlug(catalog, slug);
  if (!category) return [];
  return catalog.products.filter((product) => product.categoryId === category.id);
}

// Disponible = activo y no marcado como agotado.
export function isAvailable(product: StoreProduct): boolean {
  return product.active && !product.soldOut;
}

// Precio mínimo entre variantes; si no hay variantes, el precio del producto.
export function minPriceCents(product: StoreProduct): number {
  if (product.variants.length === 0) return product.priceCents;
  return product.variants.reduce(
    (min, variant) => Math.min(min, variant.priceCents),
    Number.POSITIVE_INFINITY,
  );
}
