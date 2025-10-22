import React, { useMemo, useState, useEffect } from "react";
import OrderSummary from "@/components/billing/OrderSummary";
import { Link } from "react-router-dom";
import AuthPageModal from "@/components/AuthPageModal"
import { useMain } from "@/contexts/main-context";
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment-timezone';
import { createOrder, createOrderDetailBatch } from '@/helpers/backend_helper'
import { useNavigate } from "react-router-dom";

type Payment = "cash" | "card";

export default function BillingPage() {
  const navigate = useNavigate();
  const { restaurant } = useMain();
  const [payment, setPayment] = useState<Payment>("cash");
  const [tip, setTip] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { bucket_items } = useSelector((state: any) => state.bucket);
  const { order_type } = useSelector((state: any) => state.menu);
  const [loading, setLoading] = useState(false);

  const restaurantId = restaurant && typeof restaurant === "object" && "id" in restaurant
    ? (restaurant as { id: number | string }).id
    : undefined;

  function computeSubtotal(items: any[]) {
    // expects each item to have { quantity, totalPrice } or { quantity, menuItem.price }
    return items.reduce((sum, it) => {
      const qty = Number(it.quantity || 1);
      const line =
        typeof it.totalPrice === "number"
          ? it.totalPrice
          : qty * Number(it.menuItem?.price ?? it.price ?? 0);
      return sum + (Number.isFinite(line) ? line : 0);
    }, 0);
  }

  const handleOrder = async () => {
    if (loading) return; // avoid double-clicks
    setLoading(true);
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        setShowAuthModal(true);
        return; // finally{} will run and stop the spinner
      }

      if (!bucket_items.length) {
        console.warn("No items in basket.");
        return;
      }

      const dtCreated = moment().tz('Europe/London').format('YYYY-MM-DDTHH:mm:ss');

      const serviceCharge = 5;
      const deliveryCharge = 3;
      const discount = 2.5;

      const subtotal = computeSubtotal(bucket_items);
      const totalAmount = subtotal + (Number(tip) || 0) + serviceCharge + deliveryCharge;
      const amountDue = Number((totalAmount - discount).toFixed(2));
      const amountRecv = payment === "card" ? Number(totalAmount.toFixed(2)) : 0;
      const change = Number((amountRecv - amountDue).toFixed(2));

      const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
      const CustomerId = authUser?.id ?? null;

      const orderData = {
        CustomerId,
        RestaurantId: restaurantId ?? null,
        ComputerName: "Website",
        Operator: 123,
        OrderDate: dtCreated,
        PayStatus: payment === "card" ? "PAID" : "NOT PAID",
        TotalAmount: Number(totalAmount.toFixed(2)),
        ServiceCharge: Number(serviceCharge.toFixed(2)),
        DeliveryCharge: Number(deliveryCharge.toFixed(2)),
        Order_Type: order_type,
        Order_Status: "CONFIRMED",
        Payment_Type: payment === "card" ? "CARD" : "CASH",
        Printed: true,
        Discount: Number(discount.toFixed(2)),
        AmountDue: amountDue,
        AmountReceived: amountRecv,
        Change: change,
        Driver_Id: 0,
        WebOrderId: 0,
        IsYummyOrder: false,
        DtCreated: dtCreated,
        DtConfirmed: dtCreated,
        IsWooOrder: false,
        UUID: (crypto?.randomUUID && crypto.randomUUID()) || `uuid-${Date.now()}`,
        Tip: Number((Number(tip) || 0).toFixed(2)),
        IsSelfService: false,
        Table_No: "",
        Table_Area_Name: "",
        createdAt: dtCreated,
        updatedAt: dtCreated,
      };

      const createOrderRes = await createOrder(orderData);

      if (createOrderRes?.data?.success) {
        const result = createOrderRes.data.result;
        result.Table_No = "";
        result.Table_Area_Name = "";

        const order_details = bucket_items.map((basketItem) => {
          let linkedDataReceipt = [];
          let DressingData = "";

          if (basketItem?.basketLinkedMenuData?.length) {
            basketItem.basketLinkedMenuData.forEach((element) => {
              element.menu_items.forEach((menuItem) => {
                if (menuItem.selected) {
                  DressingData += menuItem.Name + ",";
                  linkedDataReceipt.push({
                    linkedCategoryName: element.menu_category.Name,
                    linkedMenuItem: { menu_item_name: menuItem.Name, price: menuItem.Collection_Price },
                  });
                }
              });
            });
          }

          if (basketItem?.basketTopLevelLinkedMenuData?.length) {
            basketItem.basketTopLevelLinkedMenuData.forEach((element) => {
              element.topLevelLinkedMenuItems.forEach((menuItem) => {
                if (menuItem?.selected) {
                  DressingData += menuItem.Name + ",";
                  linkedDataReceipt.push({
                    linkedCategoryName: element.topLevelLinkedCategory.Name,
                    linkedMenuItem: { menu_item_name: menuItem?.Name, price: menuItem?.Collection_Price },
                  });
                }
              });
            });
          }

          const linkedDataReceiptTemp = {
            detailData: linkedDataReceipt,
            basketItem,
          };

          return {
            OrderId: result.id,
            Menu_Item_Name: basketItem.Name,
            Price: basketItem.Collection_Price,
            MenuItemId: basketItem.id,
            SubMenuItemId: basketItem?.subMenuId || null,
            ItemLevel: 1,
            Dressing: DressingData,
            orderDate: dtCreated,
            VatRate: 1,
            VatAmount: 1,
            Quantity: basketItem.quantity,
            Status: 1,
            LinkedDataReceipt: JSON.stringify(linkedDataReceiptTemp),
          };
        });

        const createOrderDetailRes = await createOrderDetailBatch(order_details);
        if (createOrderDetailRes?.data?.success) {
          navigate('/success');
        }
      }
    } catch (error) {
      console.log('error =>', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Billing Details</h1>
        <nav className="mt-2 text-sm text-neutral-500">
          <ol className="flex items-center gap-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>

            <li>›</li>
            <Link to="/menu" className="hover:underline">
              Menu
            </Link>
            <li>›</li>
            <Link to="/menu" className="hover:underline">
              Basket
            </Link>
            <li>›</li>
            <Link to="/billing" className="hover:underline">
              Billing
            </Link>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name *" placeholder="Placeholder" />
            <Field label="Last Name *" placeholder="Placeholder" />
            <Field label="Email" placeholder="Placeholder" type="email" />
            <Field label="Phone" placeholder="Placeholder" type="tel" />

            <Field label="Pickup Date" placeholder="Placeholder" type="date" />
            <Field label="Pickup Time" placeholder="Placeholder" type="time" />
          </div>

          {/* Tip selector + Payment */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TipBox tip={tip} setTip={setTip} />
            <PaymentBox payment={payment} setPayment={setPayment} />
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-lg bg-[var(--brand)] text-white font-semibold py-3 text-base shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleOrder}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Placing order…
              </span>
            ) : (
              "Place Order"
            )}
          </button>

        </section>
        <OrderSummary />
      </div>
      <AuthPageModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setShowAuthModal(false);
        }}
        restaurantId={restaurantId}
      />
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 outline-none ring-0 focus:border-neutral-400"
      />
    </label>
  );
}

function TipBox({
  tip,
  setTip,
}: {
  tip: number;
  setTip: (v: number) => void;
}) {
  const presets = [0, 5, 10, 15];
  const [custom, setCustom] = useState<string>("");

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="font-semibold mb-1">Add Tip?</div>
      <p className="text-sm text-neutral-500 mb-3">
        You can add tip as much as you want.
      </p>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setTip(p);
              setCustom("");
            }}
            className={`rounded-full border px-3 py-1.5 text-sm ${tip === p
              ? "border-[var(--brand)] text-[var(--brand)]"
              : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              }`}
          >
            {p === 0 ? "No" : `£${p.toFixed(2)}`}
          </button>
        ))}

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm">
            + Custom
          </span>
          <input
            type="number"
            min={0}
            value={custom}
            onChange={(e) => {
              const v = Number(e.target.value || 0);
              setCustom(e.target.value);
              setTip(v);
            }}
            placeholder="0.00"
            className="w-24 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentBox({
  payment,
  setPayment,
}: {
  payment: "cash" | "card";
  setPayment: (p: "cash" | "card") => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="font-semibold mb-3">Payment</div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-3 rounded-lg border border-neutral-300 p-3 cursor-pointer hover:bg-neutral-50">
          <input
            type="radio"
            name="payment"
            checked={payment === "cash"}
            onChange={() => setPayment("cash")}
            className="accent-[var(--brand)]"
          />
          <div>
            <div className="font-medium">Pay Cash</div>
            <div className="text-sm text-neutral-500">Pay cash at the door</div>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-neutral-300 p-3 cursor-pointer hover:bg-neutral-50">
          <input
            type="radio"
            name="payment"
            checked={payment === "card"}
            onChange={() => setPayment("card")}
            className="accent-[var(--brand)]"
          />
          <div>
            <div className="font-medium">Pay by Card</div>
            <div className="text-sm text-neutral-500">Pay cash at the door</div>
          </div>
        </label>
      </div>
    </div>
  );
}
