"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  name: string;
  images: readonly string[];
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={current}
          alt={images.length > 1 ? `${name}, image ${selected + 1} of ${images.length}` : name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2" aria-label="Product images">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === selected}
                className={`relative block aspect-square w-full overflow-hidden rounded-md border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  index === selected ? "border-accent" : "border-border"
                }`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
