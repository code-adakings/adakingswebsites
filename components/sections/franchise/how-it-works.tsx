import { FileText, Users, GraduationCap, Rocket, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { FranchiseProcessStep } from "@/types/sanity";

const ICONS: Record<string, LucideIcon> = {
  "file-text": FileText,
  users: Users,
  "graduation-cap": GraduationCap,
  rocket: Rocket,
};

export function FranchiseHowItWorks({
  eyebrow,
  heading,
  steps,
}: {
  eyebrow?: string;
  heading?: string;
  steps?: FranchiseProcessStep[];
}) {
  if (!steps?.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon, title, description }, index) => {
            const Icon = ICONS[icon] ?? FileText;
            return (
              <div key={title} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <p className="mt-4 text-xs font-semibold tracking-wide text-primary uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold">{title}</h3>
                {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
