import { Hero } from "@/components/sections/home/hero";
import { TrustMetrics } from "@/components/sections/home/trust-metrics";
import { SignatureMeals } from "@/components/sections/home/signature-meals";
import { WhyAdakings } from "@/components/sections/home/why-adakings";
import { CareersCta } from "@/components/sections/home/careers-cta";
import { OurStory } from "@/components/sections/home/our-story";
import { BranchesPreview } from "@/components/sections/home/branches-preview";
import { HowOrderingWorks } from "@/components/sections/home/how-ordering-works";
import { Testimonials } from "@/components/sections/home/testimonials";
import { FranchiseCatering } from "@/components/sections/home/franchise-catering";
import { CommunityImpact } from "@/components/sections/home/community-impact";
import { FinalCta } from "@/components/sections/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustMetrics />
      <SignatureMeals />
      <WhyAdakings />
      <CareersCta />
      <OurStory />
      <BranchesPreview />
      <HowOrderingWorks />
      <Testimonials />
      <FranchiseCatering />
      <CommunityImpact />
      <FinalCta />
    </>
  );
}
