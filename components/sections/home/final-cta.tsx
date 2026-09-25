"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import type { CtaLink } from "@/types/sanity";

export function FinalCta({
  heading = "Hungry? Let's fix that.",
  description = "Order your favorite Adakings meal now, or find a branch near you.",
  primaryCta = { label: "Order Food", href: siteConfig.orderUrl },
  secondaryCta = { label: "Find a Branch", href: "/branches" },
  primaryCtaEvent = "order_click",
}: {
  heading?: string;
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  primaryCtaEvent?: AnalyticsEventName | null;
}) {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <Container className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80 text-pretty">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            render={<a href={primaryCta.href} target="_blank" rel="noopener noreferrer" />}
            onClick={
              primaryCtaEvent ? () => trackEvent(primaryCtaEvent, { location: "final_cta" }) : undefined
            }
            className="h-11 bg-white px-6 text-base text-brand-black hover:bg-white/90"
          >
            {primaryCta.label}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href={secondaryCta.href} />}
            className="h-11 border-white/40 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
          >
            {secondaryCta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
