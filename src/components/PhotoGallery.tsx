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
          <img
            src={img.src}
            alt={img.alt ?? ""}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading={i < 2 ? "eager" : "lazy"}
          />
        </figure>
      ))}
    </div>
  );
}
