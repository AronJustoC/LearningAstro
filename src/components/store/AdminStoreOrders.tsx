import { useEffect, useState } from "react";
import { listOrders, type Order } from "@/lib/store/orders";
import { formatMoney } from "@/lib/store/pricing";

export default function AdminStoreOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(listOrders());
  }, []);

  if (orders === null) return null;

  if (orders.length === 0) {
    return <p className="text-[var(--color-text)]/70">Aún no hay pedidos en este navegador.</p>;
  }

  return (
    <ul className="divide-y divide-[var(--hairline)] border border-[var(--hairline)] bg-[var(--color-bg)]">
      {orders.map((order) => {
        const items = order.lines.reduce((sum, line) => sum + line.qty, 0);
        return (
          <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-[var(--color-text)]">
            <span className="font-mono text-xs text-[var(--color-text)]/70">{order.id}</span>
            <span className="text-[var(--color-text)]/70">{new Date(order.createdAt).toLocaleString()}</span>
            <span>{items} artículo{items === 1 ? "" : "s"}</span>
            <span className="tabular-nums">{formatMoney(order.totalCents)}</span>
          </li>
        );
      })}
    </ul>
  );
}
