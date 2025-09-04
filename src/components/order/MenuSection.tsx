import { CSSProperties } from "react";
import { Category } from "@/data/menu";
import MenuItemCard from "./MenuItemCard";

type Props = {
  category: Category;
  style?: CSSProperties;
  className?: string;
};

export default function MenuSection({ category, style, className = "" }: Props) {
  return (
    <section
      id={category.id}
      aria-label={category.name}
      style={style}
      className={`scroll-mt-24 ${className}`}
    >
      {/* Section header */}
      <div className="relative overflow-hidden rounded-md border bg-[url('/images/pattern.png')] bg-gray-800/80 bg-blend-multiply">
        <div className="px-4 py-6 text-white">
          <div className="flex items-center gap-4">
            <span className="hidden h-px flex-1 bg-white/30 md:block" />
            <h3 className="text-2xl font-semibold">{category.name}</h3>
            <span className="hidden h-px flex-1 bg-white/30 md:block" />
          </div>
          {category.blurb && (
            <p className="mt-1 text-sm text-amber-300">{category.blurb}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 space-y-3">
        {category.items.map((it) => (
          <MenuItemCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
