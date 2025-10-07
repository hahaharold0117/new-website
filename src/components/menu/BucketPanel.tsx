import React from "react";

type OrderType = "pickup" | "delivery";
type Props = {
  orderType: OrderType | null;               // comes from MenuPage
  onChange: (v: OrderType) => void;          // tell MenuPage about changes
};

export default function BucketPanel({ orderType, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* segmented switch: Pickup | Delivery */}
      <div className="mb-4 flex items-center gap-2">
        <div
          role="tablist"
          aria-label="Order type"
          className="inline-flex overflow-hidden rounded-full border border-neutral-300"
        >
          <button
            role="tab"
            aria-selected={orderType === "pickup"}
            onClick={() => onChange("pickup")}
            className={`px-4 py-1.5 text-sm font-medium transition ${
              orderType === "pickup"
                ? "bg-[var(--brand)] text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Pickup
          </button>
          <button
            role="tab"
            aria-selected={orderType === "delivery"}
            onClick={() => onChange("delivery")}
            className={`px-4 py-1.5 text-sm font-medium border-l border-neutral-300 transition ${
              orderType === "delivery"
                ? "bg-[var(--brand)] text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* empty state */}
      <div className="rounded-xl bg-neutral-50/60 p-4">
        <div className="relative mx-auto mb-2 h-40 w-full">
          <img
            src="/empty-bucket.png"
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        <h3 className="text-lg font-semibold">Your basket is empty now.</h3>
        <p className="text-sm text-neutral-500">Browse for delicious food!</p>
      </div>

      {/* order total */}
      <div className="mt-6 border-t pt-4">
        <h4 className="mb-2 text-lg font-semibold">Order Total</h4>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium">Total:</div>
            <div className="text-neutral-500">(including VAT)</div>
          </div>
          <div className="text-lg font-bold">£0</div>
        </div>
      </div>
    </div>
  );
}
