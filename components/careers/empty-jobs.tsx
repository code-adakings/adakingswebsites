import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyJobs({
  title = "No open roles right now",
  description = "We're not actively hiring for a specific role at the moment, but we're always happy to meet great people.",
  cta = { label: "Join the talent pool", href: "#talent-pool" },
}: {
  title?: string;
  description?: string;
  cta?: { label: string; href: string } | null;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <SearchX className="size-6" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground text-pretty">{description}</p>
      {cta ? (
        <Button variant="outline" render={<a href={cta.href} />} className="mt-6">
          {cta.label}
        </Button>
      ) : null}
    </div>
  );
}
