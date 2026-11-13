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
    slug: "maceta-bulbasaur",
    name: "Maceta Bulbasaur",
    categorySlug: "funcionales",
    description: `Macetero impreso en 3D, capa a capa. 🌿
Un detalle que le da vida a tu escritorio, repisa o ventana. Hecho en Cusco, a medida y en el color que tú elijas.
¿Quieres uno? Escríbenos por mensaje y lo diseñamos contigo.
#MusuqStudio #Impresión3D #Cusco #Macetero`,
    images: [
      {
        src: "https://res.cloudinary.com/ckqk2mvr/image/upload/v1794586985/adnwebs/maceta-bulbasaur-planta.jpg",
        alt: "Maceta Bulbasaur con planta",
      },
    ],
    variants: [
      { id: "mb-con-planta", label: "Con planta", kind: "material", priceCents: 3500, stock: 10 },
    ],
    featured: true,
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
