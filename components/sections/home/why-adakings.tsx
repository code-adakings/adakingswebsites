import { Flame, Leaf, HandHeart, Timer } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";

const reasons = [
  {
    icon: Flame,
    title: "Bold, authentic flavor",
    description: "Recipes rooted in Ghanaian tradition, perfected over years.",
  },
  {
    icon: Leaf,
    title: "Fresh, every day",
    description: "No shortcuts — ingredients sourced and prepared daily.",
  },
  {
    icon: Timer,
    title: "Fast without compromise",
    description: "Quick service that never sacrifices quality or care.",
  },
  {
    icon: HandHeart,
    title: "Community-first",
    description: "Black-owned and proud, reinvesting in the communities we serve.",
  },
];

export function WhyAdakings() {
  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading
          eyebrow="Why Adakings"
          title="Food made with pride, served with purpose"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
