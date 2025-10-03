import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, SunIcon, ShoppingBasket } from "lucide-react";
import clsx from "clsx";
import Container from "./Container";
import { ThemeContext } from "../contexts/mode";

export default function Header({ links, region }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { mode, setMode } = useContext(ThemeContext);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href) =>
    clsx(
      "block py-2 text-sm md:text-[15px] transition-colors",
      isActive(href) ? "text-[#FF7A1A] font-semibold" : "text-neutral-800 hover:text-[#FF7A1A]"
    );

  return (
    <header className="sticky top-0 z-50 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Left: nav */}
          <nav
            className={clsx(
              "md:flex items-center gap-8 font-medium",
              open ? "block" : "hidden md:block"
            )}
          >
            {links.map((l) => (
              <Link
                key={l.to}
                id={l.id}
                to={l.to}
                className={linkCls(l.to)}
                aria-current={isActive(l.to) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="ml-auto flex items-center gap-3">
            {region && (
              <span className="hidden sm:inline text-xs uppercase text-neutral-500">{region}</span>
            )}

            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
            >
              <ShoppingBasket className="h-4 w-4" />
              <span>Basket</span>
            </button>

            <Link
              to="/menu"
              className="inline-flex items-center rounded-md bg-[#FF7A1A] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Order Online
            </Link>

            {/* Theme toggle (optional) */}
            <button
              type="button"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5"
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <SunIcon className="h-5 w-5" />
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          className={clsx(
            open ? "block" : "hidden",
            "md:hidden flex flex-col items-start space-y-2 p-4"
          )}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              id={l.id}
              to={l.to}
              className={clsx(
                "py-1 text-[15px]",
                isActive(l.to) ? "text-[#FF7A1A] font-semibold" : "text-neutral-800"
              )}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
