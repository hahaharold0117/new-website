"use client";

import { memo } from "react";

type Props = {
  categories: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

function CategorySidebarImpl({ categories, activeId, onSelect }: Props) {
  return (
    <aside className="sticky top-4 rounded-md border bg-white/70 backdrop-blur px-3 py-3">
      <h3 className="mb-2 px-2 text-lg font-semibold text-white bg-red-600 rounded-md py-2">Categories</h3>
      <ul className="space-y-1">
        {categories.map((c) => {
          const active = activeId === c.id;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`w-full rounded-md px-3 py-2 text-left transition ${
                  active
                    ? "bg-red-50 text-red-600 font-semibold"
                    : "hover:bg-gray-50"
                }`}
                aria-current={active ? "true" : undefined}
              >
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export const CategorySidebar = memo(CategorySidebarImpl);
