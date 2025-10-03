import { useMemo } from 'react'
import clsx from "clsx";
import { getMenuImageUrl } from '../../lib/utils'

type Props = {
  title: string;
  description?: string;
  image?: string;
  categories: string[];
  activeName?: string | null;
  onSelect?: (name: string) => void;
};

export default function CategoryHeader({
  title,
  description,
  image,
  categories,
  activeName,
  onSelect,
}: Props) {

  const maybe = image != null ? getMenuImageUrl(image) : "";
  const imgSrc = typeof maybe === "string" && maybe.trim()
    ? maybe
    : "/default-menu-category.png";

  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl bg-[#FFF3EB]">
        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="text-2xl font-extrabold">{title}</h2>
          {description && <p className="text-sm text-neutral-700">{description}</p>}
        </div>

        <div className="pointer-events-none absolute right-0 top-0 h-full w-[140px] sm:w-[200px]">
          <img
            src={imgSrc}
            alt=""
            role="presentation"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute left-0 top-0 h-full w-4 bg-[#FFF3EB]" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((name) => {
          const active = name === activeName;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelect?.(name)}
              className={clsx(
                "inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors",
                active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50"
              )}
              aria-pressed={active}
            >
              {name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
