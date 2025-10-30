// components/MenuModal.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMenuImageUrl, priceFor, itemKey, round2 } from "../../lib/utils";
import { LS_KEY } from "../../lib/env";
import { addBucketItem, updateBucketItem, updateBucketItemByIndex } from "@/store/bucket/actions";

export default function MenuModal({
  show = false,
  menuItem = null,
  orderType = "pickup",
  linkedMenuData,
  topLevelLinkedCategoryData = null,
  quantity = 1,
  mode = "edit",
  editIndex = null,
  originalItem = null,
  onClose = () => { },
  onConfirm = (_payload) => { },
}) {
  const dispatch = useDispatch();
  const { toplevel_linke_menu, menu_items } = useSelector((s: any) => s.menu);

  // Coerce to the literal union that helpers expect
  const asOrderType = (v) => (v === "delivery" ? "delivery" : "pickup");
  const ord = asOrderType(orderType);

  const productId = menuItem?.id ?? null;
  const productName = menuItem?.Name ?? "Item";

  const itemPrice = useMemo(() => {
    const raw = ord === "delivery" ? menuItem?.Delivery_Price : menuItem?.Collection_Price;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }, [menuItem, ord]);

  const imgSrc = useMemo(() => {
    const maybe = menuItem?.BackImage ? getMenuImageUrl(menuItem.BackImage) : "";
    return typeof maybe === "string" && maybe.trim() ? maybe : "/default-menu-category.png";
  }, [menuItem]);

  const [qty, setQty] = useState(Math.max(1, Number(quantity) || 1));
  const [topLocal, setTopLocal] = useState([]);
  const [linkLocal, setLinkLocal] = useState([]);
  const [topLevelLinkedItemPrice, setTopLevelLinkedItemPrice] = useState(0);
  const [linkedItemPrice, setLinkedItemPrice] = useState(0);

  // Initialize local copies once per open / upstream changes
  useEffect(() => {
    if (!show) return;

    setQty(Math.max(1, Number(quantity) || 1));

    // 1) Top-level: prefer passed-in selections; else build from redux
    let top;
    if (Array.isArray(topLevelLinkedCategoryData)) {
      top = JSON.parse(JSON.stringify(topLevelLinkedCategoryData));
    } else {
      if (Array.isArray(toplevel_linke_menu) && toplevel_linke_menu[0]?.topLevelLinkedCategory) {
        top = toplevel_linke_menu
          .filter((x) => Number(x?.topLevelLinkedCategory?.CategoryType) !== 1)
          .map((x) => ({
            ...x,
            topLevelLinkedMenuItems: (x?.topLevelLinkedMenuItems ?? []).map((mi) => ({
              ...mi,
              selected: Boolean(mi?.selected),
            })),
          }));
      } else {
        const arr = Array.isArray(toplevel_linke_menu) ? toplevel_linke_menu : [];
        top = arr
          .map((x) => {
            const cat = typeof x === "object" ? x : { id: Number(x) };
            const items = (menu_items || []).filter(
              (mi) => Number(mi?.Category_Id) === Number(cat?.id)
            );
            return {
              topLevelLinkedCategory: cat,
              topLevelLinkedMenuItems: items.map((mi) => ({
                ...mi,
                selected: Boolean(mi?.selected),
              })),
            };
          })
          .filter((s) => Number(s?.topLevelLinkedCategory?.CategoryType) !== 1);
      }
    }

    // 2) Linked: prefer passed-in selections
    const link = Array.isArray(linkedMenuData)
      ? JSON.parse(JSON.stringify(linkedMenuData))
      : [];

    const linkNormalized = link.map((blk) => ({
      ...blk,
      menu_items: (blk?.menu_items ?? []).map((mi) => ({
        ...mi,
        selected: Boolean(mi?.selected),
      })),
    }));

    setTopLocal(top || []);
    setLinkLocal(linkNormalized);
    setTopLevelLinkedItemPrice(0);
    setLinkedItemPrice(0);
  }, [
    show,
    quantity,
    topLevelLinkedCategoryData,
    linkedMenuData,
    toplevel_linke_menu,
    menu_items,
  ]);

  // Recompute prices when selections or qty change
  useEffect(() => {
    const tl = sumTopLevelSelected(topLocal);
    const lk = sumLinkedSelected(linkLocal);
    setTopLevelLinkedItemPrice(tl);
    setLinkedItemPrice(lk);
  }, [topLocal, linkLocal, qty, ord, itemPrice]);

  function sumTopLevelSelected(data) {
    let sum = 0;
    (data || []).forEach((cat) => {
      (cat?.topLevelLinkedMenuItems ?? []).forEach((mi) => {
        if (mi?.selected === true) sum += priceFor(mi, ord);
      });
    });
    return sum;
  }

  function sumLinkedSelected(data) {
    let sum = 0;
    (data || []).forEach((blk) => {
      (blk?.menu_items ?? []).forEach((mi) => {
        if (mi?.selected === true) sum += priceFor(mi, ord);
      });
    });
    return sum;
  }

  // Toggle top-level option(s)
  const onChangeTopLevelLinkedMenuOption = (indexTopArray) => {
    if (!indexTopArray?.length) return;
    let updated = topLocal;
    indexTopArray.forEach(({ index, subIndex }) => {
      updated = updated.map((block, i) => {
        if (i !== index) return block;
        const catType = Number(block?.topLevelLinkedCategory?.CategoryType);
        const isMulti = catType === 1 || catType === 2 || catType === 3;
        return {
          ...block,
          topLevelLinkedMenuItems: (block?.topLevelLinkedMenuItems ?? []).map((mi, j) => {
            if (j !== subIndex) {
              return { ...mi, selected: isMulti ? Boolean(mi?.selected) : false };
            }
            return { ...mi, selected: mi?.selected === true ? false : true };
          }),
        };
      });
    });
    setTopLocal(updated);
  };

  // Toggle linked option (single-select per block)
  const onChangeLinkedMenuOption = (indexArray) => {
    if (!indexArray?.length) return;
    let updated = linkLocal;
    indexArray.forEach(({ index, subIndex }) => {
      updated = updated.map((blk, i) => {
        if (i !== index) return blk;
        return {
          ...blk,
          menu_items: (blk?.menu_items ?? []).map((mi, j) => {
            if (j !== subIndex) return { ...mi, selected: false };
            return { ...mi, selected: mi?.selected === true ? false : true };
          }),
        };
      });
    });
    setLinkLocal(updated);
  };

  if (!show) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tileClasses = (selected) =>
    `text-left rounded-xl px-3 py-3 border shadow-sm transition ${selected
      ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/30 bg-white"
      : "border-neutral-200 bg-neutral-100 hover:bg-neutral-50"
    }`;

  const totalPrice = (itemPrice + topLevelLinkedItemPrice + linkedItemPrice) * qty;

  const confirm = () => {
    const payload = {
      id: productId,
      Name: productName,
      menuItem,
      quantity: qty,
      totalPrice,
      basketTopLevelLinkedMenuData: topLocal,
      basketLinkedMenuData: linkLocal,
      image: imgSrc,
    };

    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (mode === "add") {

        const key = itemKey(payload);
        const idx = Array.isArray(arr) ? arr.findIndex(x => itemKey(x) === key) : -1;

        if (idx !== -1) {
          const existing = arr[idx];
          const unit = (payload.totalPrice || 0) / Math.max(payload.quantity || 1, 1);
          const nextQty = (existing.quantity || 1) + (payload.quantity || 1);
          const updated = {
            ...existing,
            quantity: nextQty,
            totalPrice: round2(nextQty * unit),
            editedAt: Date.now(),
          };

          // Redux: replace at index
          dispatch(updateBucketItemByIndex({ index: idx, item: updated }));

          // localStorage: replace at index
          const next = [...arr];
          next[idx] = updated;
          localStorage.setItem(LS_KEY, JSON.stringify(next));

          onConfirm(updated);
          return;
        }

        const withKey = { ...payload, addedAt: Date.now() };
        dispatch(addBucketItem(withKey));
        const next = Array.isArray(arr) ? [...arr, withKey] : [withKey];
        localStorage.setItem(LS_KEY, JSON.stringify(next));
        onConfirm(withKey);

      } else {
        const stableKey = originalItem?.addedAt ?? Date.now();
        const edited = { ...payload, addedAt: stableKey, editedAt: Date.now() };
        // Redux
        if (Number.isInteger(editIndex)) {
          dispatch(updateBucketItem(editIndex, edited));
        } else {
          // fallback: try to find by addedAt
          let idx = -1;
          if (Array.isArray(arr)) {
            idx = arr.findIndex((x) => (x?.addedAt ?? null) === originalItem?.addedAt);
          }
          if (idx >= 0) dispatch(updateBucketItem(idx, edited));
          // if still not found, append
          if (idx < 0) dispatch(addBucketItem(edited));
        }

        // localStorage
        if (Array.isArray(arr)) {
          let idx = Number.isInteger(editIndex) ? editIndex : arr.findIndex((x) => (x?.addedAt ?? null) === originalItem?.addedAt);
          if (idx >= 0) {
            const next = [...arr];
            next[idx] = edited;
            localStorage.setItem(LS_KEY, JSON.stringify(next));
          } else {
            const next = [...arr, edited];
            localStorage.setItem(LS_KEY, JSON.stringify(next));
          }
        } else {
          localStorage.setItem(LS_KEY, JSON.stringify([edited]));
        }

        onConfirm(edited); // bubble up the final payload
      }
    } catch (e) {
      // If storage parsing fails, still dispatch to Redux and write a minimal storage value
      if (mode === "add") {
        const withKey = { ...payload, addedAt: Date.now() };
        dispatch(addBucketItem(withKey));
        try {
          localStorage.setItem(LS_KEY, JSON.stringify([withKey]));
        } catch { }
        onConfirm(withKey);
      } else {
        const stableKey = originalItem?.addedAt ?? Date.now();
        const edited = { ...payload, addedAt: stableKey, editedAt: Date.now() };
        if (Number.isInteger(editIndex)) {
          dispatch(updateBucketItem(editIndex, edited));
        } else {
          dispatch(addBucketItem(edited));
        }
        try {
          localStorage.setItem(LS_KEY, JSON.stringify([edited]));
        } catch { }
        onConfirm(edited);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3"
      onMouseDown={handleBackdrop}
    >
      <div className="w-full sm:min-w-[50vw] max-w-[92vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl relative flex flex-col overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full px-2 leading-none text-neutral-500 hover:bg-neutral-100"
          aria-label="Close"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="p-6 bg-[#E4E8E2]">
          <div className="flex flex-col items-center">
            <img src={imgSrc} alt={productName} className="h-44 w-64 rounded-md object-cover" />
            <h3 className="mt-4 text-xl font-semibold">{productName}</h3>
            <div className="mt-1 text-xl font-bold text-[var(--brand)]">£ {itemPrice.toFixed(2)}</div>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-full bg-[var(--brand)] text-white text-xl grid place-items-center"
              >
                –
              </button>
              <div className="min-w-[2rem] text-center text-lg font-semibold">{qty}</div>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="h-9 w-9 rounded-full bg-[var(--brand)] text-white text-xl grid place-items-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">
          {/* Top-Level Sections */}
          {topLocal.length > 0 &&
            topLocal.map((sec, sIdx) => {
              const cat = sec?.topLevelLinkedCategory;
              const catName = cat?.Name ?? "Options";

              return (
                <section key={`tl-${cat?.id ?? sIdx}`} className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--brand)]">{catName}</h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(sec?.topLevelLinkedMenuItems ?? []).map((it, i) => {
                      const selected = it?.selected === true;
                      const price = priceFor(it, ord);
                      const thumb = it?.BackImage ? getMenuImageUrl(it.BackImage) : "";

                      return (
                        <button
                          key={`tl-item-${cat?.id ?? sIdx}-${it?.id ?? i}`}
                          onClick={() =>
                            onChangeTopLevelLinkedMenuOption([{ index: sIdx, subIndex: i }])
                          }
                          className={tileClasses(selected)}
                        >
                          <div className="flex items-start gap-3">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={it?.Name ?? "Item"}
                                className="h-10 w-10 rounded object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-neutral-200" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{it?.Name ?? "Item"}</div>
                              {it?.Remarks ? (
                                <div className="text-xs text-neutral-500 truncate">{it?.Remarks}</div>
                              ) : null}
                              <div className="text-sm text-neutral-600">£ {price.toFixed(2)}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

          {/* Linked Sections */}
          {linkLocal.length > 0 &&
            linkLocal.map((sec, sIdx) => {
              const catName = sec?.menu_category?.Name ?? "Options";

              return (
                <section key={`lm-${sIdx}`} className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--brand)]">{catName}</h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(sec?.menu_items ?? []).map((it, i) => {
                      const selected = it?.selected === true;
                      const price = priceFor(it, ord);
                      const thumb = it?.BackImage ? getMenuImageUrl(it.BackImage) : "";

                      return (
                        <button
                          key={`lm-item-${sIdx}-${it?.id ?? it?.Id ?? i}`}
                          onClick={() =>
                            onChangeLinkedMenuOption([{ index: sIdx, subIndex: i }])
                          }
                          className={tileClasses(selected)}
                        >
                          <div className="flex items-start gap-3">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={it?.Name ?? "Item"}
                                className="h-10 w-10 rounded object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-neutral-200" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{it?.Name ?? "Item"}</div>
                              {it?.Remarks ? (
                                <div className="text-xs text-neutral-500 truncate">{it?.Remarks}</div>
                              ) : null}
                              <div className="text-sm text-neutral-600">£ {price.toFixed(2)}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-white">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl border border-[var(--brand)] text-[var(--brand)] font-medium hover:bg-[var(--brand)]/5"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                confirm();
                onClose();
              }}
              className="w-full h-12 rounded-xl bg-[var(--brand)] font-semibold text-white hover:opacity-90"
            >
              {mode === "add" ? "Add to Order" : "Save"} • £ {totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
