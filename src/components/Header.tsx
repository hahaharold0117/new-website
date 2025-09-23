"use client";

import Container from "./Container";
import { Menu, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href: string) =>
    clsx(
      "block py-2 transition-colors",
      isActive(href)
        ? "text-brand font-semibold"
        : "text-inherit hover:text-brand"
    );

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90">
      <Container>
        <div className="flex items-center justify-between py-3">
          {/* Left: Nav links */}
          <nav
            className={clsx(
              "md:flex items-center gap-8 font-medium",
              open ? "block" : "hidden md:block"
            )}
          >
            <Link href="/" className={linkCls("/")} aria-current={isActive("/") ? "page" : undefined}>
              Home
            </Link>
            <Link href="/menu" className={linkCls("/menu")} aria-current={isActive("/menu") ? "page" : undefined}>
              Menu
            </Link>
            <Link href="/gallery" className={linkCls("/gallery")} aria-current={isActive("/gallery") ? "page" : undefined}>
              Gallery
            </Link>
            <Link href="/reservation" className={linkCls("/reservation")} aria-current={isActive("/reservation") ? "page" : undefined}>
              Reservation
            </Link>
          </nav>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/basket"
              className={clsx(
                "inline-flex items-center gap-2 rounded-md border px-4 py-2 bg-white hover:bg-neutral-50",
                isActive("/basket") && "border-brand text-brand"
              )}
              aria-label="Open basket"
            >
              <ShoppingBasket className="h-4 w-4" />
              <span>Basket</span>
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white font-semibold shadow-soft hover:opacity-90"
            >
              Order Online
            </Link>
          </div>

          <button
            className="md:hidden ml-3 inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/[.04]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </Container>
    </header>
  );
}
