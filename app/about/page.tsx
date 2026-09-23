import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { WhyAdakings } from "@/components/sections/home/why-adakings";
import { CommunityImpact } from "@/components/sections/home/community-impact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Adakings is a premium Ghanaian black-owned fast food and hospitality company, built on bold flavor and community pride.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Adakings"
        title="Ghanaian pride, on every plate"
        description="We're a black-owned fast food and hospitality company built to bring bold, authentic Ghanaian flavor to more communities — without compromise."
      />
      <Section>
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Our Mission"
            title="Serving food that makes Ghana proud"
            description="Every branch, every recipe, and every hire is guided by one standard: would we be proud to serve this to our own family? That's the bar we hold ourselves to."
          />
        </Container>
      </Section>
      <WhyAdakings />
      <CommunityImpact />
    </>
  );
}
