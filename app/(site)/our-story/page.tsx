import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/hero";
import { FoundersLetter } from "@/components/sections/about/founders-letter";
import { Team } from "@/components/sections/about/team";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import { FinalCta } from "@/components/sections/home/final-cta";
import { getOurStoryPage } from "@/lib/our-story";
import { getAboutPage } from "@/lib/about";
import { getFounder } from "@/lib/team";
import { getSiteSettings } from "@/lib/site-settings";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION = "How Adakings grew from one kitchen into a family of restaurants across Ghana.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, image } = await getOurStoryPage();
  return buildMetadata({ path: "/our-story", title: "Our Story", description: FALLBACK_DESCRIPTION, seo, image });
}

export default async function OurStoryPage() {
  const [{ hero, image, milestones }, { mission }, founder, siteSettings] = await Promise.all([
    getOurStoryPage(),
    getAboutPage(),
    getFounder(),
    getSiteSettings(),
  ]);

  const [beginning, turningPoint, building] = milestones;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Our Story", path: "/our-story" },
        ])}
      />
      {/* 1. Hero */}
      <Hero eyebrow={hero.eyebrow} heading={hero.title} subheading={hero.description} backgroundImage={image} />

      {/* 2. Founder's Letter */}
      <FoundersLetter
        founder={founder}
        fallbackRole={mission.eyebrow || "Our Mission"}
        fallbackBody={mission.description || ""}
      />

      {/* 3. The Beginning */}
      {beginning ? (
        <Section className="bg-muted/40">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow={beginning.year}
              title={beginning.title}
              description={beginning.description}
              align="center"
              className="mx-auto"
            />
          </Container>
        </Section>
      ) : null}

      {/* 4. The Turning Point */}
      {turningPoint ? (
        <Section>
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow={turningPoint.year}
              title={turningPoint.title}
              description={turningPoint.description}
              align="center"
              className="mx-auto"
            />
          </Container>
        </Section>
      ) : null}

      {/* 5. Building Adakings */}
      {building ? (
        <Section className="bg-muted/40">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow={building.year}
              title={building.title}
              description={building.description}
              align="center"
              className="mx-auto"
            />
          </Container>
        </Section>
      ) : null}
      <Team eyebrow="Our Team" heading="The people building Adakings" />

      {/* Full-width photography breaker between the history chapters and what comes next */}
      <SanityImage
        image={image}
        fallbackLabel="Adakings through the years"
        className="aspect-21/9 w-full rounded-none"
        sizes="100vw"
      />

      {/* 6. Our Values */}
      <Section>
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow={mission.eyebrow}
            title={mission.heading ?? ""}
            description={mission.description}
            align="center"
            className="mx-auto"
          />
        </Container>
      </Section>

      {/* 7. Vision 2030 */}
      <section className="bg-brand-black py-20 text-white sm:py-28">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-gold uppercase">
            Vision 2030
          </p>
          <p className="mt-6 text-2xl leading-relaxed font-medium text-balance sm:text-3xl">
            {siteSettings.longDescription}
          </p>
        </Container>
      </section>

      {/* 8. Final CTA */}
      <FinalCta />
    </>
  );
}
