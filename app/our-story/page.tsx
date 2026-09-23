import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Adakings grew from one kitchen into a family of restaurants across Ghana.",
};

const milestones = [
  {
    year: "Year One",
    title: "One kitchen, one belief",
    description:
      "Adakings opened its first location with a simple promise: Ghanaian food, done right, served fast.",
  },
  {
    year: "Growth",
    title: "A second branch, then a third",
    description:
      "Word spread. Customers kept coming back, and Adakings grew into new neighborhoods.",
  },
  {
    year: "Today",
    title: "A family of branches",
    description:
      "Now serving communities across Ghana, with franchise partners bringing Adakings even further.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="From one kitchen to a movement"
        description="The story of Adakings is the story of the people who believed in it first — our founders, our team, and our customers."
      />
      <Section>
        <Container className="max-w-3xl space-y-12">
          {milestones.map((milestone) => (
            <div key={milestone.title} className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <span className="text-sm font-semibold tracking-wide text-primary uppercase">
                {milestone.year}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{milestone.title}</h3>
                <p className="mt-2 text-muted-foreground">{milestone.description}</p>
              </div>
            </div>
          ))}
        </Container>
      </Section>
      <Section className="pt-0">
        <Container>
          <PlaceholderImage label="Adakings through the years" className="aspect-video" />
        </Container>
      </Section>
    </>
  );
}
