import { cn } from "cn";

/**
 * Horizontal snap-scroll rail on mobile; reverts to a plain grid at `sm+`.
 * Pass the target grid via className, e.g. `sm:grid-cols-3 sm:gap-8`.
 */
export function ScrollRail({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-1 scrollbar-hide sm:mx-0 sm:grid sm:snap-none sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0",
        className,
      )}
      {...props}
    />
  );
}

export function ScrollRailItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-[78%] shrink-0 snap-start sm:w-auto sm:shrink", className)}
      {...props}
    />
  );
}
