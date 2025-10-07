// src/components/ProductCard.tsx
import { Link } from "react-router-dom";

type Props = {
  title: string;
  desc: string;
  price: string;
  img: string;
};

export default function ProductCard({ title, desc, price, img }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-soft">
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />
      </div>

      <div className="p-4">
        <h5 className="font-semibold leading-tight">{title}</h5>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{desc}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[var(--brand)] text-xl font-extrabold">{price}</span>

          <Link
            to="/order-online"
            className="inline-flex items-center rounded-[12px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(249,115,22,0.35)] hover:brightness-95 active:translate-y-px"
          >
            Add Basket
          </Link>
        </div>
      </div>
    </div>
  );
}
