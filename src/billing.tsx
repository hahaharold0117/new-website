import React, { useMemo, useState } from "react";
import OrderSummary from "@/components/billing/OrderSummary";

type Method = "Delivery" | "Click & Collect";
type Payment = "cash" | "card";

export default function BillingPage() {
  const [method, setMethod] = useState<Method>("Click & Collect");
  const [payment, setPayment] = useState<Payment>("cash");
  const [tip, setTip] = useState<number>(0);

  // demo data — swap with Redux/cart data
  const items = useMemo(
    () => [
      { name: "Turkish Lentil Soup", qty: 1, price: 250 },
      { name: "Supermix Pizza", qty: 2, price: 49 * 2 }, // price is total for that line
      { name: "Extras", qty: 2, price: 49 * 2 },
    ],
    []
  );

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price, 0),
    [items]
  );
  const total = useMemo(() => subtotal + tip, [subtotal, tip]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Page title + breadcrumb (static for UI) */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Billing Details</h1>
        <nav className="mt-2 text-sm text-neutral-500">
          <ol className="flex items-center gap-2">
            <li>Home</li>
            <li>›</li>
            <li>Menu</li>
            <li>›</li>
            <li>Basket</li>
            <li>›</li>
            <li className="text-neutral-700">Billing</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* LEFT: Billing form */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {/* Method tabs */}
          <div className="mb-5">
            <div
              role="tablist"
              aria-label="Order Method"
              className="inline-flex overflow-hidden rounded-full border border-neutral-300"
            >
              <button
                role="tab"
                aria-selected={method === "Delivery"}
                onClick={() => setMethod("Delivery")}
                className={`px-4 py-1.5 text-sm font-medium transition ${
                  method === "Delivery"
                    ? "bg-[var(--brand)] text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Delivery
              </button>
              <button
                role="tab"
                aria-selected={method === "Click & Collect"}
                onClick={() => setMethod("Click & Collect")}
                className={`px-4 py-1.5 text-sm font-medium border-l border-neutral-300 transition ${
                  method === "Click & Collect"
                    ? "bg-[var(--brand)] text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Click & Collect
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name *" placeholder="Placeholder" />
            <Field label="Last Name *" placeholder="Placeholder" />
            <Field label="Email" placeholder="Placeholder" type="email" />
            <Field label="Phone" placeholder="Placeholder" type="tel" />

            <Field label="Pickup Date" placeholder="Placeholder" type="date" />
            <Field label="Pickup Time" placeholder="Placeholder" type="time" />
          </div>

          {/* Tip selector + Payment */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TipBox tip={tip} setTip={setTip} />
            <PaymentBox payment={payment} setPayment={setPayment} />
          </div>

          {/* Place Order */}
          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-[var(--brand)] text-white font-semibold py-3 text-base shadow-sm hover:opacity-90 transition"
            onClick={() => console.log({ method, payment, tip, subtotal, total })}
          >
            Place Order
          </button>
        </section>

        {/* RIGHT: Summary */}
        <OrderSummary
          className="lg:sticky lg:top-6"
          pickupInfo={{
            name: "Liam Johnson",
            method,
            address: "Istanbul Restaurant, Anytown, CA 12345",
          }}
          items={items}
          subtotal={subtotal}
          total={total}
        />
      </div>
    </div>
  );
}

/* ---------- Small UI bits ---------- */

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 outline-none ring-0 focus:border-neutral-400"
      />
    </label>
  );
}

function TipBox({
  tip,
  setTip,
}: {
  tip: number;
  setTip: (v: number) => void;
}) {
  const presets = [0, 5, 10, 15];
  const [custom, setCustom] = useState<string>("");

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="font-semibold mb-1">Add Tip?</div>
      <p className="text-sm text-neutral-500 mb-3">
        You can add tip as much as you want.
      </p>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setTip(p);
              setCustom("");
            }}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              tip === p
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {p === 0 ? "No" : `£${p.toFixed(2)}`}
          </button>
        ))}

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm">
            + Custom
          </span>
          <input
            type="number"
            min={0}
            value={custom}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              setCustom(e.target.value);
              setTip(v);
            }}
            placeholder="0.00"
            className="w-24 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentBox({
  payment,
  setPayment,
}: {
  payment: "cash" | "card";
  setPayment: (p: "cash" | "card") => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="font-semibold mb-3">Payment</div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-3 rounded-lg border border-neutral-300 p-3 cursor-pointer hover:bg-neutral-50">
          <input
            type="radio"
            name="payment"
            checked={payment === "cash"}
            onChange={() => setPayment("cash")}
            className="accent-[var(--brand)]"
          />
          <div>
            <div className="font-medium">Pay Cash</div>
            <div className="text-sm text-neutral-500">Pay cash at the door</div>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-neutral-300 p-3 cursor-pointer hover:bg-neutral-50">
          <input
            type="radio"
            name="payment"
            checked={payment === "card"}
            onChange={() => setPayment("card")}
            className="accent-[var(--brand)]"
          />
          <div>
            <div className="font-medium">Pay by Card</div>
            <div className="text-sm text-neutral-500">Pay cash at the door</div>
          </div>
        </label>
      </div>
    </div>
  );
}
