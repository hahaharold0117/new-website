import { MenuItem } from "@/data/menu";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border bg-white p-4">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{item.name}</h4>
          {item.badge === "spicy" && <span className="text-xs text-red-600">🌶️</span>}
          {item.badge === "veg" && <span className="text-xs text-green-600">🌱</span>}
          {item.badge === "new" && <span className="text-xs text-blue-600">NEW</span>}
        </div>
        {item.description && (
          <p className="mt-1 text-sm text-amber-600">{item.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-bold text-red-600">
          £{item.price.toFixed(2)}
        </span>
        <button className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700">
          Add
        </button>
      </div>
    </div>
  );
}
