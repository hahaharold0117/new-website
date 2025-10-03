import {getMenuImageUrl} from '../../lib/utils'

export default function ProductCard({item}: any) {
  console.log('item =>', item)
  const displayPrice = Number.isFinite(item?.Collection_Price) ? item?.Collection_Price : Number(item?.Collection_Price) || 0;
  const maybe = item?.BackImage != null ? getMenuImageUrl(item?.BackImage) : "";
  const imgSrc = typeof maybe === "string" && maybe.trim()
    ? maybe
    : "/default-menu-category.png";

  return (
    <div className="h-36 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-1">
          <h5 className="font-semibold leading-tight">{item?.Name}</h5>
          <div className="mt-1 font-bold text-[#FF7A1A]">£{displayPrice.toFixed(2)}</div>
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
            className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A1A] text-white hover:opacity-90"
            aria-label={`Add ${item?.Name}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
