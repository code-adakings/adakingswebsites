import { ImageIcon } from "lucide-react";
import { cn } from "cn";

/**
 * Branded placeholder for photography that hasn't been shot/sourced yet.
 * Swap for a real <Image> once authentic photography is available.
 */
export function PlaceholderImage({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-brand-black via-brand-black to-brand-red/40",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--color-brand-gold)_25%,transparent),transparent_60%)]" />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center text-white/70">
        <ImageIcon className="size-6" />
        <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
      </div>
    </div>
  );
}
