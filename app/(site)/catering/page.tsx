import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import { TrackClick } from "@/components/analytics/track-click";
import { getCateringPage } from "@/lib/catering";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION = "Adakings catering for corporate events, weddings, and celebrations across Ghana.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, image } = await getCateringPage();
  return buildMetadata({ path: "/catering", title: "Catering", description: FALLBACK_DESCRIPTION, seo, image });
}

export default async function CateringPage() {
  const { hero, highlights, image, cta } = await getCateringPage();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Catering", path: "/catering" },
        ])}
      />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
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
            <TrackClick event="catering_quote" params={{ location: "catering_page" }}>
              <Button
                render={<a href={cta.href} />}
                className="mt-8 bg-primary text-primary-foreground hover:bg-brand-red-dark"
              >
                {cta.label}
              </Button>
            </TrackClick>
          </div>
          <SanityImage image={image} fallbackLabel="Catering spread" className="aspect-4/3" />
        </Container>
      </Section>
    </>
  );
}
