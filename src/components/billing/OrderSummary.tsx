import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderTypeVal } from "@/store/actions";
import { Restaurant } from "../../types";
import { useMain } from "@/contexts/main-context";
import { priceFor, num } from "../../lib/utils";

type OrderType = "delivery" | "pickup";

export default function OrderSummary() {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const { restaurant } = useMain() as { restaurant: Restaurant };
  const { bucket_items } = useSelector((state: any) => state.bucket);

  // Build address from restaurant fields
  const street = restaurant?.Street?.trim();
  const city = restaurant?.City?.trim();
  const postcode = restaurant?.PostCode?.trim();
  const address = [street, city, postcode].filter(Boolean).join(", ");

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem("order_type") as OrderType | null)
      : null);
    if (saved) {
      setOrderType(saved);
      dispatch(setOrderTypeVal(saved))
    }
  }, []);

  function baseUnitPrice(it) {
    const source = it?.menuItem ?? it;
    return num(priceFor(source, orderType));
  }

  function lineTotalOf(it) {
    const qty = num(it?.quantity) || 1;
    const fromField = num(it?.totalPrice);
    if (fromField > 0) return fromField;
    return unitPriceWithOptions(it) * qty;
  }

  function unitPriceWithOptions(it) {
    return baseUnitPrice(it) + optionsPricePerUnit(it);
  }

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

  return (
    <aside
      className={`rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm w-full max-w-md lg:sticky lg:top-6`}
      aria-label="Order Summary"
    >
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

      <section className="mb-4">
        <h3 className="font-semibold text-neutral-700">{orderType === 'pickup' ? "Pickup Information" : "Delivery Information"}</h3>
        <div className="mt-1 space-y-1 text-sm text-neutral-700">
          <p>Name</p>
          <p>Order Type: {orderType}</p>
          <p className="text-neutral-600">
            {restaurant?.ShopName}, {address}
          </p>
        </div>
      </section>

      <section className="mb-4 pt-3">
        <h3 className="font-semibold text-neutral-700 mb-2">Order Details</h3>
        {bucket_items?.length > 0 && (
          <>
            <div className="space-y-4">
              {bucket_items.map((it, idx) => {
                const qty = num(it?.quantity) || 1;
                const unitBase = baseUnitPrice(it);
                const unitWithOpts = unitBase;
                const lineTotal = lineTotalOf(it);

                return (
                  <div key={it?.addedAt ?? `${it?.id}-${idx}`} className="rounded-lg  p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="font-semibold truncate">{it?.Name ?? "Item"} <span className="text-neutral-600">x{qty}</span></div>
                          {/* <div className="ml-2 shrink-0 text-sm font-semibold">£ {unitWithOpts.toFixed(2)}</div> */}
                          <div className="ml-2 shrink-0 text-sm font-semibold">£ {lineTotal.toFixed(2)}</div>
                        </div>

                        {(it?.groups ?? buildGroupsFromLegacy(it)).map((grp, gIdx) => (
                          <div key={`${grp?.title ?? gIdx}`} className="mt-1" style={{ marginLeft: 10 }}>
                            <div className="text-[13px] font-semibold text-[var(--brand)]">{grp?.title ?? "Options"}</div>
                            {(grp?.items ?? []).map((op, iIdx) => (
                              <div key={`${grp?.title}-${op?.id ?? iIdx}`} className="pl-3 text-[13px]">
                                <span className="text-neutral-800">{op?.name ?? op?.Name ?? "Option"}</span>{" "}
                                <span className="text-neutral-500">( £{num(op?.price).toFixed(2)} )</span>
                              </div>
                            ))}
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 border-t pt-4">
              <Totals bucketItems={bucket_items} />
            </div>
          </>
        )}
      </section>
    </aside>
  );
}
