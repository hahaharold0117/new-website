"use client";

import BucketPanel from "@/components/menu/BucketPanel";
import CategoryHeader from "@/components/menu/CategoryHeader";
import ProductCard from "@/components/menu/ProductCard";
import Container from "@/components/Container";

const categories = [
  "Soup",
  "Pizzas",
  "Kebabs",
  "Mezes",
  "Drinks",
  "Desserts",
  "Desserts",
  "Desserts",
  "Desserts",
];

const products = new Array(8).fill(0).map((_, i) => ({
  id: i + 1,
  title: "Turkish Lentil Soup",
  price: 5.99,
  desc:
    "Traditional Turkish red lentil soup with aromatic herbs and spices. Served with fresh bread.",
  img: "/images/default-menu-item.png",
}));

export default function MenuPage() {
  return (
    <Container>
      <main className="py-6">
        <div className="container mx-auto">
          <CategoryHeader
            title="Soups"
            description="Delicious and hearty soups."
            image="/images/default-menu-category.png"
            categories={categories}
          />
          {/* Content grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left: products */}
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            {/* Right: basket (sticky) */}
            <aside className="lg:pl-2">
              <div className="lg:sticky lg:top-4">
                <BucketPanel />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Container>

  );
}
