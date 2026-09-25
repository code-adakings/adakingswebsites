import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import type { CtaLink, SanityImage as SanityImageValue } from "@/types/sanity";

export function FranchiseHero({
  eyebrow,
  title,
  description,
  heroImage,
  primaryCta,
  secondaryCta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  heroImage?: SanityImageValue;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--color-brand-red)_35%,transparent),transparent_55%)]" />
      <Container className="relative grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-28">
        <div>
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-brand-gold uppercase">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:mt-6 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-lg text-lg text-white/70 text-pretty sm:mt-6">{description}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
            {primaryCta ? (
              <Button
                size="lg"
                render={<a href={primaryCta.href} />}
                className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
              >
                {primaryCta.label}
                <ArrowRight className="size-4" />
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button
                size="lg"
                variant="outline"
                render={<a href={secondaryCta.href} />}
                className="h-11 border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>

        <SanityImage
          image={heroImage}
          fallbackLabel="Adakings franchise storefront"
          className="aspect-4/3 w-full sm:aspect-4/5 lg:aspect-square"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </Container>
    </section>
  );
}
