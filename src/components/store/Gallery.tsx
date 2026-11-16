import { useState } from "react";

import { optimizedImage } from "@/lib/image";

type Props = {
  images: string[];
  alt: string;
};

function imageSrc(src: string, width: number): string {
  return src.startsWith("https://") ? optimizedImage(src, width) ?? src : src;
}

export default function Gallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden">
        <img src={imageSrc(current, 1000)} alt={alt} className="store-media" />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-pressed={index === active}
              aria-label={`Ver imagen: ${alt}`}
              onClick={() => setActive(index)}
              className={[
                "size-16 overflow-hidden rounded-lg border-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                index === active ? "border-ring" : "border-transparent",
              ].join(" ")}
            >
              <img src={imageSrc(image, 300)} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
