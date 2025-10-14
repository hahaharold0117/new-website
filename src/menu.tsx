// src/pages/menu.tsx (MenuPage)
import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import BucketPanel from "@/components/menu/BucketPanel";
import CategoryHeader from "@/components/menu/CategoryHeader";
import ProductCard from "@/components/menu/ProductCard";
import { useMain } from "@/contexts/main-context";
import { useDispatch } from "react-redux";
import { setToplevelLinkedMenu, setAllMenuItem, setOrderTypeVal } from "@/store/actions";
import OrderTypeModal, { OrderType } from "@/components/menu/OrderTypeModal";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function MenuPage() {
  const dispatch = useDispatch();
  const { menu } = useMain();

  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [orderType, setOrderType] = useState<OrderType | null>(null);

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem("order_type") as OrderType | null)
      : null);
    if (!saved) {
      setShowOrderTypeModal(true);
    } else {
      dispatch(setOrderTypeVal(saved))
      setOrderType(saved);
    }
  }, []);

  const allMenuItems: any[] = useMemo(() => {
    const out: any[] = [];
    (menu || []).forEach((cat: any) => (cat.items || []).forEach((it: any) => out.push(it)));
    return out;
  }, [menu]);

  useEffect(() => {
    dispatch(setAllMenuItem(allMenuItems));
  }, [dispatch, allMenuItems]);

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
  const products = useMemo(() => activeCategory?.items ?? [], [activeCategory]);

  useEffect(() => {
    if (!menu?.length || !activeCatId) return;

    let topLevelLinkedCategoryIds: string[] = [];
    const topLevelLinkedData: any[] = [];
    const menuCategory: any = menu.find((c: any) => c.id === activeCatId);

    if (menuCategory?.LinkedCategoryId) {
      topLevelLinkedCategoryIds = menuCategory.LinkedCategoryId.includes(",")
        ? menuCategory.LinkedCategoryId.split(",")
        : [menuCategory.LinkedCategoryId];

      for (const id of topLevelLinkedCategoryIds) {
        const topLevelLinkedCategory = menu.find((c: any) => c.id === Number(id));
        const items = allMenuItems.filter((mi: any) => mi.Category_Id === Number(id));
        topLevelLinkedData.push({
          topLevelLinkedCategory,
          topLevelLinkedMenuItems: items,
        });
      }
    }
    dispatch(setToplevelLinkedMenu(topLevelLinkedData));
  }, [activeCatId, menu, allMenuItems, dispatch]);

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
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
              {products.map((item: any) => (
                <div key={item?.id} className="h-full">
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          </section>

          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
            <BucketPanel
              orderType={orderType} // state from MenuPage
              onChange={(v, length) => {
                setOrderType(v);
                dispatch(setOrderTypeVal(v))
                localStorage.setItem("order_type", v);
                if (length > 0) {
                  toast('OderType was changed and the price may be changed!',
                    {
                      icon: '👏',
                      style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                      },
                    }
                  );
                } else {
                  toast('Order Type was changed',
                    {
                      icon: '👏',
                      style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                      },
                    }
                  );
                }
              }}
            />
          </div>
        </div>
      </main>

      <OrderTypeModal
        show={showOrderTypeModal}
        value={orderType}
        onChange={(v) => setOrderType(v)}
        onClose={() => setShowOrderTypeModal(false)}
        onContinue={() => {
          if (!orderType) return;
          localStorage.setItem("order_type", orderType);
          dispatch(setOrderTypeVal(orderType))
          setShowOrderTypeModal(false);
        }}
      />
      < Toaster
        position="top-right"
        reverseOrder={false}
      />
    </Container>
  );
}
