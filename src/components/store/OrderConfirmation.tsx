import { useEffect, useRef, useState } from "react";

import { formatMoney } from "@/lib/store/pricing";
import { getOrder, type Order } from "@/lib/store/orders";

type State = {
  loaded: boolean;
  order?: Order;
};

export default function OrderConfirmation() {
  const [state, setState] = useState<State>({ loaded: false });
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") ?? "";
    setState({ loaded: true, order: id ? getOrder(id) : undefined });
  }, []);

  useEffect(() => {
    if (state.loaded && state.order) headingRef.current?.focus();
  }, [state.loaded, state.order]);

  if (!state.loaded) {
    return (
      <div>
        <div className="space-y-3" aria-hidden="true">
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
        <p className="sr-only">Cargando pedido</p>
      </div>
    );
  }

  const { order } = state;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-lg font-medium">No encontramos ese pedido</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Puede que el enlace esté incompleto o que el pedido ya no exista.
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
    <div className="space-y-8">
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="rounded text-3xl font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Pedido recibido
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Número de pedido:{" "}
          <span className="font-medium text-foreground">{order.id.slice(0, 8)}</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section aria-label="Productos del pedido" className="space-y-3">
          <h2 className="text-lg font-medium">Productos</h2>
          <ul className="space-y-2 rounded-xl border border-border p-4 text-sm">
            {order.lines.map((line) => (
              <li
                key={`${line.productSlug}-${line.variantId}`}
                className="flex justify-between gap-3"
              >
                <span className="min-w-0">
                  {line.productName}
                  <span className="text-muted-foreground"> · {line.variantLabel}</span>
                  <span className="text-muted-foreground"> × {line.qty}</span>
                </span>
                <span className="tabular-nums">{formatMoney(line.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-lg font-medium">Totales</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatMoney(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd className="tabular-nums">
                  {order.shippingCents === 0 ? "Gratis" : formatMoney(order.shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatMoney(order.totalCents)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-lg font-medium">Datos de envío</h2>
            <address className="space-y-1 text-sm not-italic">
              <p>{order.shipping.name}</p>
              <p>{order.shipping.address}</p>
              <p>
                {order.shipping.city}, {order.shipping.region}
              </p>
              <p>{order.shipping.phone}</p>
              <p>{order.shipping.email}</p>
              {order.shipping.reference ? (
                <p className="text-muted-foreground">
                  Referencia: {order.shipping.reference}
                </p>
              ) : null}
            </address>
          </div>
        </aside>
      </div>

      <p className="text-sm text-muted-foreground">
        Pago pendiente: pedido guardado localmente (demostración)
      </p>
    </div>
  );
}