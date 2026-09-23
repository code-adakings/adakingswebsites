import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

export function Logo({
  variant = "dark",
  className,
}: {
  /** "dark" = wordmark text for light backgrounds, "light" = for dark backgrounds */
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Adakings home"
      className={cn("flex items-center gap-2.5 shrink-0", className)}
    >
      <Image
        src="/brand/adakings-logo-icon.png"
        alt=""
        width={36}
        height={36}
        priority
        className="h-8 w-8 sm:h-9 sm:w-9"
      />
      <span
        className={cn(
          "font-bold tracking-tight text-lg sm:text-xl",
          variant === "dark" ? "text-brand-black" : "text-white",
        )}
      >
        Adakings
      </span>
    </Link>
  );
}
