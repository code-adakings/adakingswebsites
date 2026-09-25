import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import { getFranchisePage } from "@/lib/franchise";

export async function Franchise() {
  const { image, whyFranchise, homeCta } = await getFranchisePage();

  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <SanityImage
          image={image}
          fallbackLabel="Adakings franchise partners"
          className="aspect-4/3"
        />
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {whyFranchise.eyebrow || "Franchise"}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {whyFranchise.heading}
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty sm:text-lg">
            {whyFranchise.description}
          </p>
          <Button variant="outline" render={<a href={homeCta.cta?.href ?? "/franchise"} />} className="mt-6">
            {homeCta.cta?.label ?? "Explore Franchising"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
