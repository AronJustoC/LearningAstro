import { useState } from "react";

import type { Product } from "@/data/catalog";
import { addToCart, getCartSnapshot } from "@/lib/store/cart";
import { clampQty, formatMoney } from "@/lib/store/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  product: Product;
};

export default function ProductBuy({ product }: Props) {
  const initial = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(initial?.id ?? "");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("");

  const selected = product.variants.find((v) => v.id === variantId);
  const stock = selected?.stock ?? 0;
  const soldOut = !selected || stock <= 0;

  function changeVariant(id: string) {
    setVariantId(id);
    const next = product.variants.find((v) => v.id === id);
    setQty((current) => clampQty(current, next?.stock ?? 0));
    setStatus("");
  }

  function changeQty(next: number) {
    if (!selected) return;
    setQty(clampQty(next, selected.stock));
  }

  function handleAdd() {
    if (!selected || selected.stock <= 0) return;
    const currentQty =
      getCartSnapshot().find(
        (i) => i.productSlug === product.slug && i.variantId === selected.id,
      )?.qty ?? 0;
    addToCart(product.slug, selected.id, qty);
    const nextQty =
      getCartSnapshot().find(
        (i) => i.productSlug === product.slug && i.variantId === selected.id,
      )?.qty ?? 0;
    setStatus(
      nextQty < currentQty + qty ? "Ya tienes el máximo disponible" : "Agregado al carrito",
    );
  }

  return (
    <div className="space-y-6">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Variante</legend>
        <div className="space-y-2">
          {product.variants.map((variant) => {
            const out = variant.stock <= 0;
            const checked = variant.id === variantId;
            return (
              <label
                key={variant.id}
                className={[
                  "btn-glass flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2",
                  checked ? "ring-2 ring-ring/40" : "",
                  out ? "cursor-not-allowed opacity-60" : "",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`variant-${product.slug}`}
                    value={variant.id}
                    checked={checked}
                    disabled={out}
                    onChange={() => changeVariant(variant.id)}
                    className="size-4"
                  />
                  <span>{variant.label}</span>
                  {out ? (
                    <span className="text-xs text-muted-foreground">Agotado</span>
                  ) : null}
                </span>
                <span className="text-sm tabular-nums">{formatMoney(variant.priceCents)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {selected ? (
        <div className="space-y-1">
          <p className="store-price text-2xl">
            {formatMoney(selected.priceCents)}
          </p>
          {stock > 0 ? (
            <p className="text-sm text-muted-foreground">
              {stock <= 3 ? `Últimas ${stock} unidades` : `Quedan ${stock}`}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Agotado</p>
          )}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11"
          aria-label="Disminuir cantidad"
          onClick={() => changeQty(qty - 1)}
          disabled={soldOut || qty <= 1}
        >
          −
        </Button>
        <Input
          id="cantidad"
          type="number"
          inputMode="numeric"
          min={1}
          max={Math.max(1, stock)}
          value={qty}
          aria-label="Cantidad"
          disabled={soldOut}
          onChange={(event) => changeQty(Number(event.target.value))}
          className="h-11 w-20 text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11"
          aria-label="Aumentar cantidad"
          onClick={() => changeQty(qty + 1)}
          disabled={soldOut || qty >= stock}
        >
          +
        </Button>
      </div>

      <Button
        type="button"
        className="btn-block h-11"
        onClick={handleAdd}
        disabled={soldOut}
      >
        Agregar al carrito
      </Button>

      <p role="status" aria-live="polite" className="min-h-5 text-sm">
        {status}
      </p>
    </div>
  );
}