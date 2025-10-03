"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import BucketPanel from "@/components/menu/BucketPanel";
import CategoryHeader from "@/components/menu/CategoryHeader";
import ProductCard from "@/components/menu/ProductCard";
import { useMain } from "@/contexts/main-context";

export default function MenuPage() {
  const { menu } = useMain();
  console.log("menu =>", menu);

  // Use only the provided fields: Name, Collection_Price, Remarks
  const categories = useMemo(
    () =>
      (menu ?? [])
        .filter(Boolean)
        .map((c: any) => ({
          id: c?.id ?? c?.Id ?? c?.CategoryId ?? null, // keep whatever id exists, if any
          name: c?.Name ?? "Unnamed",
          description: c?.Remarks ?? "",
          items: Array.isArray(c?.items) ? c.items : [],
          image: "/default-menu-category.png",
        })),
    [menu]
  );

  const [activeCatId, setActiveCatId] = useState(categories[0]?.id ?? null);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCatId) ?? categories[0],
    [categories, activeCatId]
  );

  const products = useMemo(
    () => (activeCategory?.items ?? []),
    [activeCategory]
  );

  if (!categories.length) {
    return (
      <Container>
        <main className="py-10">
          <div className="text-center text-sm text-neutral-500">
            No menu data available.
          </div>
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <main className="py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <CategoryHeader
              title={activeCategory?.name}
              description={activeCategory?.description || "Explore our menu."}
              image={activeCategory?.image}
              categories={categories.map((c) => c.name)}
              activeName={activeCategory?.name}
              onSelect={(name) =>
                setActiveCatId(categories.find((c) => c.name === name)?.id ?? activeCatId)
              }
            />

            {/* Products grid: read Name, Collection_Price, Remarks directly */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
              {products.map((it: any, idx: number) => (
                <div key={it?.id ?? it?.Id ?? it?.ItemId ?? idx} className="h-full">
                  <ProductCard
                    title={it?.Name ?? "Untitled"}
                    price={Number(it?.Collection_Price ?? 0)}
                    desc={it?.Remarks ?? ""}
                    img={"/default-menu-item.png"}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN — BASKET */}
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <BucketPanel />
          </div>
        </div>
      </main>
    </Container>
  );
}
