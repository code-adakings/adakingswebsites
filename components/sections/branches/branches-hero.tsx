import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import type { CtaLink, SanityImage as SanityImageValue } from "@/types/sanity";

export function BranchesHero({
  eyebrow,
  title,
  description,
  heroImage,
  cta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  heroImage?: SanityImageValue;
  cta?: CtaLink;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-0">
        <SanityImage
          image={heroImage}
          fallbackLabel="Adakings branch storefront"
          className="h-full w-full rounded-none"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-brand-black/20" />
      <Container className="relative py-24 sm:py-32">
        {eyebrow ? (
          <p className="text-sm font-semibold tracking-wide text-brand-gold uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-white/70 text-pretty">{description}</p>
        ) : null}
        {cta ? (
          <Button
            size="lg"
            render={<a href={cta.href} />}
            className="mt-8 h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
          >
            {cta.label}
            <ArrowRight className="size-4" />
          </Button>
        ) : null}
      </Container>
    </section>
  );
}
