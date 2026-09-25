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
      <Container className="relative py-24 sm:py-28 lg:py-32">
        <Reveal>
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          {subheading ? (
            <p className="mt-8 max-w-3xl text-2xl font-medium text-balance text-foreground/80 sm:text-3xl lg:text-4xl">
              {subheading}
            </p>
          ) : null}
          {description ? (
            <p className="mt-6 max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">
              {description}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center gap-4">
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
          <Reveal delay={0.1} className="mt-16">
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
            className="mt-16 grid grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-3"
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
