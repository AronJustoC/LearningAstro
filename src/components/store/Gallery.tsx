import { useState } from "react";

import type { ProductImage } from "@/data/catalog";

type Props = {
  images: ProductImage[];
};

export default function Gallery({ images }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl bg-muted">
        <img
          src={current.src}
          alt={current.alt}
          className="aspect-square w-full object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-pressed={index === active}
              aria-label={`Ver imagen: ${image.alt}`}
              onClick={() => setActive(index)}
              className={[
                "size-16 overflow-hidden rounded-lg border-2 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                index === active ? "border-ring" : "border-transparent",
              ].join(" ")}
            >
              <img src={image.src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}