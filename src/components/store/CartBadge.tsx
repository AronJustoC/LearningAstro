import { useSyncExternalStore } from "react";

import {
  cartCount,
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeCart,
} from "@/lib/store/cart";
import { resolveLines } from "@/lib/store/pricing";

export default function CartBadge() {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );
  const count = cartCount(resolveLines(items).lines);
  const label = count > 0 ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}` : "Carrito, vacío";

  return (
    <a
      href="/tienda/carrito"
      aria-label={label}
      className="relative inline-flex size-11 items-center justify-center rounded-lg text-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.2l2.1 11.2h11.4l2.1-7.9H6" />
      </svg>
      {count > 0 ? (
        <span
          aria-hidden="true"
          style={{ borderRadius: "9999px" }}
          className="absolute -top-0.5 -right-0.5 inline-flex min-w-5 items-center justify-center bg-primary px-1 text-xs font-medium text-primary-foreground tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </a>
  );
}