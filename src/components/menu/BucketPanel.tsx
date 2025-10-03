import { useState } from "react";

export default function BucketPanel() {
  const [clickCollect, setClickCollect] = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* toggle */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={clickCollect}
          onClick={() => setClickCollect((v) => !v)}
          className={`h-5 w-9 rounded-full transition-colors ${
            clickCollect ? "bg-[#FF7A1A]" : "bg-neutral-300"
          } relative`}
        >
          <span
            className={`absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-transform ${
              clickCollect ? "translate-x-4" : ""
            }`}
          />
        </button>
        <span className="text-sm">Click&Collect</span>
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
