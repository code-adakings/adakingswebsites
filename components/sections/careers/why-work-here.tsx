import { TrendingUp, Users, HeartHandshake, GraduationCap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { CareersWhyCard } from "@/types/sanity";

const ICONS: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  users: Users,
  "heart-handshake": HeartHandshake,
  "graduation-cap": GraduationCap,
};

export function WhyWorkHere({
  eyebrow,
  heading,
  description,
  cards,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  cards?: CareersWhyCard[];
}) {
  if (!cards?.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading ?? ""} description={description} align="center" className="mx-auto" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon, title, description }) => {
            const Icon = ICONS[icon] ?? TrendingUp;
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
