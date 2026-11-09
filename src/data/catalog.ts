// Catálogo de DEMOSTRACIÓN. Todo lo de este archivo es PLACEHOLDER:
// nombres, descripciones, precios, stock e imágenes son de ejemplo.
// Los precios van en céntimos (entero). Ver src/config/store.ts.

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Variant = {
  id: string;
  label: string;
  kind: "color" | "material";
  priceCents: number;
  stock: number;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  images: ProductImage[];
  variants: Variant[];
  featured?: boolean;
  placeholder: true;
};

// PLACEHOLDER
export const categories: Category[] = [
  {
    slug: "figuras",
    name: "Figuras",
    description: "Miniaturas y figuras de ejemplo.",
  },
  {
    slug: "funcionales",
    name: "Funcionales",
    description: "Piezas útiles para el día a día. Ejemplo.",
  },
  {
    slug: "decoracion",
    name: "Decoración",
    description: "Lámparas y objetos para el hogar. Ejemplo.",
  },
];

// PLACEHOLDER
export const products: Product[] = [
  {
    slug: "figura-explorador",
    name: "Figura explorador",
    categorySlug: "figuras",
    description: "Producto de ejemplo. Figura impresa en 3D, pintable.",
    images: [
      { src: "/products/figura-explorador.svg", alt: "Imagen de ejemplo: figura explorador" },
    ],
    variants: [
      { id: "fe-arena", label: "Arena", kind: "color", priceCents: 4500, stock: 8 },
      { id: "fe-terracota", label: "Terracota", kind: "color", priceCents: 4500, stock: 3 },
    ],
    featured: true,
    placeholder: true,
  },
  {
    slug: "figura-gato-azotea",
    name: "Gato de azotea",
    categorySlug: "figuras",
    description: "Producto de ejemplo. Figura pequeña de ejemplo.",
    images: [
      { src: "/products/gato-azotea.svg", alt: "Imagen de ejemplo: gato de azotea" },
    ],
    variants: [
      { id: "ga-pla", label: "PLA", kind: "material", priceCents: 3500, stock: 12 },
      { id: "ga-petg", label: "PETG", kind: "material", priceCents: 4200, stock: 0 },
    ],
    placeholder: true,
  },
  {
    slug: "figura-robot",
    name: "Robot de ejemplo",
    categorySlug: "figuras",
    description: "Producto de ejemplo. Figura articulada de ejemplo.",
    images: [
      { src: "/products/robot.svg", alt: "Imagen de ejemplo: robot" },
    ],
    variants: [
      { id: "rb-gris", label: "Gris", kind: "color", priceCents: 6800, stock: 5 },
    ],
    placeholder: true,
  },
  {
    slug: "soporte-celular",
    name: "Soporte para celular",
    categorySlug: "funcionales",
    description: "Producto de ejemplo. Soporte de escritorio impreso en 3D.",
    images: [
      { src: "/products/soporte.svg", alt: "Imagen de ejemplo: soporte para celular" },
    ],
    variants: [
      { id: "sc-negro", label: "Negro", kind: "color", priceCents: 2500, stock: 20 },
      { id: "sc-blanco", label: "Blanco", kind: "color", priceCents: 2500, stock: 10 },
    ],
    featured: true,
    placeholder: true,
  },
  {
    slug: "organizador-cables",
    name: "Organizador de cables",
    categorySlug: "funcionales",
    description: "Producto de ejemplo. Clips para cables de escritorio.",
    images: [
      { src: "/products/organizador.svg", alt: "Imagen de ejemplo: organizador de cables" },
    ],
    variants: [
      { id: "oc-pack4", label: "Pack de 4", kind: "material", priceCents: 1800, stock: 15 },
      { id: "oc-pack8", label: "Pack de 8", kind: "material", priceCents: 3200, stock: 6 },
    ],
    placeholder: true,
  },
  {
    slug: "maceta-modular",
    name: "Maceta modular",
    categorySlug: "funcionales",
    description: "Producto de ejemplo. Maceta con drenaje, apilable.",
    images: [
      { src: "/products/maceta.svg", alt: "Imagen de ejemplo: maceta modular" },
    ],
    variants: [
      { id: "mm-s", label: "Chica", kind: "material", priceCents: 3000, stock: 4 },
      { id: "mm-m", label: "Mediana", kind: "material", priceCents: 4500, stock: 2 },
    ],
    placeholder: true,
  },
  {
    slug: "lampara-atardecer",
    name: "Lámpara atardecer",
    categorySlug: "decoracion",
    description: "Producto de ejemplo. Lámpara de mesa con difusor.",
    images: [
      { src: "/products/lampara.svg", alt: "Imagen de ejemplo: lámpara atardecer" },
    ],
    variants: [
      { id: "la-terracota", label: "Terracota", kind: "color", priceCents: 8900, stock: 3 },
      { id: "la-cal", label: "Cal", kind: "color", priceCents: 8900, stock: 0 },
    ],
    featured: true,
    placeholder: true,
  },
  {
    slug: "macetero-cuerda",
    name: "Macetero colgante",
    categorySlug: "decoracion",
    description: "Producto de ejemplo. Macetero para colgar en balcón.",
    images: [
      { src: "/products/macetero.svg", alt: "Imagen de ejemplo: macetero colgante" },
    ],
    variants: [
      { id: "mc-pla", label: "PLA", kind: "material", priceCents: 3900, stock: 7 },
    ],
    placeholder: true,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariant(product: Product, variantId: string): Variant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function productsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function featuredProducts(): Product[] {
  return products.filter((p) => p.featured);
}

// Precio más bajo entre variantes (para "desde S/ x").
export function minPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

// Agotado si ninguna variante tiene stock.
export function isSoldOut(product: Product): boolean {
  return product.variants.every((v) => v.stock <= 0);
}
