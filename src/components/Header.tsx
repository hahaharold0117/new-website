import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, SunIcon, ShoppingBasket } from "lucide-react";
import clsx from "clsx";
import Container from "./Container";
import { ThemeContext } from "../contexts/mode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header({ links, region }: any) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { mode, setMode } = useContext(ThemeContext);
  const { bucket_items } = useSelector((state: any) => state.bucket);

  console.log('bucket_items =>', bucket_items)

  const itemCount = (bucket_items || []).reduce(
    (sum, it) => sum + (Number(it?.quantity) || 1),
    0
  );


  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href: string) =>
    clsx(
      "block py-2 text-sm md:text-[15px] transition-colors",
      isActive(href) ? "text-[var(--brand)] font-semibold" : "text-neutral-800 hover:text-[var(--brand)]"
    );

  return (
    <header className="sticky top-0 z-50 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <nav
            className={clsx(
              "md:flex items-center gap-8 font-medium",
              open ? "block" : "hidden md:block"
            )}
          >
            {links.map((l: any) => (
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

          <div className="ml-auto flex items-center gap-3">
            {region && (
              <span className="hidden sm:inline text-xs uppercase text-neutral-500">{region}</span>
            )}

            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50 relative"
              onClick={() => navigate("/menu")}
            >
              <span className="inline-flex">
                <ShoppingBasket className="h-5 w-5" />
                {itemCount > 0 && (
                  <span
                    className="absolute
                 grid place-items-center rounded-full bg-red-600 text-white
                 h-6 min-w-[24px] px-1.5 text-[12px] font-bold leading-none
                 shadow ring-2 ring-white"
                    style={{ top: -10, right: -10 }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </span>

              <span>Basket</span>
            </button>

            <Link
              to="/menu"
              className="inline-flex items-center rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Order Online
            </Link>

            <button
              type="button"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5"
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <SunIcon className="h-5 w-5" />
            </button>

            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>

        <nav
          className={clsx(
            open ? "block" : "hidden",
            "md:hidden flex flex-col items-start space-y-2 p-4"
          )}
        >
          {links.map((l: any) => (
            <Link
              key={l.to}
              id={l.id}
              to={l.to}
              className={clsx(
                "py-1 text-[15px]",
                isActive(l.to) ? "text-[var(--brand)] font-semibold" : "text-neutral-800"
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
