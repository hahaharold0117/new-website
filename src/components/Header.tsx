"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home", exact: true },
  { href: "/order-online", label: "Order Online" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header id="site-header" className="relative z-[60]">
      {/* Sticky NAV (stays on screen while the hero below scrolls away) */}
      <div className="sticky top-0 z-[70] bg-black/50 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 text-white">
          {/* Brand */}
          <Link href="/" className="text-xl font-extrabold tracking-tight text-red-400">
            LB Express
          </Link>

          {/* Mobile toggle */}
          <div className="justify-self-end md:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/40 bg-black/40"
            >
              <span className="block h-[2px] w-5 bg-white" />
            </button>
          </div>

          {/* Nav links */}
          <nav
            className={`${
              open ? "block" : "hidden"
            } absolute inset-x-0 top-full border-t border-white/20 bg-black/90 px-4 py-3 md:static md:block md:border-0 md:bg-transparent md:p-0`}
          >
            <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`border-b-2 border-transparent font-semibold text-white transition-colors ${
                      isActive(item.href, item.exact)
                        ? "border-red-400 text-red-400"
                        : "hover:text-red-400"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="md:ml-4">
                <span className="font-bold text-white">🛒 £0.00</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Hero background (scrolls with the page) */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('/images/header-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        {/* Spacer controls hero height; adjust as needed */}
        <div className="h-[200px] md:h-[260px]" />

        {/* Wave at the bottom of the hero */}
        <svg
          className="pointer-events-none absolute bottom-0 left-1/2 block h-[54px] w-[112%] -translate-x-1/2"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,64L48,80C96,96,192,128,288,133.3C384,139,480,117,576,117.3C672,117,768,139,864,149.3C960,160,1056,160,1152,144C1248,128,1344,96,1392,80L1440,64L1440,120L0,120Z"
            fill="#fff"
          />
        </svg>
      </div>
    </header>
  );
}
