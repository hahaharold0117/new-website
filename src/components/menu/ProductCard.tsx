import Image from "next/image";

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
    return (
        <div className="h-36 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
                <div className="flex-1">
                    <h5 className="font-semibold leading-tight">{title}</h5>
                    <div className="mt-1 font-bold text-brand">£{price.toFixed(2)}</div>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{desc}</p>
                </div>

                <div className="flex w-28 shrink-0 flex-col items-end justify-between">
                    <Image
                        src={img}
                        alt={title}
                        width={160}
                        height={160}
                        className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white hover:opacity-90">
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
