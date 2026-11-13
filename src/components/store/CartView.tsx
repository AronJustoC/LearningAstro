import { useSyncExternalStore } from "react";

import { getProduct, getVariant } from "@/data/catalog";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/config/store";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  removeFromCart,
  setQty,
  subscribeCart,
} from "@/lib/store/cart";
import { whatsappUrl } from "@/lib/contact";
import {
  clampQty,
  formatMoney,
  resolveLines,
  shippingCents,
  subtotalCents,
  totalCents,
  type ResolvedLine,
} from "@/lib/store/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function pedidoMensaje(lines: ResolvedLine[], totalCents: number): string {
  const detalle = lines
    .map((l) => `- ${l.productName} (${l.variantLabel}) x${l.qty}: ${formatMoney(l.lineTotalCents)}`)
    .join("\n");
  return `Hola Aron, quiero pedir:\n${detalle}\nTotal: ${formatMoney(totalCents)}`;
}

export default function CartView() {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const { lines, removed } = resolveLines(items);
  const subtotal = subtotalCents(lines);
  const shipping = shippingCents(lines);
  const total = totalCents(lines);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-medium">Tu carrito está vacío</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Explora el catálogo y agrega tus piezas favoritas.
        </p>
        <a
          href="/tienda"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Ver catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {removed.length > 0 ? (
        <p
          role="status"
          className="rounded-lg border border-border bg-muted px-3 py-2 text-sm"
        >
          Quitamos {removed.length} productos que ya no están disponibles.
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {lines.map((line) => {
            const product = getProduct(line.productSlug);
            const variant = product ? getVariant(product, line.variantId) : undefined;
            const stock = variant?.stock ?? line.qty;
            return (
              <li
                key={`${line.productSlug}-${line.variantId}`}
                className="store-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="store-title">{line.productName}</p>
                  <p className="text-sm text-muted-foreground">{line.variantLabel}</p>
                  <p className="store-price mt-1 text-sm tabular-nums">
                    {formatMoney(line.unitPriceCents)} c/u
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={Math.max(1, stock)}
                    value={line.qty}
                    aria-label={`Cantidad de ${line.productName}, ${line.variantLabel}`}
                    onChange={(event) =>
                      setQty(
                        line.productSlug,
                        line.variantId,
                        clampQty(Number(event.target.value), stock),
                      )
                    }
                    className="h-11 w-20 text-center"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="btn-glass h-11 px-3"
                    onClick={() => removeFromCart(line.productSlug, line.variantId)}
                  >
                    Quitar
                  </Button>
                </div>

                <p className="store-price text-sm tabular-nums sm:w-28 sm:text-right">
                  {formatMoney(line.lineTotalCents)}
                </p>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-medium">Resumen</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd className="tabular-nums">
                {shipping === 0 ? "Gratis" : formatMoney(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMoney(total)}</dd>
            </div>
          </dl>

          {subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? (
            <p className="text-sm text-emerald-700">Envío gratis</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Te faltan {formatMoney(FREE_SHIPPING_THRESHOLD_CENTS - subtotal)} para envío
              gratis
            </p>
          )}

          <a
            href={lines.length > 0 ? "/tienda/checkout" : undefined}
            aria-disabled={lines.length === 0}
            tabIndex={lines.length === 0 ? -1 : undefined}
            className={[
              "btn-block inline-flex h-11 w-full items-center justify-center px-5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              lines.length === 0 ? "pointer-events-none opacity-50" : "",
            ].join(" ")}
          >
            Ir al checkout
          </a>
        </aside>
      </div>
    </div>
  );
}