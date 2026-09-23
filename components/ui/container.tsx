import { cn } from "cn";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-(--container-page) px-6 lg:px-8", className)}
      {...props}
    />
  );
}
