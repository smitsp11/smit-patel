import Image from "next/image";

interface Photo {
  src: string;
  alt: string;
  caption: string;
}

interface PhotoStripProps {
  photos: Photo[];
}

export function PhotoStrip({ photos }: PhotoStripProps) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-1 md:mx-0 md:overflow-visible md:px-0">
      <div className="flex snap-x snap-mandatory gap-3 md:grid md:grid-cols-3 md:snap-none">
        {photos.map((photo) => (
          <figure key={photo.src} className="w-[70%] shrink-0 snap-start md:w-auto">
            <div className="relative h-[120px] overflow-hidden rounded-sm">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 70vw, 200px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-xs text-text-muted">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
