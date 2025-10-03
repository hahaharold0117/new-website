import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MainContextProvider } from "./contexts/main-context.tsx";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./store.ts";
import { useAxios } from "@/lib/axios";
import { setAuth } from "@/store";
// Introjs components

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

import { useReadMainSettingDataQuery } from "./api.ts";
import { normalizeDomain } from './lib/utils.ts'

const links = [
  { to: "/", label: "Home", id: "homeNav" },
  { to: "/menu", label: "Menu", id: "menuNav" },
  { to: "/gallery", label: "Gallery", id: "galleryNav" },
  { to: "/reservation", label: "Reservation", id: "reservationNav" },
];

export function Root() {
  const api = useAxios();
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Header links={links} region={auth?.region} />
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
    ],
  },
]);

function AppProviders() {
  const [mainSettingData, setMainSettingData] = useState(null);

  const domain = normalizeDomain(
    typeof window !== "undefined" ? window.location.host : ""
  );

  const { data } = useReadMainSettingDataQuery({ domain }, { skip: !domain });

  useEffect(() => {
    if (data?.success) {
      setMainSettingData(data.result);
    }
  }, [data]);

  const ctxValue = mainSettingData ?? { restaurant: {}, menu: [] };

  return (
    <MainContextProvider value={ctxValue}>
      <RouterProvider router={router} />
    </MainContextProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AppProviders />
  </Provider>
);