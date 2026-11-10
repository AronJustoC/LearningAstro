import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { storeApi } from "@/lib/store/api";
import type { StoreCategory, StoreCategoryInput } from "@/lib/store/types";

type FormState = {
  name: string;
  slug: string;
  description: string;
  sortOrder: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: "", slug: "", description: "", sortOrder: "0" };
const SLUG_RE = /^[a-z0-9-]+$/;
const CONNECTION_ERROR = "No se pudo conectar con el servidor.";

function errorMessage(err: unknown): string {
  return err instanceof Error && err.message ? err.message : CONNECTION_ERROR;
}

const fieldClass =
  "h-10 rounded-[2px] border-border transition-colors focus-visible:ring-2 focus-visible:ring-ring";
const textareaClass =
  "w-full rounded-[2px] border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export default function CategoryManager() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<StoreCategory | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await storeApi.listPublicCategories();
      setCategories(data.categories ?? []);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(category: StoreCategory) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sortOrder: String(category.sortOrder ?? 0),
    });
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const slug = form.slug.trim();
    const sortOrderText = form.sortOrder.trim();
    const sortOrder = Number(sortOrderText);

    const errors: FormErrors = {};
    if (name.length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (editingId === null) {
      if (!slug) {
        errors.slug = "El slug es obligatorio.";
      } else if (!SLUG_RE.test(slug)) {
        errors.slug = "Usa solo minúsculas, números y guiones.";
      }
    }
    if (sortOrderText === "" || !Number.isInteger(sortOrder)) {
      errors.sortOrder = "El orden debe ser un número entero.";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setFormError("");
    try {
      const description = form.description.trim();
      if (editingId === null) {
        const input: StoreCategoryInput = { name, slug, description, sortOrder };
        await storeApi.createCategory(input);
      } else {
        await storeApi.updateCategory(editingId, { name, description, sortOrder });
      }
      setFormOpen(false);
      await loadCategories();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function openDelete(category: StoreCategory) {
    setDeleteError("");
    setDeleteTarget(category);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await storeApi.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      const message = errorMessage(err);
      // handleResponse no expone el status: el 409 llega como "Request failed (409)"
      setDeleteError(
        /productos|409/i.test(message)
          ? "No se puede borrar: la categoría tiene productos."
          : message,
      );
    } finally {
      setDeleting(false);
    }
  }

  const sorted = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Categorías
        </h2>
        <Button
          type="button"
          onClick={openCreate}
          className="min-h-10 rounded-[2px] px-5 font-medium"
        >
          Nueva categoría
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
        <div className="space-y-2" aria-busy="true" aria-label="Cargando categorías">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 rounded-[2px] bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-[2px] border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">No hay categorías todavía.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[2px] border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Nombre</th>
                <th className="px-4 py-2.5 font-medium">Slug</th>
                <th className="px-4 py-2.5 font-medium">Orden</th>
                <th className="px-4 py-2.5 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((category) => (
                <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{category.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{category.sortOrder ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(category)}
                        className="min-h-9 rounded-[2px] px-3"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openDelete(category)}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="rounded-[2px] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              {editingId === null ? "Nueva categoría" : "Editar categoría"}
            </DialogTitle>
            <DialogDescription>
              {editingId === null
                ? "Crea una categoría para agrupar productos."
                : "El slug no se puede cambiar."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} aria-busy={saving} className="space-y-4">
            {formError && (
              <div
                role="alert"
                className="rounded-[2px] border border-[var(--destructive)] px-3 py-2 text-sm text-[var(--destructive)]"
              >
                {formError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="category-name">Nombre</Label>
              <Input
                id="category-name"
                required
                minLength={2}
                disabled={saving}
                value={form.name}
                aria-invalid={!!fieldErrors.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={fieldClass}
              />
              {fieldErrors.name && (
                <p className="text-xs text-[var(--destructive)]">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                required={editingId === null}
                disabled={saving || editingId !== null}
                value={form.slug}
                aria-invalid={!!fieldErrors.slug}
                placeholder="ej: aceites-esenciales"
                onChange={(e) => updateField("slug", e.target.value)}
                className={`${fieldClass} font-mono`}
              />
              {fieldErrors.slug && (
                <p className="text-xs text-[var(--destructive)]">{fieldErrors.slug}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-description">Descripción</Label>
              <textarea
                id="category-description"
                rows={3}
                disabled={saving}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={textareaClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-sort-order">Orden</Label>
              <Input
                id="category-sort-order"
                type="number"
                step={1}
                disabled={saving}
                value={form.sortOrder}
                aria-invalid={!!fieldErrors.sortOrder}
                onChange={(e) => updateField("sortOrder", e.target.value)}
                className={fieldClass}
              />
              {fieldErrors.sortOrder && (
                <p className="text-xs text-[var(--destructive)]">{fieldErrors.sortOrder}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={saving}
                onClick={() => setFormOpen(false)}
                className="rounded-[2px]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="min-h-10 rounded-[2px] px-5 font-medium"
              >
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
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
            <DialogTitle className="font-heading text-lg">Borrar categoría</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `¿Seguro que quieres borrar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div
              role="alert"
              className="rounded-[2px] border border-[var(--destructive)] px-3 py-2 text-sm text-[var(--destructive)]"
            >
              {deleteError}
            </div>
          )}

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
