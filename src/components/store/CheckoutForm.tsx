import { useState, useSyncExternalStore } from "react";

import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/config/store";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeCart,
} from "@/lib/store/cart";
import {
  formatMoney,
  resolveLines,
  shippingCents,
  subtotalCents,
  totalCents,
} from "@/lib/store/pricing";
import { placeOrder, type PlaceOrderResult, type ShippingInfo } from "@/lib/store/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FieldKey = keyof ShippingInfo;
type Errors = Partial<Record<FieldKey, string>>;

const FIELDS: {
  key: FieldKey;
  label: string;
  type: string;
  autoComplete: string;
  required: boolean;
}[] = [
  { key: "name", label: "Nombre", type: "text", autoComplete: "name", required: true },
  { key: "email", label: "Correo electrónico", type: "email", autoComplete: "email", required: true },
  { key: "phone", label: "Teléfono", type: "tel", autoComplete: "tel", required: true },
  { key: "address", label: "Dirección", type: "text", autoComplete: "street-address", required: true },
  { key: "city", label: "Ciudad", type: "text", autoComplete: "address-level2", required: true },
  { key: "region", label: "Región", type: "text", autoComplete: "address-level1", required: true },
];

const EMPTY_VALUES: ShippingInfo = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  region: "",
  reference: "",
};

function validate(values: ShippingInfo): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Escribe tu nombre.";
  if (!values.email.trim()) errors.email = "Escribe tu correo electrónico.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Escribe un correo electrónico válido.";
  const digits = values.phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Escribe tu teléfono.";
  else if (digits.length < 6)
    errors.phone = "El teléfono debe tener al menos 6 dígitos.";
  if (!values.address.trim()) errors.address = "Escribe tu dirección.";
  if (!values.city.trim()) errors.city = "Escribe tu ciudad.";
  if (!values.region.trim()) errors.region = "Escribe tu región.";
  return errors;
}

export default function CheckoutForm() {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const { lines } = resolveLines(items);
  const subtotal = subtotalCents(lines);
  const shipping = shippingCents(lines);
  const total = totalCents(lines);

  const [values, setValues] = useState<ShippingInfo>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [serverError, setServerError] = useState<Extract<PlaceOrderResult, { ok: false }> | null>(
    null,
  );

  const errorList = Object.entries(errors);

  function update(key: FieldKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setServerError(null);
    const firstInvalid = (Object.keys(nextErrors) as FieldKey[]).find(
      (key) => nextErrors[key],
    );
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSaving(true);
    const result = placeOrder({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      region: values.region.trim(),
      reference: values.reference?.trim() || undefined,
    });

    if (result.ok) {
      setRedirecting(true);
      window.location.href = `/tienda/pedido-confirmado?id=${result.orderId}`;
      return;
    }

    setSaving(false);
    if (result.error === "empty") {
      window.location.href = "/tienda/carrito";
      return;
    }
    setServerError(result);
  }

  if (lines.length === 0 && !redirecting) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-medium">Tu carrito está vacío</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Agrega productos antes de continuar con el checkout.
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
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {errorList.length > 0 ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            Revisa los campos marcados: {errorList.length} con error.
          </div>
        ) : null}

        {serverError ? (
          <div
            role="alert"
            className="space-y-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            <p>
              Algunos productos ya no están disponibles ({serverError.removed.length}).
            </p>
            <a href="/tienda/carrito" className="underline underline-offset-4">
              Volver al carrito
            </a>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map((field) => {
            const error = errors[field.key];
            const describedBy = error ? `${field.key}-error` : undefined;
            return (
              <div
                key={field.key}
                className={field.key === "address" ? "sm:col-span-2" : undefined}
              >
                <Label htmlFor={field.key} className="mb-1.5">
                  {field.label}
                  {field.required ? (
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  ) : null}
                </Label>
                <Input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  value={values[field.key] ?? ""}
                  onChange={(event) => update(field.key, event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  className="h-11"
                />
                {error ? (
                  <p id={`${field.key}-error`} className="mt-1 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}

          <div className="sm:col-span-2">
            <Label htmlFor="reference" className="mb-1.5">
              Referencia (opcional)
            </Label>
            <Textarea
              id="reference"
              name="reference"
              value={values.reference ?? ""}
              onChange={(event) => update("reference", event.target.value)}
              className="min-h-11"
            />
          </div>
        </div>

        <Button type="submit" disabled={saving} aria-busy={saving} className="h-11 px-5">
          {saving ? "Confirmando…" : "Confirmar pedido"}
        </Button>

        <p className="text-sm text-muted-foreground">
          Pago no procesado en esta demostración: el pedido se guarda localmente.
        </p>
      </form>

      <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-medium">Resumen del pedido</h2>
        <ul className="space-y-2 text-sm">
          {lines.map((line) => (
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
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
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
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatMoney(total)}</dd>
          </div>
        </dl>
        {subtotal < FREE_SHIPPING_THRESHOLD_CENTS ? (
          <p className="text-sm text-muted-foreground">
            Te faltan {formatMoney(FREE_SHIPPING_THRESHOLD_CENTS - subtotal)} para envío
            gratis
          </p>
        ) : (
          <p className="text-sm text-emerald-700">Envío gratis</p>
        )}
      </aside>
    </div>
  );
}