// src/components/OrderTypeModal.tsx
import React from "react";

export type OrderType = "delivery" | "pickup";

type Props = {
  show?: boolean;
  value?: OrderType | null;
  onChange: (v: OrderType) => void;
  onClose: () => void;
  onContinue: () => void;
};

export default function OrderTypeModal({
  show = false,
  value = null,
  onChange,
  onClose,
  onContinue,
}: Props) {
  if (!show) return null;

  const isDelivery = value === "delivery";
  const isPickup = value === "pickup";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-[var(--brand)] px-4 py-3 text-white rounded-t-lg">
          <h3 className="font-semibold text-lg">How would you like to order?</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Delivery Type <span className="text-red-600">*</span>
          </label>

          <div className="inline-flex rounded-md border border-neutral-300 overflow-hidden">
            <button
              onClick={() => onChange("delivery")}
              className={`px-5 py-2 text-sm font-medium ${
                isDelivery
                  ? "bg-[var(--brand)] text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => onChange("pickup")}
              className={`px-5 py-2 text-sm font-medium border-l border-neutral-300 ${
                isPickup
                  ? "bg-[var(--brand)] text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Pickup
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={onContinue}
              disabled={!value}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
                value
                  ? "bg-[var(--brand)] hover:opacity-90"
                  : "bg-[var(--brand)]/50 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
