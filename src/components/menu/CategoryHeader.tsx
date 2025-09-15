import Image from "next/image";
import clsx from "clsx";

export default function CategoryHeader({
    title,
    description,
    image,
    categories,
}: {
    title: string;
    description?: string;
    image?: string;
    categories: string[];
}) {
    return (
        <section>
            <div className="relative overflow-hidden rounded-2xl bg-[#FFF3EB]">
                <div className="px-4 py-3 sm:px-5 sm:py-4">
                    <h2 className="text-2xl font-extrabold">{title}</h2>
                    {description && (
                        <p className="text-sm text-neutral-700">{description}</p>
                    )}
                </div>

                {/* top-right image */}
                {image && (
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-[140px] sm:w-[200px]">
                        <Image
                            src={image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="200px"
                        />
                        {/* hide left edge under soft radius */}
                        <div className="absolute left-0 top-0 h-full w-4 bg-[#FFF3EB]" />
                    </div>
                )}
            </div>

            {/* category chips */}
            <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((c, i) => (
                    <button
                        key={`${c}-${i}`}
                        className={clsx(
                            "inline-flex items-center rounded-full border px-3 py-1 text-sm",
                            "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                        )}
                    >
                        {c}
                    </button>
                ))}
            </div>
        </section>
    );
}
