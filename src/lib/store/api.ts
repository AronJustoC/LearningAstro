// Client API for store products and categories.
import type {
  StoreCategory,
  StoreProduct,
  StoreCategoryInput,
  StoreProductInput,
} from "./types";

const BASE_URL = `${import.meta.env.PUBLIC_API_BASE_URL}/store`;

function authHeaders() {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
    } catch {}
    throw Object.assign(new Error(message), { status: res.status });
  }
  return res.json().catch(() => ({} as T));
}

export const storeApi = {
  async listPublicProducts(): Promise<{ products: StoreProduct[] }> {
    const res = await fetch(`${BASE_URL}/products`);
    return handleResponse<{ products: StoreProduct[] }>(res);
  },

  async getPublicProduct(slug: string): Promise<StoreProduct> {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(slug)}`);
    return handleResponse<StoreProduct>(res);
  },

  async listPublicCategories(): Promise<{ categories: StoreCategory[] }> {
    const res = await fetch(`${BASE_URL}/categories`);
    return handleResponse<{ categories: StoreCategory[] }>(res);
  },

  async listAdminProducts(): Promise<{ products: StoreProduct[] }> {
    const res = await fetch(`${BASE_URL}/admin/products`, {
      headers: authHeaders(),
    });
    return handleResponse<{ products: StoreProduct[] }>(res);
  },

  async createCategory(data: StoreCategoryInput): Promise<StoreCategory> {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<StoreCategory>(res);
  },

  async updateCategory(
    id: number | string,
    data: Partial<StoreCategoryInput>
  ): Promise<StoreCategory> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<StoreCategory>(res);
  },

  async deleteCategory(id: number | string): Promise<{ success?: boolean } | void> {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse<{ success?: boolean } | void>(res);
  },

  async createProduct(data: StoreProductInput): Promise<StoreProduct> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<StoreProduct>(res);
  },

  async updateProduct(
    id: number | string,
    data: Partial<StoreProductInput>
  ): Promise<StoreProduct> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<StoreProduct>(res);
  },

  async setSoldOut(
    id: number | string,
    soldOut: boolean
  ): Promise<StoreProduct> {
    const res = await fetch(`${BASE_URL}/products/${id}/sold-out`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ soldOut }),
    });
    return handleResponse<StoreProduct>(res);
  },

  async deleteProduct(id: number | string): Promise<{ success?: boolean } | void> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse<{ success?: boolean } | void>(res);
  },
};
