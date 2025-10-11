// components/SubMenuModal.tsx
import { useEffect } from "react";

export default function SubMenuModal({
  menuData = [],
  show = false,
  onClose = () => { },
  onSelect = (v) => {},
}) {
  // Close on ESC
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  const options = Array.isArray(menuData) ? menuData : [];

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={handleBackdrop}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full px-2 leading-none text-neutral-500 hover:bg-neutral-100"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="mb-4 text-center text-xl font-semibold text-[var(--brand)]">
          Select
        </h2>

        <div className="flex flex-col gap-3">
          {options.map((item, i) => (
            <button
              key={String(item?.id)}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="w-full rounded-xl bg-[var(--brand)] text-white py-3 text-center text-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30"
            >
              {item?.Name}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-neutral-300 py-2 font-medium hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
