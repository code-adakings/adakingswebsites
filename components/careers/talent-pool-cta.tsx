import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TrackClick } from "@/components/analytics/track-click";
import type { CtaLink } from "@/types/sanity";

export function TalentPoolCta({
  heading,
  description,
  cta,
}: {
  heading?: string;
  description?: string;
  cta: CtaLink;
}) {
  return (
    <section id="talent-pool" className="scroll-mt-16 bg-primary py-12 text-primary-foreground sm:py-16 md:py-24">
      <Container className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{heading}</h2>
        {description ? (
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80 text-pretty sm:mt-4">{description}</p>
        ) : null}
        <TrackClick event="career_apply" params={{ method: "talent_pool" }}>
          <Button
            size="lg"
            render={<a href={cta.href} />}
            className="mt-6 h-11 bg-white px-6 text-base text-brand-black hover:bg-white/90 sm:mt-8"
          >
            {cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </TrackClick>
      </Container>
    </section>
  );
}
