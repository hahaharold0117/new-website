import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import BucketPanel from "@/components/menu/BucketPanel";
import CategoryHeader from "@/components/menu/CategoryHeader";
import ProductCard from "@/components/menu/ProductCard";
import { useMain } from "@/contexts/main-context";
import { useDispatch, useSelector } from 'react-redux';
import { setToplevelLinkedMenu, setAllMenuItem } from '@/store/actions'

export default function MenuPage() {
  const dispatch = useDispatch()
  const { menu } = useMain();
  const allMenuItems: any[] = [];
  (menu || []).forEach(cat => {
    (cat.items || []).forEach(it => {
      allMenuItems.push(it);
    });
  });

  dispatch(setAllMenuItem(allMenuItems))

  const categories = useMemo(
    () =>
      (menu ?? [])
        .filter(Boolean)
        .filter((c: any) => Number(c?.CategoryType ?? c?.categoryType) === 0)
        .map((c: any) => ({
          id: c?.id ?? null,
          name: c?.Name ?? "Unnamed",
          description: c?.Remarks ?? "",
          items: Array.isArray(c?.items) ? c.items : [],
          image: c?.BackImage,
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

  useEffect(() => {
    let topLevelLinkedCategoryIds: any = []
    let topLevelLinkedData: any = []
    const menuCategory = menu.find(cateogry => cateogry.id === activeCatId)
    if (menuCategory.LinkedCategoryId) {
      if (menuCategory.LinkedCategoryId.includes(",")) {
        topLevelLinkedCategoryIds = menuCategory.LinkedCategoryId.split(",");
      } else {
        topLevelLinkedCategoryIds = [menuCategory.LinkedCategoryId];
      }

      for (let topLevelLinkedCategoryId of topLevelLinkedCategoryIds) {
        let topLevelLinkedMenuItems = [];
        const topLevelLinkedCategory = menu.find((category) => category.id === Number(topLevelLinkedCategoryId))
        if (allMenuItems.length) {
          allMenuItems.map((menuItem, index) => {
            if (menuItem.Category_Id === Number(topLevelLinkedCategoryId)) {
              topLevelLinkedMenuItems.push(menuItem)
            }
          })
        }
        const topLevelLinkedObject = {
          topLevelLinkedCategory: topLevelLinkedCategory,
          topLevelLinkedMenuItems: topLevelLinkedMenuItems
        }
        topLevelLinkedData.push(topLevelLinkedObject)
      }
    }
    dispatch(setToplevelLinkedMenu(topLevelLinkedData))

  }, [activeCatId])


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

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
              {products.map((item: any) => (
                <div key={item?.id} className="h-full">
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          </section>

          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <BucketPanel />
          </div>
        </div>
      </main>
    </Container>
  );
}
