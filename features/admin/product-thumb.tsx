import Image from "next/image";

/** Small product picture for admin tables. Decorative: the product name always sits next to it. */
export function ProductThumb({ src }: { src: string }) {
  return (
    <Image src={src} alt="" width={56} height={56} className="size-14 shrink-0 rounded-md border border-border bg-surface object-cover" />
  );
}
