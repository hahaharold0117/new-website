"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import BucketPanel from "@/components/menu/BucketPanel";
import CategoryHeader from "@/components/menu/CategoryHeader";
import ProductCard from "@/components/menu/ProductCard";
import { useRestaurant } from "@/contexts/restaurant-context";

type ProductCardData = {
  id: number | string;
  title: string;
  price: number | string;
  desc?: string;
  img?: string;
};

function toProductCard(item: any): ProductCardData {
  return {
    id: item?.id ?? item?.Id ?? item?.ItemId ?? crypto.randomUUID(),
    title: item?.Name ?? item?.name ?? "Untitled",
    price: item?.Price ?? item?.price ?? item?.UnitPrice ?? item?.unitPrice ?? 0,
    desc: item?.Description ?? item?.description ?? item?.ShortDesc ?? "",
    img: item?.ImageUrl ?? item?.imageUrl ?? item?.ImageURL ?? "/images/default-menu-item.png",
  };
}

export default function MenuPage() {
  const { restaurant, menu: mainData } = useRestaurant();

  // Normalize menu from context ({ restaurant, menu } or { restaurant, mainData.menu })
  const menu = (mainData?.menu ?? mainData ?? []).length
    ? mainData.menu ?? mainData
    : restaurant?.menu ?? [];

  const categories = useMemo(
    () =>
      (menu ?? [])
        .filter(Boolean)
        .map((c: any) => ({
          id: c?.id ?? c?.Id,
          name: c?.Name ?? c?.name ?? "Unnamed",
          image: c?.ImageUrl ?? c?.imageUrl ?? c?.ImageURL ?? "/images/default-menu-category.png",
          description: c?.Remarks ?? c?.description ?? "",
          items: Array.isArray(c?.items) ? c.items : [],
        })),
    [menu]
  );

  const [activeCatId, setActiveCatId] = useState(categories[0]?.id ?? null);

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCatId) ?? categories[0],
    [categories, activeCatId]
  );

  const products: ProductCardData[] = useMemo(
    () => (activeCategory?.items ?? []).map(toProductCard),
    [activeCategory]
  );

  if (!categories.length) {
    return (
      <Container>
        <main className="py-10">
          <div className="text-center text-sm text-neutral-500">No menu data available.</div>
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

            {/* Products grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
              {products.map((p) => (
                <div key={p.id} className="h-full">
                  <ProductCard
                    title={p.title}
                    price={Number(p.price) || 0}
                    desc={p.desc ?? ""}
                    img={p.img ?? "/images/default-menu-item.png"}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN — BASKET */}
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto ">
            <BucketPanel />
          </div>
        </div>
      </main>
    </Container>
  );
}
