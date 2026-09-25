"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

const METRICS = [
  { value: "GHS 70,000", label: "Facility" },
  { value: "4 Months", label: "Term" },
  { value: "17.5%", label: "Fixed Return (negotiable)" },
];

export function NewFrontiersHero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <Container className="relative py-24 sm:py-28 lg:py-32">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Private Lending Round · Phase 1
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Operation New Frontiers
          </h1>
          <p className="mt-8 max-w-3xl text-2xl font-medium text-balance text-foreground/80 sm:text-3xl lg:text-4xl">
            We&rsquo;re raising GHS 70,000 to fund the next four months of Adakings&rsquo; growth.
          </p>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">
            A private semester lending facility created exclusively for existing franchise
            partners, close friends, and trusted supporters of Adakings Foods &amp; Beverages
            Company.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              render={<a href="#apply" />}
              className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
            >
              Request Lending Agreement
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#letter" />}
              className="h-11 px-6 text-base"
            >
              Read the Founder&rsquo;s Letter
            </Button>
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-16 grid grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-3"
        >
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{metric.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
