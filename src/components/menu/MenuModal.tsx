// components/MenuModal.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMenuImageUrl } from "../../lib/utils";

export default function MenuModal({
  menuItem = null,
  linkedMenu = [],
  show = false,
  onClose = () => {},
  onConfirm = () => {},
}: any) {
  // Redux data used to render “top-level” sections (e.g., Pizza Base, Dressings)
  const { toplevel_linke_menu, menu_items } = useSelector((s: any) => s.menu);

  // qty + local selection state (single-select per section by default)
  const [qty, setQty] = useState(1);
  const [topLevelSel, setTopLevelSel] = useState<Record<number, number | null>>({});
  const [linkedSel, setLinkedSel] = useState<Record<number, number | null>>({});

  // Run hooks regardless of `show` and reset when opening
  useEffect(() => {
    if (!show) return;
    setQty(1);
    setTopLevelSel({});
    setLinkedSel({});
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  // Derived from menuItem
  const productId = menuItem?.id ?? menuItem?.Id ?? null;
  const productName = menuItem?.Name ?? menuItem?.name ?? "Item";
  const priceNumber = (() => {
    const n = Number(menuItem?.Collection_Price ?? menuItem?.Price ?? 0);
    return Number.isFinite(n) ? n : 0;
  })();
  const imgSrc = (() => {
    const maybe = menuItem?.BackImage ? getMenuImageUrl(menuItem.BackImage) : "";
    return typeof maybe === "string" && maybe.trim() ? maybe : "/default-menu-category.png";
  })();

  // Normalize top-level sections (exclude CategoryType === 1 / toppings)
  const topLevelSections = (() => {
    if (Array.isArray(toplevel_linke_menu) && toplevel_linke_menu[0]?.topLevelLinkedCategory) {
      return toplevel_linke_menu
        .filter((x: any) => Number(x?.topLevelLinkedCategory?.CategoryType) !== 1)
        .map((x: any) => ({
          category: x.topLevelLinkedCategory,
          items: x.topLevelLinkedMenuItems ?? [],
        }));
    }
    const arr = Array.isArray(toplevel_linke_menu) ? toplevel_linke_menu : [];
    return arr
      .map((x: any, i: number) => {
        const cat = typeof x === "object" ? x : { id: Number(x) };
        const items = (menu_items || []).filter(
          (mi: any) => Number(mi?.Category_Id) === Number(cat?.id)
        );
        return { category: cat, items };
      })
      .filter((s) => Number(s?.category?.CategoryType) !== 1);
  })();

  // Normalize linked sections (from linkedMenuData prop)
  const linkedSections = Array.isArray(linkedMenu)
    ? linkedMenu.map((b: any) => ({ category: b?.menu_category, items: b?.menu_items ?? [] }))
    : [];

  // Selection handlers (single-select)
  const onChangeTopLevelLinkedMenuOption = (sectionIdx: number, itemIdx: number) => {
    const sec = topLevelSections[sectionIdx];
    const item = sec?.items?.[itemIdx];
    if (!item) return;
    const catId = Number(sec?.category?.id ?? sectionIdx);
    const itemId = Number(item?.id ?? item?.Id);
    setTopLevelSel((p) => ({ ...p, [catId]: itemId }));
  };
  
  const onChangeLinkedMenuOption = (sectionIdx: number, itemIdx: number) => {
    const sec = linkedSections[sectionIdx];
    const item = sec?.items?.[itemIdx];
    if (!item) return;
    const key = sectionIdx;
    const itemId = Number(item?.id ?? item?.Id);
    setLinkedSel((p) => ({ ...p, [key]: itemId }));
  };

  const tileClasses = (selected: boolean) =>
    `text-left rounded-xl px-3 py-3 border shadow-sm transition ${
      selected
        ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/30 bg-white"
        : "border-neutral-200 bg-neutral-100 hover:bg-neutral-50"
    }`;

  if (!show) return null;

  const handleBackdrop = (e: any) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleConfirm = () => {
    const selectedTopLevel = Object.entries(topLevelSel).map(([catId, itemId]) => ({
      catId: Number(catId),
      itemId: Number(itemId),
    }));
    const selectedLinked = Object.entries(linkedSel).map(([blockIndex, itemId]) => ({
      blockIndex: Number(blockIndex),
      itemId: Number(itemId),
    }));
    onConfirm({
      id: productId,
      Name: productName,
      quantity: qty,
      selectedTopLevel,
      selectedLinked,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3"
      onMouseDown={handleBackdrop}
    >
      {/* Modal: sticky header & footer, scrollable body */}
      <div
        className="
          w-full sm:min-w-[50vw] max-w-[92vw] md:max-w-3xl lg:max-w-4xl
          max-h-[90vh] rounded-2xl bg-white shadow-xl relative
          flex flex-col overflow-hidden
        "
      >
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
            <div className="mt-1 text-xl font-bold text-[var(--brand)]">
              £ {priceNumber.toFixed(2)}
            </div>
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
          {/* Top-Level Sections (e.g., Pizza Base, Dressings) */}
          {topLevelSections.length > 0 &&
            topLevelSections.map((sec: any, sIdx: number) => {
              const catName = sec?.category?.Name ?? "Options";
              const catId = Number(sec?.category?.id ?? sIdx);
              const chosenId = topLevelSel[catId] ?? null;

              return (
                <section key={`tl-${catId}-${sIdx}`} className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--brand)]">{catName}</h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(sec?.items ?? []).map((it: any, i: number) => {
                      const id = Number(it?.id ?? it?.Id ?? i);
                      const selected = id === chosenId;
                      const price = Number(it?.Collection_Price ?? it?.Price ?? 0) || 0;
                      const thumb = it?.BackImage ? getMenuImageUrl(it.BackImage) : "";

                      return (
                        <button
                          key={`tl-item-${catId}-${id}`}
                          onClick={() => onChangeTopLevelLinkedMenuOption(sIdx, i)}
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

          {/* Linked Sections (from linkedMenuData) */}
          {linkedSections.length > 0 &&
            linkedSections.map((sec: any, sIdx: number) => {
              const title = sec?.category?.Name ?? "Options";
              const chosenId = linkedSel[sIdx] ?? null;

              return (
                <section key={`lm-${sIdx}`} className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--brand)]">{title}</h4>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(sec?.items ?? []).map((it: any, i: number) => {
                      const id = Number(it?.id ?? it?.Id ?? i);
                      const selected = id === chosenId;
                      const price = Number(it?.Collection_Price ?? it?.Price ?? 0) || 0;
                      const thumb = it?.BackImage ? getMenuImageUrl(it.BackImage) : "";

                      return (
                        <button
                          key={`lm-item-${sIdx}-${id}`}
                          onClick={() => onChangeLinkedMenuOption(sIdx, i)}
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
              onClick={handleConfirm}
              className="w-full h-12 rounded-xl bg-[var(--brand)] font-semibold text-white hover:opacity-90"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
