import { Flame, Leaf, HandHeart, Timer, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { getWhyAdakings } from "@/lib/why-adakings";

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  leaf: Leaf,
  timer: Timer,
  heart: HandHeart,
};

export async function WhyAdakings() {
  const { eyebrow, heading, reasons } = await getWhyAdakings();

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} align="center" className="mx-auto" />
        <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-4">
          {reasons.map(({ icon, title, description }) => {
            const Icon = ICONS[icon] ?? Flame;
            return (
              <div key={title} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
