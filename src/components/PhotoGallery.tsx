import Image from "next/image";

type GalleryImage = { src: string; alt?: string };
export default function PhotoGallery({
  images,
  className = "",
}: {
  images: GalleryImage[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 ${className}`}>
      {images.map((img, i) => (
        <figure key={i} className="relative aspect-[4/3] overflow-hidden rounded-md">
          <Image
            src={img.src}
            alt={img.alt ?? ""}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={i < 2}
          />
        </figure>
      ))}
    </div>
  );
}
