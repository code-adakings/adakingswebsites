import { ShieldCheck, Award, Cpu, Headset, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { FranchiseAdvantageCard } from "@/types/sanity";

const ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  award: Award,
  cpu: Cpu,
  headset: Headset,
};

export function FranchiseAdvantages({
  eyebrow,
  heading,
  cards,
}: {
  eyebrow?: string;
  heading?: string;
  cards?: FranchiseAdvantageCard[];
}) {
  if (!cards?.length) return null;

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon, title, description }) => {
            const Icon = ICONS[icon] ?? ShieldCheck;
            return (
              <div key={title} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
