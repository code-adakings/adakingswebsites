import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export const metadata: Metadata = {
  title: "Catering",
  description: "Adakings catering for corporate events, weddings, and celebrations across Ghana.",
};

const highlights = [
  "Custom menus for any event size",
  "Corporate lunches and office catering",
  "Weddings, parties, and celebrations",
  "Delivery and on-site setup available",
];

export default function CateringPage() {
  return (
    <>
      <PageHero
        eyebrow="Catering"
        title="Adakings for your next event"
        description="From office lunches to weddings, let us bring bold Ghanaian flavor to your celebration."
      />
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">What we offer</h2>
            <ul className="mt-6 space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button
              render={<a href="/contact" />}
              className="mt-8 bg-primary text-primary-foreground hover:bg-brand-red-dark"
            >
              Request a Catering Quote
            </Button>
          </div>
          <PlaceholderImage label="Catering spread" className="aspect-4/3" />
        </Container>
      </Section>
    </>
  );
}
