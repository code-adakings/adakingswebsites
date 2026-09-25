import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

const PHASES = [
  {
    label: "Phase 1",
    amount: "GHS 70,000",
    description: "4 Month Cash Flow Facility",
    status: "Current Round",
    statusVariant: "default" as const,
  },
  {
    label: "Phase 2",
    amount: "GHS 200,000",
    description: "Growth & Infrastructure Expansion",
    status: "Coming Next",
    statusVariant: "outline" as const,
  },
];

export function NewFrontiersRoadmap() {
  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading
            title="A Two-Phase Expansion Strategy"
            align="center"
            className="max-w-2xl"
          />
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-16 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center"
        >
          {PHASES.map((phase, index) => (
            <div key={phase.label} className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 sm:w-80">
                <Badge variant={phase.statusVariant} className="h-6 px-2.5">
                  {phase.status}
                </Badge>
                <p className="mt-5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {phase.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{phase.amount}</p>
                <p className="mt-2 text-sm text-muted-foreground">{phase.description}</p>
              </div>
              {index < PHASES.length - 1 ? (
                <ArrowRight
                  className="mx-auto size-6 shrink-0 rotate-90 text-muted-foreground sm:mx-0 sm:rotate-0"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-sm text-muted-foreground italic">
            Phase One builds stability. Phase Two accelerates scale.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
