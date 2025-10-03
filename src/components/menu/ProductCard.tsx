// src/components/ProductCard.tsx
export default function ProductCard({
  title,
  price,
  desc,
  img,
}: {
  title: string;
  price: number;
  desc: string;
  img: string;
}) {
  const displayPrice = Number.isFinite(price) ? price : Number(price) || 0;

  return (
    <div className="h-36 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-1">
          <h5 className="font-semibold leading-tight">{title}</h5>
          <div className="mt-1 font-bold text-[#FF7A1A]">£{displayPrice.toFixed(2)}</div>
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{desc}</p>
        </div>

        <div className="flex w-28 shrink-0 flex-col items-end justify-between">
          <img
            src={img}
            alt={title}
            className="h-20 w-20 rounded-lg object-cover"
            loading="lazy"
          />
          <button
            type="button"
            className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A1A] text-white hover:opacity-90"
            aria-label={`Add ${title}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
