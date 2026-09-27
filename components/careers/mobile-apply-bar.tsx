"use client";

import * as React from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

/**
 * Sticky bottom Apply bar for small screens. Hides itself once the
 * application form (`#apply`) is on screen so it never covers the form.
 */
export function MobileApplyBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [formVisible, setFormVisible] = React.useState(false);

  React.useEffect(() => {
    const target = document.getElementById("apply");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={formVisible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-4px_16px_rgb(0_0_0/0.06)] backdrop-blur transition-transform duration-200 supports-backdrop-filter:bg-background/80 lg:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        formVisible && "pointer-events-none translate-y-full",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        <Button
          render={<a href="#apply" tabIndex={formVisible ? -1 : undefined} />}
          className="h-10 shrink-0 bg-primary px-5 text-primary-foreground hover:bg-brand-red-dark"
        >
          Apply now
        </Button>
      </div>
    </div>
  );
}
