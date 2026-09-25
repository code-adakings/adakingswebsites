import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { WhyAdakings } from "@/components/sections/home/why-adakings";
import { CommunityImpact } from "@/components/sections/home/community-impact";
import { Team } from "@/components/sections/about/team";
import { getAboutPage } from "@/lib/about";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION =
  "Adakings is a premium Ghanaian black-owned fast food and hospitality company, built on bold flavor and community pride.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutPage();
  return buildMetadata({
    path: "/about",
    title: "About",
    description: FALLBACK_DESCRIPTION,
    seo,
    hasOwnOgImage: true,
  });
}

export default async function AboutPage() {
  const { hero, mission, teamSection } = await getAboutPage();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
      <Section>
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow={mission.eyebrow}
            title={mission.heading ?? ""}
            description={mission.description}
          />
        </Container>
      </Section>
      <WhyAdakings />
      <Team eyebrow={teamSection?.eyebrow} heading={teamSection?.heading} />
      <CommunityImpact />
    </>
  );
}
