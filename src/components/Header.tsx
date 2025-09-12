"use client";

import Container from "./Container";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
      <Container>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/[.04]"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
            <Link href="/" className="font-extrabold text-2xl tracking-tight">
              <span className="text-brand">Yummy</span>Website
            </Link>
          </div>

          <nav
            className={clsx(
              "md:flex items-center gap-6 font-medium",
              open ? "block" : "hidden md:block"
            )}
          >
            <Link href="#menu" className="hover:text-brand">Menu</Link>
            <Link href="#highlights" className="hover:text-brand">Highlights</Link>
            <Link href="#contact" className="hover:text-brand">Contact</Link>
            <Link
              href="/order-online"
              className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-white font-semibold shadow-soft hover:opacity-90"
            >
              Order Online
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
