// src/pages/SuccessPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const { state } = useLocation(); // optional: { orderId, total, payment, orderType }
  const navigate = useNavigate();
  const [reveal, setReveal] = useState(false);

  // read from state or fallback to localStorage / querystring
  const qs = new URLSearchParams(window.location.search);
  const orderId   = state?.orderId || qs.get("orderId") || localStorage.getItem("lastOrderId") || "";
  const total     = state?.total ?? 0;
  const payment   = state?.payment || localStorage.getItem("lastOrderPayment") || "card";
  const orderType = state?.orderType || localStorage.getItem("lastOrderType") || "delivery";

  useEffect(() => {
    setReveal(true);
    // persist on first arrival so refresh keeps context
    if (state?.orderId) {
      localStorage.setItem("lastOrderId", String(state.orderId));
      if (state.total != null) localStorage.setItem("lastOrderTotal", String(state.total));
      if (state.payment) localStorage.setItem("lastOrderPayment", state.payment);
      if (state.orderType) localStorage.setItem("lastOrderType", state.orderType);
    }
  }, [state]);

  return (
    <main className="relative mx-auto max-w-3xl px-4 py-16">
      {/* subtle bg glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/80 via-white to-white" />

      <section
        className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-lg"
        aria-live="polite"
      >
        {/* Check badge */}
        <div className="flex justify-center">
          <div
            className={[
              "relative h-24 w-24 rounded-full",
              "bg-gradient-to-br from-emerald-100 to-emerald-50",
              "ring-8 ring-emerald-100/60 shadow-2xl",
              "flex items-center justify-center",
              "transition-all duration-500",
              reveal ? "scale-100 opacity-100" : "scale-90 opacity-0",
            ].join(" ")}
          >
            {/* pulsing halo */}
            <div className="absolute inset-0 rounded-full animate-ping bg-emerald-200/30" />
            {/* check mark */}
            <svg
              className="relative z-10 h-12 w-12 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="mt-6 text-center text-3xl font-semibold text-neutral-900">
          Order confirmed
        </h1>
        <p className="mt-2 text-center text-neutral-600">
          Thanks! We’ve received your order
          {orderId ? (
            <>
              {" "}
              <span className="font-semibold text-neutral-800">#{orderId}</span>
            </>
          ) : null}
          . You’ll get an update when it’s{" "}
          {orderType === "pickup" ? "ready for pickup" : "on the way"}.
        </p>

        {/* facts */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Info
            label="Payment"
            value={payment === "card" ? "Card" : "Cash"}
            icon={
              payment === "card" ? (
                <CardIcon />
              ) : (
                <CashIcon />
              )
            }
          />
          <Info
            label="Total"
            value={total ? `£${Number(total).toFixed(2)}` : "—"}
            icon={<TotalIcon />}
          />
          <Info
            label="Order time"
            value={new Date().toLocaleString()}
            icon={<ClockIcon />}
          />
        </div>

        {/* timeline-ish next steps */}
        <ol className="mt-8 space-y-3">
          <Step
            title="We’re preparing your order"
            desc={orderType === "pickup" ? "You’ll be notified when it’s ready." : "Our driver will pick it up soon."}
            active
          />
          <Step
            title={orderType === "pickup" ? "Ready for pickup" : "Out for delivery"}
            desc={orderType === "pickup" ? "Bring your order number to the counter." : "Track your order from your account."}
          />
          <Step title="Enjoy!" desc="Thanks for choosing us." />
        </ol>

        {/* actions */}
        <div className="mt-10 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Continue ordering
          </Link>
          <button
            type="button"
            onClick={() => navigate(orderId ? `/orders/${orderId}` : "/account/orders")}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            View order
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
          >
            Print receipt
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          A receipt has been sent to your email if available.
        </p>
      </section>
    </main>
  );
}

/* ---------- small bits ---------- */

function Info({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
        <div className="mt-0.5 text-sm font-semibold text-neutral-900">{value}</div>
      </div>
    </div>
  );
}

function Step({ title, desc, active = false }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={[
          "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
          active ? "bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50" : "bg-neutral-100 text-neutral-500",
        ].join(" ")}
      >
        {active ? "✓" : "•"}
      </span>
      <div>
        <div className="text-sm font-medium text-neutral-900">{title}</div>
        <div className="text-sm text-neutral-600">{desc}</div>
      </div>
    </li>
  );
}

/* ---------- tiny inline icons (no libs) ---------- */

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9h0M18 15h0" strokeLinecap="round" />
    </svg>
  );
}

function TotalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
