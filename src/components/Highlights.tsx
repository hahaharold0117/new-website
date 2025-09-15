// src/components/Highlights.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

type Item = {
  id: string;
  title: string;
  desc: string;
  price: string;
  img: string;
};

const items: Item[] = [
  { id: "ck-flatbread", title: "Chicken Kebab Flatbread", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-1.png" },
  { id: "mqb-a", title: "Mediterranean Quinoa Bowl", desc: "Healthy grains, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-2.png" },
  { id: "mqb-b-1", title: "Mediterranean Quinoa Bowl", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-3.png" },
  { id: "mqb-c-1", title: "Mediterranean Quinoa Bowl", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-3.png" },
  { id: "mqb-b-2", title: "Mediterranean Quinoa Bowl", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-3.png" },
  { id: "mqb-c-2", title: "Mediterranean Quinoa Bowl", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-3.png" },
  { id: "mqb-b-3", title: "Mediterranean Quinoa Bowl", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-3.png" },
  { id: "mqb-c-3", title: "Mediterranean Quinoa Bowl", desc: "Juicy chicken, fresh vegetables, and our signature sauce wrapped in...", price: "£8.99", img: "/images/dish-3.png" },
];

export default function Highlights() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Responsive slides per view with Tailwind basis classes:
  // mobile: 1, md: 2, lg+: 3
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      dragFree: false,
      slidesToScroll: 1,
      skipSnaps: false,
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section aria-labelledby="highlights-heading" className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={scrollPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-soft transition hover:bg-neutral-50 disabled:opacity-40"
            disabled={emblaApi ? !emblaApi.canScrollPrev() : false}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={scrollNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-soft transition hover:bg-neutral-50 disabled:opacity-40"
            disabled={emblaApi ? !emblaApi.canScrollNext() : false}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Embla container */}
        <div className="flex gap-6">
          {items.map(({ id, ...props }) => (
            // Embla slide
            <div
              key={id}
              className="
                embla__slide
                flex-none
                w-[85%]
                sm:w-[70%]
                md:w-[48%]
                lg:w-[32%]
              "
            >
              <ProductCard {...props} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${i === selectedIndex
              ? "bg-neutral-900"
              : "bg-neutral-300 hover:bg-neutral-400"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
