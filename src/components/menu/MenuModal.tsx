// components/MenuModal.tsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMenuImageUrl } from "../../lib/utils";
import { LS_KEY } from '../../lib/env'
import {addBucketItem} from '@/store/actions'

export default function MenuModal({
  menuItem = null,
  linkedMenu = [],
  show = false,
  onClose = () => { },
  onConfirm = () => { },
  orderType = 'pickup'
}: any) {
  const dispatch = useDispatch();
  const { toplevel_linke_menu, menu_items } = useSelector((s: any) => s.menu);

  const productId = menuItem?.id ?? null;
  const productName = menuItem?.Name ?? "Item";

  const itemPrice = useMemo(() => {
    const raw = orderType === "delivery" ? menuItem?.Delivery_Price : menuItem?.Collection_Price;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }, [menuItem, orderType]);

  const imgSrc = useMemo(() => {
    const maybe = menuItem?.BackImage ? getMenuImageUrl(menuItem.BackImage) : "";
    return typeof maybe === "string" && maybe.trim()
      ? maybe
      : "/default-menu-category.png";
  }, [menuItem]);

  const [qty, setQty] = useState(1);
  const [topLevelLinkedCategoryData, setTopLevelLinkedCategoryDataLocal] = useState<any[]>([]);
  const [linkedMenuData, setLinkedMenuDataLocal] = useState<any[]>([]);

  const [topLevelLinkedItemPrice, setTopLevelLinkedItemPrice] = useState(0);
  const [linkedItemPrice, setLinkedItemPrice] = useState(0);

  useEffect(() => {
    if (!show) return;
    setQty(1);
    let topLocal: any[] = [];
    if (Array.isArray(toplevel_linke_menu) && toplevel_linke_menu[0]?.topLevelLinkedCategory) {
      topLocal = toplevel_linke_menu
        .filter((x: any) => Number(x?.topLevelLinkedCategory?.CategoryType) !== 1)
        .map((x: any) => ({
          ...x,
          topLevelLinkedMenuItems: (x?.topLevelLinkedMenuItems ?? []).map((mi: any) => ({
            ...mi,
            selected: Boolean(mi?.selected),
          })),
        }));
    } else {
      const arr = Array.isArray(toplevel_linke_menu) ? toplevel_linke_menu : [];
      topLocal = arr
        .map((x: any) => {
          const cat = typeof x === "object" ? x : { id: Number(x) };
          const items = (menu_items || []).filter(
            (mi: any) => Number(mi?.Category_Id) === Number(cat?.id)
          );
          return {
            topLevelLinkedCategory: cat,
            topLevelLinkedMenuItems: items.map((mi: any) => ({ ...mi, selected: Boolean(mi?.selected) })),
          };
        })
        .filter((s) => Number(s?.topLevelLinkedCategory?.CategoryType) !== 1);
    }

    // Build linked blocks
    const linkLocal = (Array.isArray(linkedMenu) ? linkedMenu : []).map((blk: any) => ({
      ...blk,
      menu_items: (blk?.menu_items ?? []).map((mi: any) => ({ ...mi, selected: Boolean(mi?.selected) })),
    }));

    setTopLevelLinkedCategoryDataLocal(topLocal);
    setLinkedMenuDataLocal(linkLocal);
    // reset prices
    setTopLevelLinkedItemPrice(0);
    setLinkedItemPrice(0);
  }, [show, toplevel_linke_menu, linkedMenu, menu_items, itemPrice]);

  // ====== Price recompute when qty or selections change ======
  useEffect(() => {
    const tl = sumTopLevelSelected(topLevelLinkedCategoryData);
    const lk = sumLinkedSelected(linkedMenuData);
    setTopLevelLinkedItemPrice(tl);
    setLinkedItemPrice(lk);
  }, [topLevelLinkedCategoryData, linkedMenuData, qty, itemPrice]);

  const priceFor = (x: any, orderType: "pickup" | "delivery") => {
    const raw = orderType === "delivery" ? x?.Delivery_Price : x?.Collection_Price;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  };

  function sumTopLevelSelected(data: any[]) {
    let sum = 0;
    data.forEach((cat) => {
      (cat?.topLevelLinkedMenuItems ?? []).forEach((mi: any) => {
        if (mi?.selected === true) sum += priceFor(mi, orderType);
      });
    });
    return sum;
  }

  function sumLinkedSelected(data: any[]) {
    let sum = 0;
    data.forEach((blk) => {
      (blk?.menu_items ?? []).forEach((mi: any) => {
        if (mi?.selected === true) sum += priceFor(mi, orderType);
      });
    });
    return sum;
  }

  // Same signature as RN: array of { index, subIndex }
  const onChangeTopLevelLinkedMenuOption = (indexTopArray: Array<{ index: number; subIndex: number }>) => {
    if (!indexTopArray?.length) return;

    let updated = topLevelLinkedCategoryData;

    indexTopArray.forEach(({ index, subIndex }) => {
      updated = updated.map((block: any, i: number) => {
        if (i !== index) return block;

        const catType = Number(block?.topLevelLinkedCategory?.CategoryType);
        const isMulti = catType === 1 || catType === 2 || catType === 3;

        return {
          ...block,
          topLevelLinkedMenuItems: (block?.topLevelLinkedMenuItems ?? []).map((mi: any, j: number) => {
            if (j !== subIndex) {
              return {
                ...mi,
                selected: isMulti ? Boolean(mi?.selected) : false,
              };
            }
            // clicked
            return {
              ...mi,
              selected: mi?.selected === true ? false : true,
            };
          }),
        };
      });
    });

    setTopLevelLinkedCategoryDataLocal(updated);
    const tlPrice = sumTopLevelSelected(updated);
    setTopLevelLinkedItemPrice(tlPrice);

  };

  const onChangeLinkedMenuOption = (indexArray: Array<{ index: number; subIndex: number }>) => {
    if (!indexArray?.length) return;

    let updated = linkedMenuData;

    indexArray.forEach(({ index, subIndex }) => {
      updated = updated.map((blk: any, i: number) => {
        if (i !== index) return blk;
        return {
          ...blk,
          menu_items: (blk?.menu_items ?? []).map((mi: any, j: number) => {
            if (j !== subIndex) {
              return { ...mi, selected: false }; // SINGLE-SELECT per block
            }
            return { ...mi, selected: mi?.selected === true ? false : true };
          }),
        };
      });
    });

    setLinkedMenuDataLocal(updated);
    const lkPrice = sumLinkedSelected(updated);
    setLinkedItemPrice(lkPrice);
  };

  // ====== Render ======
  if (!show) return null;

  const handleBackdrop = (e: any) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tileClasses = (selected: boolean) =>
    `text-left rounded-xl px-3 py-3 border shadow-sm transition ${selected
      ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/30 bg-white"
      : "border-neutral-200 bg-neutral-100 hover:bg-neutral-50"
    }`;

  const totalPrice = (itemPrice + topLevelLinkedItemPrice + linkedItemPrice) * qty;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3"
      onMouseDown={handleBackdrop}
    >
      {/* Sticky header & footer; scrollable body */}
      <div className="w-full sm:min-w-[50vw] max-w-[92vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl relative flex flex-col overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full px-2 leading-none text-neutral-500 hover:bg-neutral-100"
          aria-label="Close"
        >
          ✕
        </button>

        {/* HEADER (non-scrolling) */}
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

        {/* BODY (scrollable) */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">
          {/* Top-Level Sections */}
          {topLevelLinkedCategoryData.length > 0 &&
            topLevelLinkedCategoryData.map((sec: any, sIdx: number) => {
              const cat = sec?.topLevelLinkedCategory;
              const catName = cat?.Name ?? "Options";

              return (
                <section key={`tl-${cat?.id ?? sIdx}`} className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--brand)]">{catName}</h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(sec?.topLevelLinkedMenuItems ?? []).map((it: any, i: number) => {
                      const selected = it?.selected === true;
                      const price = priceFor(it, orderType);
                      const thumb = it?.BackImage ? getMenuImageUrl(it.BackImage) : "";

                      return (
                        <button
                          key={`tl-item-${cat?.id ?? sIdx}-${it?.id ?? i}`}
                          onClick={() => onChangeTopLevelLinkedMenuOption([{ index: sIdx, subIndex: i }])}
                          className={tileClasses(selected)}
                        >
                          <div className="flex items-start gap-3">
                            {thumb ? (
                              <img src={thumb} alt={it?.Name ?? "Item"} className="h-10 w-10 rounded object-cover" loading="lazy" />
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
          {linkedMenuData.length > 0 &&
            linkedMenuData.map((sec: any, sIdx: number) => {
              const catName = sec?.menu_category?.Name ?? "Options";

              return (
                <section key={`lm-${sIdx}`} className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--brand)]">{catName}</h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(sec?.menu_items ?? []).map((it: any, i: number) => {
                      const selected = it?.selected === true;
                      const price = priceFor(it, orderType);
                      const thumb = it?.BackImage ? getMenuImageUrl(it.BackImage) : "";

                      return (
                        <button
                          key={`lm-item-${sIdx}-${it?.id ?? it?.Id ?? i}`}
                          onClick={() => onChangeLinkedMenuOption([{ index: sIdx, subIndex: i }])}
                          className={tileClasses(selected)}
                        >
                          <div className="flex items-start gap-3">
                            {thumb ? (
                              <img src={thumb} alt={it?.Name ?? "Item"} className="h-10 w-10 rounded object-cover" loading="lazy" />
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

        {/* FOOTER (non-scrolling) */}
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
                // onConfirm({
                //   id: productId,
                //   Name: productName,
                //   quantity: qty,
                //   totalPrice,
                //   basketTopLevelLinkedMenuData: topLevelLinkedCategoryData,
                //   basketLinkedMenuData: linkedMenuData,
                // });
                const payload = {
                  id: productId,
                  Name: productName,
                  quantity: qty,
                  totalPrice,
                  basketTopLevelLinkedMenuData: topLevelLinkedCategoryData,
                  basketLinkedMenuData: linkedMenuData,
                  // optional extras you may want later:
                  addedAt: Date.now(),
                  image: imgSrc,
                };
                dispatch(addBucketItem(payload));
                try {
                  const existing = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
                  const next = Array.isArray(existing) ? [...existing, payload] : [payload];
                  localStorage.setItem(LS_KEY, JSON.stringify(next));
                } catch {
                  localStorage.setItem(LS_KEY, JSON.stringify([payload]));
                }
                // onClose();
              }}
              className="w-full h-12 rounded-xl bg-[var(--brand)] font-semibold text-white hover:opacity-90"
            >
              Add to Order • £ {totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
