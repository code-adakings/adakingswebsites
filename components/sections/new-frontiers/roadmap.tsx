import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import type { PrivateLandingPhase } from "@/types/sanity";

export function NewFrontiersRoadmap({
  heading,
  phases = [],
  caption,
}: {
  heading?: string;
  phases?: PrivateLandingPhase[];
  caption?: string;
}) {
  if (phases.length === 0) return null;

  return (
    <Section>
      <Container>
        {heading ? (
          <Reveal>
            <SectionHeading title={heading} align="center" className="max-w-2xl" />
          </Reveal>
        ) : null}

        <Reveal
          delay={0.1}
          className="mt-10 flex flex-col items-stretch gap-4 sm:mt-16 sm:flex-row sm:items-center sm:justify-center"
        >
          {phases.map((phase, index) => (
            <div key={phase.label} className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:w-80 sm:p-8">
                {phase.status ? (
                  <Badge variant={phase.isCurrent ? "default" : "outline"} className="h-6 px-2.5">
                    {phase.status}
                  </Badge>
                ) : null}
                <p className="mt-5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {phase.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{phase.amount}</p>
                {phase.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{phase.description}</p>
                ) : null}
              </div>
              {index < phases.length - 1 ? (
                <ArrowRight
                  className="mx-auto size-6 shrink-0 rotate-90 text-muted-foreground sm:mx-0 sm:rotate-0"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </Reveal>

        {caption ? (
          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-sm text-muted-foreground italic sm:mt-12">{caption}</p>
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
