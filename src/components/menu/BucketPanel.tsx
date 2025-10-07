import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBucketItem } from "@/store/bucket/actions";
import { LS_KEY } from '../../lib/env'

type OrderType = "pickup" | "delivery";
type Props = {
  orderType: OrderType | null;               // comes from MenuPage
  onChange: (v: OrderType) => void;          // tell MenuPage about changes
};

export default function BucketPanel({ orderType, onChange }: Props) {
  const dispatch = useDispatch();
  const { bucket_items } = useSelector((state: any) => state.bucket);

  useEffect(() => {
    if (bucket_items.length > 0) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((item) => dispatch(addBucketItem(item)));
      }
    } catch { }
  }, [bucket_items.length, dispatch]);

  function buildGroupsFromLegacy(it: any) {
    const groups: Array<{ title: string; items: Array<{ id: any; name: string; price: number }> }> =
      [];

    const priceOf = (x: any) => Number(x?.price ?? x?.Price ?? x?.Collection_Price ?? 0) || 0;

    // top-level block
    (it?.basketTopLevelLinkedMenuData ?? []).forEach((sec: any) => {
      const title = sec?.topLevelLinkedCategory?.Name ?? "Options";
      const items = (sec?.topLevelLinkedMenuItems ?? [])
        .filter((mi: any) => mi?.selected)
        .map((mi: any) => ({
          id: mi?.id ?? mi?.Id,
          name: mi?.Name ?? "Item",
          price: priceOf(mi),
        }));
      if (items.length) groups.push({ title, items });
    });

    // linked block
    (it?.basketLinkedMenuData ?? []).forEach((sec: any) => {
      const title = sec?.menu_category?.Name ?? "Options";
      const items = (sec?.menu_items ?? [])
        .filter((mi: any) => mi?.selected)
        .map((mi: any) => ({
          id: mi?.id ?? mi?.Id,
          name: mi?.Name ?? "Item",
          price: priceOf(mi),
        }));
      if (items.length) groups.push({ title, items });
    });

    return groups;
  }

  function Totals({ bucketItems }: { bucketItems: any[] }) {
    const subtotal = bucketItems.reduce((acc, it) => {
      const unitPlusOptions =
        (Number(it?.unitPrice ?? it?.basePrice ?? 0) || 0) +
        (Number(it?.optionsPrice ?? 0) || 0);
      const qty = Number(it?.quantity ?? it?.qty) || 1;
      return acc + unitPlusOptions * qty;
    }, 0);

    // Example shipping rule; replace with your real one or from Redux
    const shipping = 0;

    return (
      <>
        <Row label="Subtotal" value={`£ ${subtotal.toFixed(2)}`} />
        <Row label="Shipping" value={`£ ${shipping.toFixed(2)}`} />
        <div className="mt-2 flex items-center justify-between text-base font-bold">
          <div>Total</div>
          <div>£ {(subtotal + shipping).toFixed(2)}</div>
        </div>
      </>
    );
  }

  function Row({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div className="text-neutral-600">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    );
  }

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
            className={`px-4 py-1.5 text-sm font-medium transition ${orderType === "pickup"
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
            className={`px-4 py-1.5 text-sm font-medium border-l border-neutral-300 transition ${orderType === "delivery"
              ? "bg-[var(--brand)] text-white"
              : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {bucket_items?.length > 0 ? (
        <>
          <div className="space-y-4">
            {bucket_items.map((it: any, idx: number) => {
              const unitPlusOptions = (Number(it?.unitPrice) || 0) + (Number(it?.optionsPrice) || 0);
              const lineTotal = unitPlusOptions * (Number(it?.quantity ?? it?.qty) || 1);
              const qty = Number(it?.quantity ?? it?.qty) || 1;

              return (
                <div key={it?.addedAt ?? `${it?.id}-${idx}`} className="rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={it?.image || "/default-menu-category.png"}
                      alt=""
                      className="h-14 w-14 rounded object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      {/* Title + unit price */}
                      <div className="flex items-start justify-between">
                        <div className="font-semibold truncate">{it?.Name ?? it?.name ?? "Item"}</div>
                        <div className="ml-2 shrink-0 text-sm font-semibold">
                          £ {unitPlusOptions.toFixed(2)}
                        </div>
                      </div>

                      {/* Option groups (top-level & linked combined in your payload) */}
                      {(it?.groups ?? buildGroupsFromLegacy(it)).map((grp: any, gIdx: number) => (
                        <div key={`${grp?.title ?? gIdx}`} className="mt-1">
                          <div className="text-[13px] font-semibold text-[var(--brand)]">
                            {grp?.title ?? "Options"}
                          </div>
                          {(grp?.items ?? []).map((op: any, iIdx: number) => (
                            <div key={`${grp?.title}-${op?.id ?? iIdx}`} className="pl-3 text-[13px]">
                              <span className="text-neutral-800">{op?.name ?? op?.Name ?? "Option"}</span>{" "}
                              <span className="text-neutral-500">
                                ( £{Number(op?.price ?? 0).toFixed(2)} )
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Qty + line total (hook your own actions if needed) */}
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-[var(--brand)] text-white grid place-items-center"
                          // onClick={() => dispatch(setQty(idx, qty - 1))}
                          disabled
                          title="hook up to your qty action"
                        >
                          –
                        </button>
                        <span className="min-w-[1.25rem] text-center">{qty}</span>
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-[var(--brand)] text-white grid place-items-center"
                          // onClick={() => dispatch(setQty(idx, qty + 1))}
                          disabled
                          title="hook up to your qty action"
                        >
                          +
                        </button>

                        <div className="ml-auto font-bold">£ {lineTotal.toFixed(2)}</div>

                        <button
                          type="button"
                          className="ml-2 rounded border px-2 py-1 text-sm hover:bg-neutral-50"
                          // onClick={() => dispatch(removeItem(idx))}
                          disabled
                          title="hook up to your remove action"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals (simple, local) */}
          <div className="mt-6 border-t pt-4">
            <h4 className="mb-2 text-lg font-semibold">Order Total</h4>
            <Totals bucketItems={bucket_items} />
          </div>
        </>


      ) : (
        <>
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
        </>
      )}
    </div>
  );
}


