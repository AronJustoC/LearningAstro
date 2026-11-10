import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { storeApi } from "@/lib/store/api";
import type {
  StoreCategory,
  StoreProduct,
  StoreProductInput,
} from "@/lib/store/types";

const MAX_IMAGES = 10;
const MAX_DESCRIPTION = 2000;
const SLUG_RE = /^[a-z0-9-]+$/;

type Props = {
  product: StoreProduct | null;
  categories: StoreCategory[];
  onSaved: (product: StoreProduct) => void;
  onCancel: () => void;
};

type ImageRow = { key: number; url: string };
// id solo existe en variantes ya guardadas; las nuevas derivan el id de la etiqueta.
type VariantRow = { key: number; id?: string; label: string; price: string };
type Errors = Record<string, string>;
type ValidationResult = { errors: Errors; body: StoreProductInput | null };

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Acepta "12,5" o "12.5". null = vacío, no numérico o negativo.
function parseSoles(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProductForm({
  product,
  categories,
  onSaved,
  onCancel,
}: Props) {
  const uid = useId();
  const isEdit = product !== null;
  const seq = useRef(0);
  const nextKey = () => ++seq.current;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    product ? (product.priceCents / 100).toFixed(2) : "",
  );
  const [categoryId, setCategoryId] = useState(
    product ? String(product.categoryId) : "",
  );
  const [images, setImages] = useState<ImageRow[]>(() =>
    (product?.images ?? []).map((url) => ({ key: nextKey(), url })),
  );
  const [variants, setVariants] = useState<VariantRow[]>(() =>
    (product?.variants ?? []).map((v) => ({
      key: nextKey(),
      id: v.id,
      label: v.label,
      price: (v.priceCents / 100).toFixed(2),
    })),
  );
  const [soldOut, setSoldOut] = useState(product?.soldOut ?? false);
  const [active, setActive] = useState(product?.active ?? true);
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  const variantId = (v: VariantRow) => v.id ?? slugify(v.label);

  function validate(): ValidationResult {
    const e: Errors = {};
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();
    const trimmedDesc = description.trim();

    if (trimmedName.length < 2) {
      e.name = "El nombre es obligatorio (mínimo 2 caracteres).";
    }
    if (!isEdit) {
      if (!trimmedSlug) e.slug = "El slug es obligatorio.";
      else if (!SLUG_RE.test(trimmedSlug)) {
        e.slug = "Solo minúsculas, números y guiones.";
      }
    }
    if (!trimmedDesc) e.description = "La descripción es obligatoria.";
    else if (trimmedDesc.length > MAX_DESCRIPTION) {
      e.description = `Máximo ${MAX_DESCRIPTION} caracteres.`;
    }
    if (!categoryId) e.categoryId = "Selecciona una categoría.";

    images.forEach((img) => {
      const url = img.url.trim();
      if (url && !isHttpsUrl(url)) {
        e[`image-${img.key}`] = "La URL debe empezar con https://";
      }
    });
    const imageUrls = images.map((img) => img.url.trim()).filter(Boolean);

    const ids = variants.map(variantId);
    variants.forEach((v, i) => {
      if (!v.label.trim()) {
        e[`variant-label-${v.key}`] = "La etiqueta es obligatoria.";
      } else if (!ids[i]) {
        e[`variant-label-${v.key}`] = "La etiqueta debe tener letras o números.";
      } else if (ids.filter((x) => x === ids[i]).length > 1) {
        e[`variant-label-${v.key}`] =
          `El id "${ids[i]}" está repetido. Cambia la etiqueta.`;
      }
      if (parseSoles(v.price) === null) {
        e[`variant-price-${v.key}`] = "Precio inválido (S/ 0 o más).";
      }
    });

    const hasVariants = variants.length > 0;
    const variantCents = variants.map((v) => {
      const p = parseSoles(v.price);
      return p === null ? null : Math.round(p * 100);
    });
    const validVariantCents = variantCents.filter(
      (c): c is number => c !== null,
    );

    // Con variantes, el precio base es el de la más barata (lo calcula la API también).
    let priceCents = 0;
    if (hasVariants) {
      if (validVariantCents.length === variants.length) {
        priceCents = Math.min(...validVariantCents);
      }
    } else {
      const p = parseSoles(basePrice);
      if (p === null) e.basePrice = "El precio base es obligatorio (S/ 0 o más).";
      else priceCents = Math.round(p * 100);
    }

    if (Object.keys(e).length > 0) return { errors: e, body: null };

    return {
      errors: {},
      body: {
        slug: trimmedSlug,
        name: trimmedName,
        description: trimmedDesc,
        priceCents,
        categoryId: Number(categoryId),
        images: imageUrls,
        variants: variants.map((v, i) => ({
          id: ids[i],
          label: v.label.trim(),
          priceCents: variantCents[i] as number,
        })),
        soldOut,
        active,
      },
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError("");
    const result = validate();
    setErrors(result.errors);
    if (!result.body) return;

    setSaving(true);
    try {
      let saved: StoreProduct;
      if (product) {
        // El slug es inmutable: no se envía en el update.
        const { slug: _slug, ...updateBody } = result.body;
        saved = await storeApi.updateProduct(product.id, updateBody);
      } else {
        saved = await storeApi.createProduct(result.body);
      }
      onSaved(saved);
    } catch (err) {
      // La API no expone el status HTTP: un 409 llega solo como mensaje (slug duplicado).
      setApiError(
        err instanceof Error ? err.message : "No se pudo guardar el producto.",
      );
    } finally {
      setSaving(false);
    }
  }

  function addImage() {
    const key = nextKey();
    setImages((rows) => [...rows, { key, url: "" }]);
  }

  function addVariant() {
    const key = nextKey();
    setVariants((rows) => [...rows, { key, label: "", price: "" }]);
  }

  const hasVariants = variants.length > 0;
  const minVariantSoles = hasVariants
    ? variants
        .map((v) => parseSoles(v.price))
        .filter((p): p is number => p !== null)
        .reduce<number | null>((min, p) => (min === null || p < min ? p : min), null)
    : null;

  const fieldId = (name: string) => `${uid}-${name}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {apiError && (
        <div
          role="alert"
          className="rounded-[2px] border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {apiError}
        </div>
      )}

      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Datos
        </h3>

        <div className="space-y-1.5">
          <Label htmlFor={fieldId("name")}>Nombre</Label>
          <Input
            id={fieldId("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            className="rounded-[2px]"
          />
          {errors.name && <FieldError message={errors.name} />}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={fieldId("slug")}>Slug</Label>
          <Input
            id={fieldId("slug")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={isEdit}
            aria-invalid={!!errors.slug}
            placeholder="mi-producto"
            className="rounded-[2px]"
          />
          {isEdit ? (
            <p className="text-xs text-muted-foreground">
              El slug no se puede cambiar.
            </p>
          ) : (
            errors.slug && <FieldError message={errors.slug} />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={fieldId("description")}>Descripción</Label>
          <Textarea
            id={fieldId("description")}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={!!errors.description}
            className="rounded-[2px]"
          />
          <div className="flex justify-between gap-2">
            {errors.description ? (
              <FieldError message={errors.description} />
            ) : (
              <span />
            )}
            <span className="text-xs text-muted-foreground">
              {description.length}/{MAX_DESCRIPTION}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={fieldId("category")}>Categoría</Label>
          <select
            id={fieldId("category")}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-invalid={!!errors.categoryId}
            className="h-8 w-full rounded-[2px] border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <FieldError message={errors.categoryId} />}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={fieldId("basePrice")}>
            {hasVariants
              ? "Precio base (S/), calculado"
              : "Precio base (S/)"}
          </Label>
          {hasVariants ? (
            <p className="text-sm">
              {minVariantSoles !== null
                ? `S/ ${minVariantSoles.toFixed(2)}`
                : "—"}{" "}
              <span className="text-xs text-muted-foreground">
                (variante más barata)
              </span>
            </p>
          ) : (
            <Input
              id={fieldId("basePrice")}
              inputMode="decimal"
              placeholder="0.00"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              aria-invalid={!!errors.basePrice}
              className="rounded-[2px]"
            />
          )}
          {errors.basePrice && <FieldError message={errors.basePrice} />}
        </div>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Imágenes ({images.length}/{MAX_IMAGES})
        </h3>

        {images.map((img, i) => (
          <div key={img.key} className="space-y-2 border-t border-border pt-4">
            <ImageUploadField
              idPrefix={`${uid}-img${img.key}-`}
              label={`Imagen ${i + 1}`}
              value={img.url}
              onChange={(url) =>
                setImages((rows) =>
                  rows.map((r) => (r.key === img.key ? { ...r, url } : r)),
                )
              }
            />
            {errors[`image-${img.key}`] && (
              <FieldError message={errors[`image-${img.key}`]} />
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setImages((rows) => rows.filter((r) => r.key !== img.key))
              }
            >
              Eliminar imagen
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="rounded-[2px]"
          onClick={addImage}
          disabled={images.length >= MAX_IMAGES}
        >
          Agregar imagen
        </Button>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <h3 className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Variantes
        </h3>

        {variants.map((v) => {
          const id = variantId(v);
          return (
            <div
              key={v.key}
              className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start"
            >
              <div className="space-y-1.5">
                <Label htmlFor={fieldId(`vl-${v.key}`)}>Etiqueta</Label>
                <Input
                  id={fieldId(`vl-${v.key}`)}
                  value={v.label}
                  placeholder="Ej. 500 g"
                  aria-invalid={!!errors[`variant-label-${v.key}`]}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((r) =>
                        r.key === v.key ? { ...r, label: e.target.value } : r,
                      ),
                    )
                  }
                  className="rounded-[2px]"
                />
                {errors[`variant-label-${v.key}`] && (
                  <FieldError message={errors[`variant-label-${v.key}`]} />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={fieldId(`vp-${v.key}`)}>Precio (S/)</Label>
                <Input
                  id={fieldId(`vp-${v.key}`)}
                  inputMode="decimal"
                  placeholder="0.00"
                  value={v.price}
                  aria-invalid={!!errors[`variant-price-${v.key}`]}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((r) =>
                        r.key === v.key ? { ...r, price: e.target.value } : r,
                      ),
                    )
                  }
                  className="rounded-[2px]"
                />
                {errors[`variant-price-${v.key}`] && (
                  <FieldError message={errors[`variant-price-${v.key}`]} />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={fieldId(`vi-${v.key}`)}>Id</Label>
                <Input
                  id={fieldId(`vi-${v.key}`)}
                  value={id}
                  disabled
                  className="rounded-[2px]"
                />
                {!v.id && (
                  <p className="text-xs text-muted-foreground">
                    Se genera desde la etiqueta.
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="sm:mt-6"
                onClick={() =>
                  setVariants((rows) => rows.filter((r) => r.key !== v.key))
                }
              >
                Quitar variante
              </Button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="rounded-[2px]"
          onClick={addVariant}
        >
          Agregar variante
        </Button>
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <Label className="cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="size-4 accent-[var(--color-action)]"
          />
          Activo
        </Label>
        <Label className="cursor-pointer">
          <input
            type="checkbox"
            checked={soldOut}
            onChange={(e) => setSoldOut(e.target.checked)}
            className="size-4 accent-[var(--color-action)]"
          />
          Agotado
        </Label>
      </section>

      <div className="flex justify-end gap-2 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-[2px]"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button type="submit" className="rounded-[2px]" disabled={saving}>
          {saving
            ? "Guardando..."
            : isEdit
              ? "Guardar cambios"
              : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="text-sm text-destructive">{message}</p>;
}
