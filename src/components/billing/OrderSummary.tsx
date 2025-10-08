import React from "react";

type OrderItem = {
  name: string;
  qty: number;
  price: number; // already multiplied by qty
};

type PickupInfo = {
  name?: string;
  method?: string;   // "Delivery" | "Click & Collect"
  address?: string;
};

type Props = {
  pickupInfo?: PickupInfo;
  items: OrderItem[];
  subtotal: number;
  total: number;
  className?: string;
};

export default function OrderSummary({
  pickupInfo,
  items,
  subtotal,
  total,
  className = "",
}: Props) {
  return (
    <aside
      className={`rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm w-full max-w-md ${className}`}
      aria-label="Order Summary"
    >
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

      {/* Pickup info */}
      <section className="mb-4">
        <h3 className="font-semibold text-neutral-700">Pickup Information</h3>
        <div className="mt-1 space-y-1 text-sm text-neutral-700">
          <p>{pickupInfo?.name ?? "Guest"}</p>
          <p>{pickupInfo?.method ?? "Click & Collect"}</p>
          <p className="text-neutral-600">
            {pickupInfo?.address ?? "Restaurant Address"}
          </p>
        </div>
      </section>

      {/* Items */}
      <section className="mb-4 border-t border-neutral-200 pt-3">
        <h3 className="font-semibold text-neutral-700 mb-2">Order Details</h3>
        <ul className="space-y-1 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex justify-between">
              <span className="text-neutral-700">
                {it.name} × {it.qty}
              </span>
              <span className="font-medium">£{it.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Totals */}
      <section className="border-t border-neutral-200 pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600">Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>

        <div className="h-px bg-neutral-200 my-2" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </section>
    </aside>
  );
}
