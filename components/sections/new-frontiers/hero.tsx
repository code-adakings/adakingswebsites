"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/ui/sanity-image";
import { Reveal } from "@/components/motion/reveal";
import type { PrivateLandingMetric, SanityImage as SanityImageValue } from "@/types/sanity";

export function NewFrontiersHero({
  eyebrow,
  heading,
  subheading,
  description,
  primaryCtaLabel,
  secondaryCtaLabel,
  heroImage,
  metrics = [],
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  description?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  heroImage?: SanityImageValue;
  metrics?: PrivateLandingMetric[];
}) {
  return (
    <section className="relative overflow-hidden bg-background">
      <Container className="relative py-14 sm:py-24 lg:py-32">
        <Reveal>
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:mt-6 sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          {subheading ? (
            <p className="mt-5 max-w-3xl text-xl font-medium text-balance text-foreground/80 sm:mt-8 sm:text-3xl lg:text-4xl">
              {subheading}
            </p>
          ) : null}
          {description ? (
            <p className="mt-4 max-w-2xl text-base text-muted-foreground text-pretty sm:mt-6 sm:text-lg">
              {description}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-10">
            {primaryCtaLabel ? (
              <Button
                size="lg"
                render={<a href="#apply" />}
                className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
              >
                {primaryCtaLabel}
              </Button>
            ) : null}
            {secondaryCtaLabel ? (
              <Button
                size="lg"
                variant="outline"
                render={<a href="#letter" />}
                className="h-11 px-6 text-base"
              >
                {secondaryCtaLabel}
              </Button>
            ) : null}
          </div>
        </Reveal>

        {heroImage?.asset ? (
          <Reveal delay={0.1} className="mt-10 sm:mt-16">
            <SanityImage
              image={heroImage}
              fallbackLabel={heading}
              className="aspect-video w-full"
              sizes="(min-width: 1280px) 1200px, 100vw"
              priority
            />
          </Reveal>
        ) : null}

        {metrics.length > 0 ? (
          <Reveal
            delay={0.15}
            className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:mt-16 sm:grid-cols-3 sm:gap-8 sm:pt-10"
          >
            {metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{metric.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
