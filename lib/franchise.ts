import { sanityFetch } from "@/sanity/lib/fetch";
import { franchisePageQuery } from "@/sanity/lib/queries";
import type { SanityFranchisePage, Seo } from "@/types/sanity";

const FRANCHISE_PAGE_TAG = "franchisePage";

const FALLBACK_HERO: NonNullable<SanityFranchisePage["hero"]> = {
  eyebrow: "Franchise",
  title: "Bring Adakings to your community",
  description:
    "Join a growing network of franchise partners building something that lasts — backed by our proven operating system, brand, and hands-on support.",
  primaryCta: { label: "Start Your Enquiry", href: "#enquiry" },
  secondaryCta: { label: "Download Prospectus", href: "#prospectus" },
};

const FALLBACK_WHY_FRANCHISE: NonNullable<SanityFranchisePage["whyFranchise"]> = {
  eyebrow: "Why Franchise With Us",
  heading: "A proven system, built for growth",
  description:
    "Every franchise partner gets our recipes, operations playbook, and hands-on training — so a new branch opens with the standard our customers already trust.",
};

const FALLBACK_HOME_CTA: NonNullable<SanityFranchisePage["homeCta"]> = {
  heading: "Own an Adakings in your community",
  description: "Join our growing network of franchise partners and bring Adakings to your city.",
  cta: { label: "Explore Franchising", href: "/franchise" },
};

const FALLBACK_FOUNDER_VISION: NonNullable<SanityFranchisePage["founderVision"]> = {
  eyebrow: "Founder's Vision",
  heading: "Building a legacy, one branch at a time",
  body:
    "We didn't set out to build a chain — we set out to build a standard. Every franchise partner we bring on shares that same commitment to quality, community, and consistency. When you open an Adakings, you're not just opening a restaurant; you're carrying that standard into your neighborhood.",
};

const FALLBACK_ADVANTAGES: NonNullable<SanityFranchisePage["advantages"]> = {
  eyebrow: "Why Adakings",
  heading: "Everything you need to run a great branch",
  cards: [
    { icon: "shield-check", title: "Proven operating systems", description: "Recipes, workflows, and standards refined across every branch we run." },
    { icon: "award", title: "Strong campus brand", description: "A name customers already know, love, and recommend." },
    { icon: "cpu", title: "Technology-enabled operations", description: "Ordering, inventory, and reporting tools built for modern fast food." },
    { icon: "headset", title: "Ongoing support", description: "A dedicated team behind you from launch day onward." },
  ],
};

const FALLBACK_HOW_IT_WORKS: NonNullable<SanityFranchisePage["howItWorks"]> = {
  eyebrow: "The Process",
  heading: "How franchising works",
  steps: [
    { icon: "file-text", title: "Apply", description: "Tell us about you and your target market." },
    { icon: "users", title: "Meet the team", description: "We review your application and discuss the model together." },
    { icon: "graduation-cap", title: "Training & setup", description: "Hands-on training on operations, recipes, and standards." },
    { icon: "rocket", title: "Launch", description: "Open your branch with our full support behind you." },
  ],
};

const FALLBACK_TRAINING_SUPPORT: NonNullable<SanityFranchisePage["trainingSupport"]> = {
  eyebrow: "Training & Support",
  heading: "You're never running it alone",
  columns: [
    { title: "Operations", description: "Kitchen systems, inventory, and day-to-day standard operating procedures." },
    { title: "Marketing", description: "Local launch playbooks, brand assets, and ongoing campaign support." },
    { title: "Technology", description: "Point-of-sale, ordering, and reporting tools set up and supported for you." },
  ],
};

const FALLBACK_IDEAL_PARTNERS: NonNullable<SanityFranchisePage["idealPartners"]> = {
  eyebrow: "Ideal Partners",
  heading: "Who we're looking for",
  description: "We partner with people who share our standard for quality and community.",
  bullets: [
    "Hands-on operators who want to be present in their business",
    "A genuine passion for food, service, and community",
    "Financial readiness to invest in a first branch",
    "A long-term commitment to the Adakings standard",
  ],
};

const FALLBACK_FAQ: NonNullable<SanityFranchisePage["faq"]> = {
  eyebrow: "FAQ",
  heading: "Common questions",
  items: [
    { question: "How long does the franchise process take?", answer: "Most partners move from application to launch within a few months, depending on site readiness." },
    { question: "Do I need prior restaurant experience?", answer: "No — our training program covers everything you need, though operational experience is a plus." },
    { question: "What support do I get after launch?", answer: "Ongoing operations, marketing, and technology support from our dedicated franchise team." },
  ],
};

const FALLBACK_ENQUIRY: NonNullable<SanityFranchisePage["enquiry"]> = {
  heading: "Start your franchise enquiry",
  description: "Tell us about yourself and your market — our franchise team will follow up within a few business days.",
};

const FALLBACK_PROSPECTUS: NonNullable<SanityFranchisePage["prospectus"]> = {
  heading: "Ready to bring Adakings to your city?",
  description: "Download our prospectus for the full overview, or speak with our franchise team directly.",
  primaryCtaLabel: "Download Prospectus",
  secondaryCta: { label: "Speak with Our Team", href: "/contact" },
};

export async function getFranchisePage(): Promise<{
  hero: NonNullable<SanityFranchisePage["hero"]>;
  image?: SanityFranchisePage["image"];
  whyFranchise: NonNullable<SanityFranchisePage["whyFranchise"]>;
  founderVision: NonNullable<SanityFranchisePage["founderVision"]>;
  advantages: NonNullable<SanityFranchisePage["advantages"]>;
  howItWorks: NonNullable<SanityFranchisePage["howItWorks"]>;
  trainingSupport: NonNullable<SanityFranchisePage["trainingSupport"]>;
  idealPartners: NonNullable<SanityFranchisePage["idealPartners"]>;
  faq: NonNullable<SanityFranchisePage["faq"]>;
  enquiry: NonNullable<SanityFranchisePage["enquiry"]>;
  prospectus: NonNullable<SanityFranchisePage["prospectus"]>;
  homeCta: NonNullable<SanityFranchisePage["homeCta"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityFranchisePage | null>({
    query: franchisePageQuery,
    tags: [FRANCHISE_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    image: page?.image,
    whyFranchise: page?.whyFranchise?.heading ? page.whyFranchise : FALLBACK_WHY_FRANCHISE,
    founderVision: page?.founderVision?.body ? page.founderVision : FALLBACK_FOUNDER_VISION,
    advantages: page?.advantages?.cards?.length ? page.advantages : FALLBACK_ADVANTAGES,
    howItWorks: page?.howItWorks?.steps?.length ? page.howItWorks : FALLBACK_HOW_IT_WORKS,
    trainingSupport: page?.trainingSupport?.columns?.length ? page.trainingSupport : FALLBACK_TRAINING_SUPPORT,
    idealPartners: page?.idealPartners?.bullets?.length ? page.idealPartners : FALLBACK_IDEAL_PARTNERS,
    faq: page?.faq?.items?.length ? page.faq : FALLBACK_FAQ,
    enquiry: page?.enquiry?.heading ? page.enquiry : FALLBACK_ENQUIRY,
    prospectus: page?.prospectus?.heading ? page.prospectus : FALLBACK_PROSPECTUS,
    homeCta: page?.homeCta?.heading ? page.homeCta : FALLBACK_HOME_CTA,
    seo: page?.seo,
  };
}
