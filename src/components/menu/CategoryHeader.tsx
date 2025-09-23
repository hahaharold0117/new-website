"use client";

import Image from "next/image";
import clsx from "clsx";

type Props = {
    title: string;
    description?: string;
    image?: string;
    categories: string[];              // names to render as chips
    activeName?: string | null;        // currently selected category name
    onSelect?: (name: string) => void; // called when user clicks a chip
};

export default function CategoryHeader({
    title,
    description,
    image,
    categories,
    activeName,
    onSelect,
}: Props) {
    return (
        <section>
            <div className="relative overflow-hidden rounded-2xl bg-[#FFF3EB]">
                <div className="px-4 py-3 sm:px-5 sm:py-4">
                    <h2 className="text-2xl font-extrabold">{title}</h2>
                    {description && (
                        <p className="text-sm text-neutral-700">{description}</p>
                    )}
                </div>

                {image && (
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-[140px] sm:w-[200px]">
                        <Image src={image} alt="" fill className="object-cover" sizes="200px" />
                        <div className="absolute left-0 top-0 h-full w-4 bg-[#FFF3EB]" />
                    </div>
                )}
            </div>

            {/* category chips */}
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
