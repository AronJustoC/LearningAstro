export type StoreVariant = {
  id: string;
  label: string;
  priceCents: number;
};

export type StoreCategory = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
};

export type StoreProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  categoryId: number;
  images: string[];
  variants: StoreVariant[];
  soldOut: boolean;
  active: boolean;
  category?: StoreCategory;
};

export type StoreCategoryInput = {
  slug: string;
  name: string;
  description?: string;
  sortOrder?: number;
};

export type StoreProductInput = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  categoryId: number;
  images: string[];
  variants: StoreVariant[];
  soldOut?: boolean;
  active?: boolean;
};
