import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MainContextProvider } from "./contexts/main-context.tsx";
import { Provider, useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import Hero from './components/Hero.tsx'
import PromoSplit from './components/PromoSplit.tsx'
import Container from './components/Container.tsx'
import FeatureBullets from './components/FeatureBullets.tsx'
import Highlights from './components/Highlights.tsx'
import CallToAction from './components/CallToAction.tsx'
import ContactHours from './components/ContactHours.tsx'
import Footer from './components/Footer.tsx'
import Menu from './menu.tsx'
import Gallery from './gallery.tsx'
import Reservation from './reservation.tsx'
import Billing from './billing.tsx'

import { normalizeDomain } from './lib/utils.ts'
import { configureStore } from "./store/index";
import { getMainSettingData } from './helpers/backend_helper.ts'
import ThemeVars from "./ThemeVars.tsx";
import { Toaster } from 'react-hot-toast';
import { LS_KEY } from "./lib/env";
import { addBucketItem } from "@/store/bucket/actions";

const links = [
  { to: "/", label: "Home", id: "homeNav" },
  { to: "/menu", label: "Menu", id: "menuNav" },
  { to: "/gallery", label: "Gallery", id: "galleryNav" },
  { to: "/reservation", label: "Reservation", id: "reservationNav" },
];

export function Root() {
  return (
    <>
      <Header links={links} />
      <Outlet />
    </>
  );
}

export function Index() {
  return (
    <>
      <Hero />
      <PromoSplit />
      <section className="py-6">
        <Container>
          <FeatureBullets />
        </Container>
      </section>
      <section className="py-6 mt-4">
        <Container>
          <h2
            className="text-center font-black uppercase tracking-tight leading-[1.05] text-[clamp(28px,4vw,40px)]"
          >
            <span className="block">HIGHLIGHTS</span>
            <span className="block">OF US</span>
          </h2>
          <div className="mt-8">
            <Highlights />
          </div>
        </Container>
      </section>
      <CallToAction />
      <section className="py-12">
        <Container>
          <ContactHours />
        </Container>
      </section>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'rounded-xl shadow-lg',
          duration: 3500,
          success: { className: 'bg-emerald-600 text-white' },
          error: { className: 'bg-rose-600 text-white' },
          loading: { className: 'bg-neutral-800 text-white' },
        }}
      />
    </>
  );
}

const router = createBrowserRouter([
  {
    id: "Root",
    path: "/",
    element: <Root />,
    handle: { crumb: () => "Home" },
    children: [
      { id: "Home", index: true, element: <Index /> },
      {
        path: "menu",
        element: <Menu />,
        handle: { crumb: () => "Menu" },
      },
      {
        path: "gallery",
        element: <Gallery />,
        handle: { crumb: () => "Gallery" },
      },
      {
        path: "reservation",
        element: <Reservation />,
        handle: { crumb: () => "Reservation" },
      },
      {
        path: "billing",
        element: <Billing />,
        handle: { crumb: () => "Billing" },
      },
    ],
  },
]);

function AppProviders() {
  const dispatch = useDispatch();
  const [mainSettingData, setMainSettingData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { bucket_items } = useSelector((state: any) => state.bucket);

  const domain = useMemo(
    () => (typeof window !== "undefined" ? normalizeDomain(window.location.host) : "localhost"),
    []
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getMainSettingData(domain);
        if (!alive) return;

        if (res?.success) {
          setMainSettingData(res.result as any);
        } else {
          setError(res?.message || "Failed to load settings.");
          setMainSettingData({ restaurant: {}, menu: [] });
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Network error.");
        setMainSettingData({ restaurant: {}, menu: [] });
      }
    })();

    return () => {
      alive = false;
    };
  }, [domain]);

  useEffect(() => {
    if (bucket_items.length > 0) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) arr.forEach((item) => dispatch(addBucketItem(item)));
    } catch { }
  }, [bucket_items.length, dispatch]);

  const ctxValue: any = mainSettingData ?? { restaurant: {}, menu: [] };

  if (!mainSettingData && !error) {
    return (
      <div className="grid min-h-screen place-items-center text-neutral-500">
        Loading…
      </div>
    );
  }

  const brandColor = "#3f5f2f"
  // const brandColor = "#FF7A1A"

  return (
    <MainContextProvider value={ctxValue}>
      <ThemeVars color={brandColor} />
      <RouterProvider router={router} />
    </MainContextProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={configureStore({})}>
    <AppProviders />
  </Provider>
);