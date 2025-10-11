import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBucketItem, removeBucketItem, clearBucketItems } from "@/store/bucket/actions";
import { LS_KEY } from "../../lib/env";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { priceFor } from "../../lib/utils";

type OrderType = "pickup" | "delivery";
type Props = {
  orderType: OrderType | null; // comes from MenuPage
  onChange: (v: OrderType) => void; // tell MenuPage about changes
};

export default function BucketPanel({ orderType, onChange }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bucket_items } = useSelector((state: any) => state.bucket);

  // helpers
  const num = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Sum selected option prices per UNIT from both legacy groups
  function optionsPricePerUnit(it: any): number {
    const sumTop = (it?.basketTopLevelLinkedMenuData ?? []).reduce((acc: number, sec: any) => {
      const items = sec?.topLevelLinkedMenuItems ?? [];
      const s = items
        .filter((mi: any) => mi?.selected)
        .reduce((a: number, mi: any) => a + num(priceFor(mi, orderType)), 0);
      return acc + s;
    }, 0);

    const sumLinked = (it?.basketLinkedMenuData ?? []).reduce((acc: number, sec: any) => {
      const items = sec?.menu_items ?? [];
      const s = items
        .filter((mi: any) => mi?.selected)
        .reduce((a: number, mi: any) => a + num(priceFor(mi, orderType)), 0);
      return acc + s;
    }, 0);

    return sumTop + sumLinked;
  }

  // Base unit price (pickup/delivery) from the menuItem (or item itself as fallback)
  function baseUnitPrice(it: any): number {
    const source = it?.menuItem ?? it;
    return num(priceFor(source, orderType));
  }

  // Unit price including options
  function unitPriceWithOptions(it: any): number {
    return baseUnitPrice(it) + optionsPricePerUnit(it);
  }

  // Line total (authoritative: use totalPrice if present > 0, else compute)
  function lineTotalOf(it: any): number {
    const qty = num(it?.quantity) || 1;
    const fromField = num(it?.totalPrice);
    if (fromField > 0) return fromField;
    return unitPriceWithOptions(it) * qty;
  }

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

  // Build groups for UI (keeps your current rendering)
  function buildGroupsFromLegacy(it: any) {
    const groups: Array<{ title: string; items: Array<{ id: any; name: string; price: number }> }> =
      [];

    // top-level block
    (it?.basketTopLevelLinkedMenuData ?? []).forEach((sec: any) => {
      const title = sec?.topLevelLinkedCategory?.Name ?? "Options";
      const items = (sec?.topLevelLinkedMenuItems ?? [])
        .filter((mi: any) => mi?.selected)
        .map((mi: any) => ({
          id: mi?.id ?? mi?.Id,
          name: mi?.Name ?? "Item",
          price: num(priceFor(mi, orderType)),
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
          price: num(priceFor(mi, orderType)),
        }));
      if (items.length) groups.push({ title, items });
    });

    return groups;
  }

  // Totals section now computes from base + selected options per unit * qty
  function Totals({ bucketItems }: { bucketItems: any[] }) {
    const subtotal = bucketItems.reduce((acc, it) => acc + lineTotalOf(it), 0);
    const shipping = 0; // plug your rule here
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

  const handleRemove = (item: any, idx: number) => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];

      if (Array.isArray(arr)) {
        const key = item?.addedAt ?? item?.uid;
        let removeIndex = -1;

        if (key) {
          removeIndex = arr.findIndex((x: any) => (x?.addedAt ?? x?.uid) === key);
        }
        if (removeIndex === -1) removeIndex = idx;

        if (removeIndex > -1) {
          arr.splice(removeIndex, 1);
          localStorage.setItem(LS_KEY, JSON.stringify(arr));
        } else {
          const rebuilt = bucket_items.filter((_: any, i: number) => i !== idx);
          localStorage.setItem(LS_KEY, JSON.stringify(rebuilt));
        }
      }
    } catch (e) {
      console.error("Failed to update localStorage:", e);
    }
    dispatch(removeBucketItem(idx));
  };

  const handleClearAll = () => {
     try { localStorage.removeItem(LS_KEY); } catch {}
     dispatch(clearBucketItems());
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
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={!bucket_items?.length}
                className="text-sm rounded-full border px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-40"
                title="Remove all items"
              >
                Clear all
              </button>
            </div>

            {bucket_items.map((it: any, idx: number) => {
              const qty = num(it?.quantity) || 1;
              const unitBase = baseUnitPrice(it);
              const unitWithOpts = unitBase;
              const lineTotal = lineTotalOf(it);

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
                        <div className="font-semibold truncate">{it?.Name ?? "Item"}</div>
                        <div className="ml-2 shrink-0 text-sm font-semibold">
                          £ {unitWithOpts.toFixed(2)}
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
                              <span className="text-neutral-800">
                                {op?.name ?? op?.Name ?? "Option"}
                              </span>{" "}
                              <span className="text-neutral-500">
                                ( £{num(op?.price).toFixed(2)} )
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Qty + line total */}
                      <div className="mt-2 flex items-center gap-2">
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

                        <div className="ml-2 flex items-center gap-1">
                          <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-neutral-50"
                            // onClick={() => handleEdit(it, idx)}
                            disabled
                            title="Edit item"
                          >
                            <FaEdit className="text-[var(--brand)] text-sm" />
                          </button>

                          <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-neutral-50"
                            onClick={() => handleRemove(it, idx)}
                            title="Remove item"
                          >
                            <FaTrashAlt className="text-red-500 text-sm pointer-events-none" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="mb-2 text-lg font-semibold">Order Total</h4>
            <Totals bucketItems={bucket_items} />

            <button
              type="button"
              className="mt-5 w-full rounded-full bg-[var(--brand)] text-white font-semibold py-3 text-base shadow-sm hover:opacity-90 transition"
              onClick={() => navigate("/billing")}
            >
              Proceed to Checkout
            </button>
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
