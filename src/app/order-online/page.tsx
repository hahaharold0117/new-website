"use client";

import Container from "@/components/Container";
import { CategorySidebar } from "@/components/order/CategorySidebar";
import MenuSection from "@/components/order/MenuSection";
import useScrollSpy from "@/components/order/useScrollSpy";
import useHeaderOffset from "@/components/order/useHeaderOffset";
import { CATEGORIES } from "@/data/menu";
import { useMemo, useRef } from "react";

export default function OrderOnlinePage() {
  // section ids for scroll-spy
  const sectionIds = useMemo(() => CATEGORIES.map((c) => c.id), []);
  // header height so we can size/stick things correctly
  const headerOffset = useHeaderOffset(8);

  // RIGHT column scroll container (only this scrolls)
  const menuRef = useRef<HTMLDivElement | null>(null);
  // spy inside the right container (root = menuRef)
  const activeId = useScrollSpy(sectionIds, menuRef, 16);

  // calc a viewport-height string for inline style
  const maxH = `calc(100vh - ${headerOffset}px)`;

  const handleSelectCategory = (id: string) => {
    const root = menuRef.current;
    const el = document.getElementById(id);
    if (!root || !el) return;
    root.scrollTo({
      top: el.offsetTop - 8, // small breathing room from top
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10">
      <Container>
        <p className="mb-4 text-center text-lg font-semibold text-red-600">
          Delivery Charges will be calculated at checkout
        </p>

        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          {/* LEFT: categories always visible */}
          <div className="md:self-start">
            <div className="sticky" style={{ top: headerOffset }}>
              <div style={{ maxHeight: maxH, overflowY: "auto" }}>
                <CategorySidebar
                  categories={CATEGORIES.map(({ id, name }) => ({ id, name }))}
                  activeId={activeId}
                  onSelect={handleSelectCategory}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: menu list scrolls inside this container */}
          <div
            ref={menuRef}
            className="rounded-md border bg-white p-3 md:p-4 overflow-y-auto"
            style={{ maxHeight: maxH }}
          >
            <div className="space-y-8">
              {CATEGORIES.map((cat) => (
                <MenuSection
                  key={cat.id}
                  category={cat}
                  // nice offset when jumping to anchors inside this container
                  style={{ scrollMarginTop: 12 }}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
