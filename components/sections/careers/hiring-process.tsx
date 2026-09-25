import { FileText, PhoneCall, Users, ClipboardCheck, Rocket, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { CareersProcessStep } from "@/types/sanity";

const ICONS: Record<string, LucideIcon> = {
  "file-text": FileText,
  "phone-call": PhoneCall,
  users: Users,
  "clipboard-check": ClipboardCheck,
  rocket: Rocket,
};

export function HiringProcess({
  eyebrow,
  heading,
  steps,
}: {
  eyebrow?: string;
  heading?: string;
  steps?: CareersProcessStep[];
}) {
  if (!steps?.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} align="center" className="mx-auto" />
        <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-5">
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
