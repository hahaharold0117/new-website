import { useState, useEffect } from "react";
import { getMenuImageUrl, priceFor } from "../../lib/utils";
import { useDispatch, useSelector } from 'react-redux';
import { useMain } from "@/contexts/main-context";
import SubMenuModal from './SubMenuModal'
import MenuModal from './MenuModal'
import { LS_KEY } from '../../lib/env'
import { addBucketItem, updateBucketItemByIndex } from '@/store/actions'

export default function ProductCard({ item }: any) {
  const dispatch = useDispatch();
  const { menu } = useMain();
  const [menuItem, setMenuItem] = useState(null)
  const [subMenuData, setSubMenuData] = useState([])
  const [showSubMenuModal, setShowSubMenuModal] = useState(false)
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [linkedMenuData, setLinkedMenuData] = useState([])
  const { toplevel_linke_menu, menu_items, order_type } = useSelector((state: any) => state.menu);
  const { bucket_items } = useSelector((state: any) => state.bucket);

  const isDisabled = !Boolean(item?.Active);
  const rawPrice = order_type === "delivery" ? item?.Delivery_Price : item?.Collection_Price;

  const displayPrice = (() => {
    const n = Number(rawPrice);
    return Number.isFinite(n) ? n : 0;
  })();

  const maybe = item?.BackImage != null ? getMenuImageUrl(item?.BackImage) : "";
  const imgSrc = typeof maybe === "string" && maybe.trim() ? maybe : "/default-menu-category.png";

  const processItem = async (item: any) => {
    try {
      console.log('item =>', item)
      setMenuItem(item)
      let linked_category_data: any = null
      let linked_menu_data: any = null
      let linkedMenuData: any = [];
      let linkedCategoryData: any = [];

      if (item?.SubMenu) {
        setSubMenuData(item?.subItems)
        if (item?.subItems?.length > 0) {
          setShowSubMenuModal(true)
          setShowMenuModal(false)
        }
      } else {
        if (item?.LinkedMenuId) {
          const linkedMenuId = JSON.parse(item.LinkedMenuId)
          const keyValueArray: any = Object.entries(linkedMenuId).map(([key, value]) => {
            return { key, value };
          });

          for (let linkedData of keyValueArray) {
            const menu_category = menu.find((category) => category.id === Number(linkedData.key))
            const menuItems: any = []
            const menuItemIds = linkedData.value.items;

            for (let menuItemId of menuItemIds) {
              const menu_item = menu_items.find((menuItem) => menuItem.id === Number(menuItemId))
              menuItems.push(menu_item)
            }

            linked_menu_data = {
              menu_category: menu_category,
              menu_items: menuItems
            }

            //operation for LinkedCategory support module
            if (menu_category.LinkedCategoryId) {
              let linkedCategoryIds: any = []
              if (menu_category.LinkedCategoryId.includes(",")) {
                linkedCategoryIds = menu_category.LinkedCategoryId.split(",");
              } else {
                linkedCategoryIds = [menu_category.LinkedCategoryId];
              }

              let linkedItems: any = [];
              for (let linkedCategoryId of linkedCategoryIds) {
                const linkedCategory = menu.find((category) => category.id === Number(linkedCategoryId))
                menu_items.map((menuItem, index) => {
                  if (menuItem.Category_Id === Number(linkedCategoryId)) {
                    linkedItems.push(menuItem)
                  }
                })
                linked_category_data = {
                  menu_category: linkedCategory,
                  menu_items: linkedItems
                }
                linkedCategoryData.push(linked_category_data)
              }

            } else {
              linkedCategoryData = []
              linked_category_data = null
            }
            if (Number(linkedData.value.maxItemNo) > 1) {
              for (let i = 0; i < Number(linkedData.value.maxItemNo); i++) {
                linkedMenuData.push({ ...linked_menu_data })
                if (linkedCategoryData.length > 0) {
                  linkedCategoryData.map((item) => {
                    linkedMenuData.push({ ...item })
                  })
                }
              }
            } else {
              linkedMenuData.push({ ...linked_menu_data })
              if (linkedCategoryData.length > 0) {
                linkedCategoryData.map((item) => {
                  linkedMenuData.push({ ...item })
                })
              }
            }
          }
          setLinkedMenuData(linkedMenuData)
        }

        const hasBuiltLinked = Array.isArray(linkedMenuData) && linkedMenuData.length > 0;
        const hasTopLevel = Array.isArray(toplevel_linke_menu) && toplevel_linke_menu.length > 0;

        if (hasBuiltLinked || hasTopLevel) {
          setShowMenuModal(true);
          return;
        }

        const unit = priceFor(item, order_type);
        const idx = bucket_items.findIndex(x => {
          const noLinks = !x.basketLinkedMenuData?.length && !x.basketTopLevelLinkedMenuData?.length;
          return noLinks && x.id === item.id;
        });

        if (idx !== -1) {
          // bump quantity on existing row
          const existing = bucket_items[idx];
          const nextQty = (existing.quantity || 1) + 1;
          const updated = {
            ...existing,
            quantity: nextQty,
            totalPrice: unit * nextQty,
            addedAt: Date.now(),
          };

          dispatch(updateBucketItemByIndex({ index: idx, item: updated }));

          try {
            const arr = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
            if (Array.isArray(arr)) {
              arr[idx] = updated;
              localStorage.setItem(LS_KEY, JSON.stringify(arr));
            }
          } catch { }
        } else {
          // add new row
          const payload = {
            id: item?.id,
            Name: item?.Name,
            menuItem: item,
            quantity: 1,
            totalPrice: unit,
            basketTopLevelLinkedMenuData: [],
            basketLinkedMenuData: [],
            addedAt: Date.now(),
            image: imgSrc,
          };

          dispatch(addBucketItem(payload));
          try {
            const existing = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
            const next = Array.isArray(existing) ? [...existing, payload] : [payload];
            localStorage.setItem(LS_KEY, JSON.stringify(next));
          } catch {
            localStorage.setItem(LS_KEY, JSON.stringify([payload]));
          }
        }

        setShowMenuModal(false);
        setShowSubMenuModal(false);

      }
    } catch (error) {
      console.log('error =>', error)
    }
  }

  const onSelectSubMenu = async (item: any) => {
    processItem(item)
  }

  return (
    <div
      className={`relative h-36 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ${isDisabled ? "opacity-60 grayscale" : ""
        }`}
      aria-disabled={isDisabled}
    >
      {isDisabled && (
        <span className="absolute right-2 top-2 rounded-full bg-neutral-700/80 px-2 py-0.5 text-xs font-medium text-white">
          Unavailable
        </span>
      )}

      <div className="flex gap-4">
        <div className="flex-1">
          <h5 className="font-semibold leading-tight">{item?.Name}</h5>
          <div
            className={`mt-1 font-bold ${isDisabled ? "text-neutral-400" : "text-[var(--brand)]"
              }`}
          >
            £{displayPrice.toFixed(2)}
          </div>
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{item?.Remarks}</p>
        </div>

        <div className="flex w-28 shrink-0 flex-col items-end justify-between">
          <img
            src={imgSrc}
            alt={item?.Name}
            className="h-20 w-20 rounded-lg object-cover"
            loading="lazy"
          />

          <button
            type="button"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            title={isDisabled ? "Unavailable" : `Add ${item?.Name}`}
            className={`mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full ${isDisabled
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              : "bg-[var(--brand)] text-white hover:opacity-90"
              }`}
            onClick={() => processItem(item)}
          >
            +
          </button>
        </div>
      </div>
      <MenuModal
        show={showMenuModal}
        mode="add"
        menuItem={menuItem}
        orderType={order_type}
        linkedMenuData={linkedMenuData}
        quantity={1}
        onClose={() => setShowMenuModal(false)}
        onConfirm={(added) => {
        }}
      />
      <SubMenuModal
        menuData={subMenuData}
        show={showSubMenuModal}
        onSelect={item => onSelectSubMenu(item)}
        onClose={() => setShowSubMenuModal(false)}
      />
    </div>
  );
}
