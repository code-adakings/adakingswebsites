import Image from "next/image";
import { cn } from "cn";
import { urlFor } from "@/sanity/lib/image";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import type { SanityImage as SanityImageValue } from "@/types/sanity";

/**
 * Renders a real Sanity image when one is set, falling back to the branded
 * placeholder otherwise — keeps every aspect-ratio/layout slot in the UI
 * unchanged whether or not an editor has uploaded a photo yet.
 */
export function SanityImage({
  image,
  alt,
  fallbackLabel,
  className,
  sizes = "100vw",
  priority,
}: {
  image?: SanityImageValue | null;
  alt?: string;
  fallbackLabel: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image?.asset) {
    return <PlaceholderImage label={fallbackLabel} className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-muted", className)}>
      <Image
        src={urlFor(image).url()}
        alt={alt || image.alt || fallbackLabel}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
