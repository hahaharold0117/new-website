// components/MenuModal.tsx
import { useEffect, useState } from "react";
import { getMenuImageUrl } from "../../lib/utils";

export default function MenuModal({
  menuItem = null,
  linkedMenu = [],   // kept for parity with your props (unused here)
  show = false,
  onClose = () => {},
  onConfirm = () => {},
}) {
  const [qty, setQty] = useState(1);

  // Always run hooks (no conditional return before them)
  useEffect(() => {
    if (!show) return;
    setQty(1); // reset when opening
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  // Compute values without useMemo (cheap + fixes hooks-order issue)
  const productId =
    (menuItem && (menuItem.id ?? menuItem.Id)) ?? null;

  const productName =
    (menuItem && (menuItem.Name ?? menuItem.name)) ?? "Item";

  const priceNumber = (() => {
    const n = Number(menuItem?.Collection_Price ?? menuItem?.Price ?? 0);
    return Number.isFinite(n) ? n : 0;
  })();

  const imgSrc = (() => {
    const maybe = menuItem?.BackImage
      ? getMenuImageUrl(menuItem.BackImage)
      : "";
    return typeof maybe === "string" && maybe.trim()
      ? maybe
      : "/default-menu-category.png";
  })();

  // After hooks/derived values, you may return early
  if (!show) return null;

  const handleBackdrop = (e: any) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3"
      onMouseDown={handleBackdrop}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full px-2 leading-none text-neutral-500 hover:bg-neutral-100"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header block */}
        <div className="rounded-xl bg-[#E4E8E2] p-4">
          <div className="flex flex-col items-center">
            <img
              src={imgSrc}
              alt={productName}
              className="h-44 w-64 rounded-md object-cover"
            />
            <h3 className="mt-4 text-xl font-semibold">{productName}</h3>
            <div className="mt-1 text-xl font-bold text-[var(--brand)]">
              £ {priceNumber.toFixed(2)}
            </div>

            {/* Quantity controls */}
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-full bg-[var(--brand)] text-white text-xl leading-none grid place-items-center"
              >
                –
              </button>
              <div className="min-w-[2rem] text-center text-lg font-semibold">
                {qty}
              </div>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="h-9 w-9 rounded-full bg-[var(--brand)] text-white text-xl leading-none grid place-items-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl border border-[var(--brand)] text-[var(--brand)] text-base font-medium hover:bg-[var(--brand)]/5"
            >
              Cancel
            </button>
            <button
            //   onClick={() =>
            //     onConfirm({ id: productId, Name: productName, quantity: qty })
            //   }
              className="w-full h-12 rounded-xl bg-[var(--brand)] text-base font-semibold text-white hover:opacity-90"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
