import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";

export function FranchiseIdealPartners({
  eyebrow,
  heading,
  description,
  bullets,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  bullets?: string[];
}) {
  if (!bullets?.length) return null;

  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} description={description} align="center" className="mx-auto" />
        <ul className="mt-10 space-y-4">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="text-base text-foreground/90 text-pretty">{bullet}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
