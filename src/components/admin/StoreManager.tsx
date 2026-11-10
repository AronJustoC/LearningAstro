import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryManager from "@/components/admin/CategoryManager";
import ProductForm from "@/components/admin/ProductForm";
import { storeApi } from "@/lib/store/api";
import type { StoreCategory, StoreProduct } from "@/lib/store/types";

type Tab = "productos" | "categorias";

const CONNECTION_ERROR = "No se pudo conectar con el servidor.";

function errorMessage(err: unknown): string {
  return err instanceof Error && err.message ? err.message : CONNECTION_ERROR;
}

function formatSoles(cents: number): string {
  return `S/ ${(cents / 100).toFixed(2)}`;
}

function tabClass(active: boolean): string {
  return `-mb-px border-b-2 px-1 pb-2 text-sm font-medium transition-colors ${
    active
      ? "border-[var(--color-action)] text-foreground"
      : "border-transparent text-muted-foreground hover:text-foreground"
  }`;
}

export default function StoreManager() {
  const [tab, setTab] = useState<Tab>("productos");
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StoreProduct | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<StoreProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        storeApi.listAdminProducts(),
        storeApi.listPublicCategories(),
      ]);
      setProducts(productsData.products ?? []);
      setCategories(categoriesData.categories ?? []);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const visible = useMemo(
    () =>
      categoryFilter
        ? products.filter((p) => String(p.categoryId) === categoryFilter)
        : products,
    [products, categoryFilter],
  );

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: StoreProduct) {
    setEditing(product);
    setFormOpen(true);
  }

  function handleSaved() {
    setFormOpen(false);
    setEditing(null);
    loadAll();
  }

  // Optimista: se aplica al instante y se revierte si el servidor falla.
  async function handleSoldOut(product: StoreProduct) {
    const next = !product.soldOut;
    const setSoldOutLocal = (soldOut: boolean) =>
      setProducts((rows) =>
        rows.map((r) => (r.id === product.id ? { ...r, soldOut } : r)),
      );
    setError("");
    setSoldOutLocal(next);
    try {
      await storeApi.setSoldOut(product.id, next);
    } catch (err) {
      setSoldOutLocal(product.soldOut);
      setError(errorMessage(err));
    }
  }

  async function handleToggleActive(product: StoreProduct) {
    const next = !product.active;
    setBusyId(product.id);
    setError("");
    try {
      await storeApi.updateProduct(product.id, { active: next });
      setProducts((rows) =>
        rows.map((r) => (r.id === product.id ? { ...r, active: next } : r)),
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleting(true);
    setError("");
    try {
      await storeApi.deleteProduct(id);
      setProducts((rows) => rows.filter((r) => r.id !== id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <nav className="flex gap-6 border-b border-border" aria-label="Secciones de tienda">
        <button type="button" className={tabClass(tab === "productos")} onClick={() => setTab("productos")}>
          Productos
        </button>
        <button type="button" className={tabClass(tab === "categorias")} onClick={() => setTab("categorias")}>
          Categorías
        </button>
      </nav>

      {tab === "categorias" ? (
        <CategoryManager />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="store-category-filter" className="text-sm text-muted-foreground">
                Categoría
              </label>
              <select
                id="store-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-8 rounded-[2px] border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="button" onClick={openNew} className="min-h-10 rounded-[2px] px-5 font-medium">
              Nuevo producto
            </Button>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-[2px] border border-[var(--destructive)] px-4 py-3 text-sm text-[var(--destructive)]"
            >
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : visible.length === 0 ? (
            <div className="rounded-[2px] border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">No hay productos todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[2px] border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Nombre</th>
                    <th className="px-4 py-2.5 font-medium">Categoría</th>
                    <th className="px-4 py-2.5 font-medium">Precio base</th>
                    <th className="px-4 py-2.5 font-medium">Variantes</th>
                    <th className="px-4 py-2.5 font-medium">Estado</th>
                    <th className="px-4 py-2.5 font-medium">Agotado</th>
                    <th className="px-4 py-2.5 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visible.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {product.category?.name ??
                          categories.find((c) => c.id === product.categoryId)?.name ??
                          "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{formatSoles(product.priceCents)}</td>
                      <td className="px-4 py-3 tabular-nums">{product.variants?.length ?? 0}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-[2px] border px-2 py-0.5 text-xs font-medium ${
                            product.active
                              ? "border-[var(--color-action)] text-[var(--color-action)]"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {product.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSoldOut(product)}
                          className="min-h-9 rounded-[2px] px-3"
                        >
                          {product.soldOut ? "Quitar agotado" : "Marcar agotado"}
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(product)}
                            className="min-h-9 rounded-[2px] px-3"
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={busyId === product.id}
                            onClick={() => handleToggleActive(product)}
                            className="min-h-9 rounded-[2px] px-3"
                          >
                            {product.active ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(product)}
                            className="min-h-9 rounded-[2px] px-3 text-[var(--destructive)] hover:text-[var(--destructive)]"
                          >
                            Borrar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="rounded-[2px] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editing ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editing}
            categories={categories}
            onSaved={handleSaved}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="rounded-[2px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Borrar producto</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `¿Seguro que quieres borrar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
              className="rounded-[2px]"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="min-h-10 rounded-[2px] px-5 font-medium bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90"
            >
              {deleting ? "Borrando..." : "Borrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
