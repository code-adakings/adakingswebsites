import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function OurStory() {
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <PlaceholderImage label="Our founders, early days" className="aspect-4/3 lg:order-2" />
        <div className="lg:order-1">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Built from one kitchen, one community at a time
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty sm:text-lg">
            Adakings began with a simple belief: Ghanaian food deserves a fast-food
            experience that matches its flavor. What started as one restaurant has
            grown into a family of branches — without ever losing the recipe for
            what made us who we are.
          </p>
          <Button variant="outline" render={<a href="/our-story" />} className="mt-6">
            Read Our Full Story
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
