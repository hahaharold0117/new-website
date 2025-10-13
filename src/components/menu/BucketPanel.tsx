import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBucketItem, removeBucketItem, clearBucketItems, updateBucketItem } from "@/store/bucket/actions";
import { LS_KEY } from "../../lib/env";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { priceFor } from "../../lib/utils";
import MenuModal from "./MenuModal";

export default function BucketPanel({ orderType, onChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // the bucket item being edited

  const { bucket_items } = useSelector((state: any) => state.bucket);

  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  function optionsPricePerUnit(it) {
    const sumTop = (it?.basketTopLevelLinkedMenuData ?? []).reduce((acc, sec) => {
      const items = sec?.topLevelLinkedMenuItems ?? [];
      const s = items.filter((mi) => mi?.selected).reduce((a, mi) => a + num(priceFor(mi, orderType)), 0);
      return acc + s;
    }, 0);

    const sumLinked = (it?.basketLinkedMenuData ?? []).reduce((acc, sec) => {
      const items = sec?.menu_items ?? [];
      const s = items.filter((mi) => mi?.selected).reduce((a, mi) => a + num(priceFor(mi, orderType)), 0);
      return acc + s;
    }, 0);

    return sumTop + sumLinked;
  }

  function baseUnitPrice(it) {
    const source = it?.menuItem ?? it;
    return num(priceFor(source, orderType));
  }

  function unitPriceWithOptions(it) {
    return baseUnitPrice(it) + optionsPricePerUnit(it);
  }

  function lineTotalOf(it) {
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
      if (Array.isArray(arr)) arr.forEach((item) => dispatch(addBucketItem(item)));
    } catch { }
  }, [bucket_items.length, dispatch]);

  function buildGroupsFromLegacy(it) {
    const groups = [];
    (it?.basketTopLevelLinkedMenuData ?? []).forEach((sec) => {
      const title = sec?.topLevelLinkedCategory?.Name ?? "Options";
      const items = (sec?.topLevelLinkedMenuItems ?? [])
        .filter((mi) => mi?.selected)
        .map((mi) => ({ id: mi?.id ?? mi?.Id, name: mi?.Name ?? "Item", price: num(priceFor(mi, orderType)) }));
      if (items.length) groups.push({ title, items });
    });
    (it?.basketLinkedMenuData ?? []).forEach((sec) => {
      const title = sec?.menu_category?.Name ?? "Options";
      const items = (sec?.menu_items ?? [])
        .filter((mi) => mi?.selected)
        .map((mi) => ({ id: mi?.id ?? mi?.Id, name: mi?.Name ?? "Item", price: num(priceFor(mi, orderType)) }));
      if (items.length) groups.push({ title, items });
    });
    return groups;
  }

  function Totals({ bucketItems }) {
    const subtotal = bucketItems.reduce((acc, it) => acc + lineTotalOf(it), 0);
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

  function Row({ label, value }) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div className="text-neutral-600">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    );
  }

  function persistAll(next) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch { }
  }

  function handleQtyChange(idx, delta) {
    const it = bucket_items[idx];
    if (!it) return;

    const currentQty = num(it.quantity) || 1;
    const nextQty = Math.max(1, currentQty + delta); // clamp to 1+

    // We deliberately set totalPrice = 0 so `lineTotalOf` always recomputes
    const updated = { ...it, quantity: nextQty, totalPrice: 0 };

    const next = bucket_items.map((x, i) => (i === idx ? updated : x));
    persistAll(next);
    dispatch(updateBucketItem(idx, updated));
  }

  const handleRemove = (item, idx) => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) {
        const key = item?.addedAt ?? item?.uid;
        let removeIndex = -1;
        if (key) removeIndex = arr.findIndex((x) => (x?.addedAt ?? x?.uid) === key);
        if (removeIndex === -1) removeIndex = idx;
        if (removeIndex > -1) {
          arr.splice(removeIndex, 1);
          localStorage.setItem(LS_KEY, JSON.stringify(arr));
        } else {
          const rebuilt = bucket_items.filter((_, i) => i !== idx);
          localStorage.setItem(LS_KEY, JSON.stringify(rebuilt));
        }
      }
    } catch (e) {
      console.error("Failed to update localStorage:", e);
    }
    dispatch(removeBucketItem(idx));
  };

  const handleClearAll = () => {
    try { localStorage.removeItem(LS_KEY); } catch { }
    dispatch(clearBucketItems());
  };

  const handleEdit = (it, idx) => {
    setEditingIndex(idx);
    setEditingItem({
      original: it,
      qty: Number(it?.quantity) || 1,
      topLevel: Array.isArray(it?.basketTopLevelLinkedMenuData)
        ? JSON.parse(JSON.stringify(it.basketTopLevelLinkedMenuData))
        : [],
      linked: Array.isArray(it?.basketLinkedMenuData)
        ? JSON.parse(JSON.stringify(it.basketLinkedMenuData))
        : [],
    });
    setShowMenuModal(true);
  }

  function handleEditConfirm(updated) {
    const idx = editingIndex;
    const it = bucket_items[idx];
    if (idx == null || !it) {
      setShowMenuModal(false);
      return;
    }

    const nextItem = {
      ...it,
      quantity: Number(updated?.quantity) || Number(it?.quantity) || 1,
      basketTopLevelLinkedMenuData: updated?.basketTopLevelLinkedMenuData ?? it?.basketTopLevelLinkedMenuData ?? [],
      basketLinkedMenuData: updated?.basketLinkedMenuData ?? it?.basketLinkedMenuData ?? [],
      // force recompute if your `lineTotalOf` calculates; or keep explicit total if your modal returns it
      totalPrice: typeof updated?.totalPrice === "number" ? updated.totalPrice : 0,
      editedAt: Date.now(),
    };

    const next = bucket_items.map((x, i) => (i === idx ? nextItem : x));
    persistAll(next);
    dispatch(updateBucketItem(idx, nextItem));

    setShowMenuModal(false);
    setEditingIndex(null);
    setEditingItem(null);
  }

  function handleEditClose() {
    setShowMenuModal(false);
    setEditingIndex(null);
    setEditingItem(null);
  }


  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* segmented switch */}
      <div className="mb-4 flex items-center gap-2">
        <div role="tablist" aria-label="Order type" className="inline-flex overflow-hidden rounded-full border border-neutral-300">
          <button
            role="tab"
            aria-selected={orderType === "pickup"}
            onClick={() => onChange("pickup", bucket_items.length)}
            className={`px-4 py-1.5 text-sm font-medium transition ${orderType === "pickup" ? "bg-[var(--brand)] text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}
          >
            Pickup
          </button>
          <button
            role="tab"
            aria-selected={orderType === "delivery"}
            onClick={() => onChange("delivery", bucket_items.length)}
            className={`px-4 py-1.5 text-sm font-medium border-l border-neutral-300 transition ${orderType === "delivery" ? "bg-[var(--brand)] text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}
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

            {bucket_items.map((it, idx) => {
              const qty = num(it?.quantity) || 1;
              const unitBase = baseUnitPrice(it);
              const unitWithOpts = unitBase;
              const lineTotal = lineTotalOf(it);

              const hasTop =
                Array.isArray(it?.basketTopLevelLinkedMenuData) &&
                it.basketTopLevelLinkedMenuData.length > 0;
              const hasLinked =
                Array.isArray(it?.basketLinkedMenuData) &&
                it.basketLinkedMenuData.length > 0;
              const canEdit = hasTop || hasLinked;


              return (
                <div key={it?.addedAt ?? `${it?.id}-${idx}`} className="rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <img src={it?.image || "/default-menu-category.png"} alt="" className="h-14 w-14 rounded object-cover" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="font-semibold truncate">{it?.Name ?? "Item"}</div>
                        <div className="ml-2 shrink-0 text-sm font-semibold">£ {unitWithOpts.toFixed(2)}</div>
                      </div>

                      {(it?.groups ?? buildGroupsFromLegacy(it)).map((grp, gIdx) => (
                        <div key={`${grp?.title ?? gIdx}`} className="mt-1">
                          <div className="text-[13px] font-semibold text-[var(--brand)]">{grp?.title ?? "Options"}</div>
                          {(grp?.items ?? []).map((op, iIdx) => (
                            <div key={`${grp?.title}-${op?.id ?? iIdx}`} className="pl-3 text-[13px]">
                              <span className="text-neutral-800">{op?.name ?? op?.Name ?? "Option"}</span>{" "}
                              <span className="text-neutral-500">( £{num(op?.price).toFixed(2)} )</span>
                            </div>
                          ))}
                        </div>
                      ))}

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-[var(--brand)] text-white grid place-items-center"
                          onClick={() => handleQtyChange(idx, -1)}
                          title="Decrease quantity"
                        >
                          –
                        </button>

                        <span className="min-w-[1.25rem] text-center">{qty}</span>

                        <button
                          type="button"
                          className="h-7 w-7 rounded-full bg-[var(--brand)] text-white grid place-items-center"
                          onClick={() => handleQtyChange(idx, +1)}
                          title="Increase quantity"
                        >
                          +
                        </button>

                        <div className="ml-auto font-bold" style={{ fontSize: 14 }}>£ {lineTotal.toFixed(2)}</div>

                        <div className="ml-2 flex items-center gap-1">
                          {canEdit && (
                            <button
                              type="button"
                              className="h-8 w-8 flex items-center justify-center rounded-full border hover:bg-neutral-50"
                              onClick={(e) => {
                                e.stopPropagation(); // optional
                                handleEdit(it, idx);
                              }}
                              title="Edit item"
                            >
                              <FaEdit className="text-[var(--brand)] text-sm" />
                            </button>
                          )}


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

          {showMenuModal && editingItem && (
            <MenuModal
              show={showMenuModal}
              mode="edit"                                   // ← tell the modal we're editing
              editIndex={editingIndex}                      // ← preferred way to locate the line
              originalItem={editingItem.original ?? editingItem} // ← fallback (has addedAt)
              linkedMenuData={editingItem.linked}
              topLevelLinkedCategoryData={editingItem.topLevel}
              menuItem={editingItem.original?.menuItem ?? editingItem.original}
              quantity={editingItem.qty}
              orderType={orderType}
              onClose={handleEditClose}
              onConfirm={handleEditConfirm}                 // gets the edited payload back
            />
          )}
        </>
      ) : (
        <>
          <div className="rounded-xl bg-neutral-50/60 p-4">
            <div className="relative mx-auto mb-2 h-40 w-full">
              <img src="/empty-bucket.png" alt="" className="h-full w-full object-contain" loading="lazy" />
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