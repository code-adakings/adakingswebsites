import { sanityFetch } from "@/sanity/lib/fetch";
import { careersPageQuery, openCareersQuery } from "@/sanity/lib/queries";
import type { SanityCareer, SanityCareersPage, Seo } from "@/types/sanity";

const CAREER_TAG = "career";
const CAREERS_PAGE_TAG = "careersPage";

const FALLBACK_HERO: NonNullable<SanityCareersPage["hero"]> = {
  eyebrow: "Careers",
  title: "Grow your career with Adakings",
  description: "From the kitchen to branch leadership, we invest in our people and promote from within.",
};

const FALLBACK_WHY_WORK_HERE: NonNullable<SanityCareersPage["whyWorkHere"]> = {
  eyebrow: "Why Work Here",
  heading: "A place to build a career, not just work a shift",
  description: "We're growing fast across Ghana, and we grow our people alongside the business.",
  cards: [
    { icon: "trending-up", title: "Real growth", description: "Promote-from-within, with team members regularly moving into shift lead and management roles." },
    { icon: "users", title: "Real teamwork", description: "Close-knit branch teams that back each other up during every shift." },
    { icon: "heart-handshake", title: "Real benefits", description: "Competitive pay, staff meals, and support when you need it." },
    { icon: "graduation-cap", title: "Real training", description: "Structured onboarding and ongoing training in every role." },
  ],
};

const FALLBACK_LIFE_AT_ADAKINGS: NonNullable<SanityCareersPage["lifeAtAdakings"]> = {
  eyebrow: "Life at Adakings",
  heading: "A day in the life",
  description: "Fast-paced kitchens, busy service counters, and teams that take pride in every order that goes out the door.",
  gallery: [],
};

const FALLBACK_DEPARTMENTS: NonNullable<SanityCareersPage["departments"]> = [
  { name: "Kitchen & Culinary", description: "Line cooks, chefs, and kitchen leadership." },
  { name: "Branch Operations", description: "Shift leads, supervisors, and branch managers." },
  { name: "Delivery & Logistics", description: "Riders and dispatch coordinators." },
  { name: "Corporate & Support", description: "Marketing, finance, HR, and operations support." },
];

const FALLBACK_HIRING_PROCESS: NonNullable<SanityCareersPage["hiringProcess"]> = {
  eyebrow: "Hiring Process",
  heading: "What to expect when you apply",
  steps: [
    { icon: "file-text", title: "Apply", description: "Send your CV or apply directly to an open role." },
    { icon: "phone-call", title: "Screening", description: "A quick call to learn more about you and the role." },
    { icon: "users", title: "Interview", description: "Meet the branch or department team in person." },
    { icon: "clipboard-check", title: "Offer", description: "We'll follow up with next steps and an offer." },
    { icon: "rocket", title: "Onboarding", description: "Structured training to set you up for day one." },
  ],
};

const FALLBACK_EMPLOYEE_VALUES: NonNullable<SanityCareersPage["employeeValues"]> = {
  eyebrow: "Employee Values",
  heading: "What we look for in every team member",
  values: [
    { title: "Hospitality", description: "Treat every customer like a guest in your own home." },
    { title: "Hustle", description: "Move with urgency, especially during a rush." },
    { title: "Integrity", description: "Do the right thing, even when no one's watching." },
    { title: "Teamwork", description: "Show up for your shift and for each other." },
  ],
};

const FALLBACK_FINAL_CTA: NonNullable<SanityCareersPage["finalCta"]> = {
  heading: "Ready to join the team?",
  description: "Check our open roles or send us your CV — we're always looking for great people.",
  cta: { label: "View Open Roles", href: "#open-roles" },
};

const FALLBACK_HOME_CTA: NonNullable<SanityCareersPage["homeCta"]> = {
  eyebrow: "We're Hiring",
  heading: "Build your career with Adakings",
  description:
    "From the kitchen to branch leadership, we invest in our people. Join a team that's growing across Ghana.",
  cta: { label: "View Open Roles", href: "/careers" },
};

export async function getOpenCareers(): Promise<SanityCareer[]> {
  return sanityFetch<SanityCareer[]>({
    query: openCareersQuery,
    tags: [CAREER_TAG],
  });
}

export async function getCareersPage(): Promise<{
  hero: NonNullable<SanityCareersPage["hero"]>;
  image?: SanityCareersPage["image"];
  cvCtaLabel: string;
  whyWorkHere: NonNullable<SanityCareersPage["whyWorkHere"]>;
  lifeAtAdakings: NonNullable<SanityCareersPage["lifeAtAdakings"]>;
  departments: NonNullable<SanityCareersPage["departments"]>;
  hiringProcess: NonNullable<SanityCareersPage["hiringProcess"]>;
  employeeValues: NonNullable<SanityCareersPage["employeeValues"]>;
  finalCta: NonNullable<SanityCareersPage["finalCta"]>;
  homeCta: NonNullable<SanityCareersPage["homeCta"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityCareersPage | null>({
    query: careersPageQuery,
    tags: [CAREERS_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    image: page?.image,
    cvCtaLabel: page?.cvCtaLabel || "Send Us Your CV",
    whyWorkHere: page?.whyWorkHere?.cards?.length ? page.whyWorkHere : FALLBACK_WHY_WORK_HERE,
    lifeAtAdakings: page?.lifeAtAdakings?.heading ? page.lifeAtAdakings : FALLBACK_LIFE_AT_ADAKINGS,
    departments: page?.departments?.length ? page.departments : FALLBACK_DEPARTMENTS,
    hiringProcess: page?.hiringProcess?.steps?.length ? page.hiringProcess : FALLBACK_HIRING_PROCESS,
    employeeValues: page?.employeeValues?.values?.length ? page.employeeValues : FALLBACK_EMPLOYEE_VALUES,
    finalCta: page?.finalCta?.heading ? page.finalCta : FALLBACK_FINAL_CTA,
    homeCta: page?.homeCta?.heading ? page.homeCta : FALLBACK_HOME_CTA,
    seo: page?.seo,
  };
}
