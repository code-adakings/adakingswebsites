import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allOpenJobsQuery,
  careerPageQuery,
  departmentsQuery,
  jobBySlugQuery,
  urgentJobsQuery,
} from "@/sanity/lib/queries/careers";
import { todayIso } from "@/lib/career-utils";
import type { Department, JobPosting, JobPostingCard, SanityCareersPage } from "@/types/career";
import type { Seo } from "@/types/sanity";

const CAREERS_PAGE_TAG = "careersPage";
const DEPARTMENT_TAG = "department";
// A posting projection dereferences its role, department and branch, so a
// publish on any of those types must also revalidate job listings.
const JOB_TAGS = ["jobPosting", "jobRole", DEPARTMENT_TAG, "branch"];

const FALLBACK_HERO: NonNullable<SanityCareersPage["hero"]> = {
  eyebrow: "Careers",
  title: "Grow your career with Adakings",
  description: "From the kitchen to branch leadership, we invest in our people and promote from within.",
};

const FALLBACK_WHY_WORK_HERE: NonNullable<SanityCareersPage["whyWorkHere"]> = {
  eyebrow: "Why Work at Adakings",
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

/** Shown under the culture gallery until Department documents exist in the Studio. */
const FALLBACK_DEPARTMENTS: Department[] = [
  { _id: "fallback-kitchen", title: "Kitchen Operations", slug: "kitchen-operations", icon: "chef-hat", description: "Chefs, line cooks, kitchen assistants, and packers who keep every order fresh, fast, and accurately packed." },
  { _id: "fallback-customer", title: "Customer Operations", slug: "customer-operations", icon: "headset", description: "Customer Operations ensures every customer enjoys a seamless experience—from welcoming walk-in guests and coordinating order pickups to handling enquiries, payments, and service recovery with professionalism and care." },
  { _id: "fallback-delivery", title: "Delivery Operations", slug: "delivery-operations", icon: "bike", description: "Riders who get hot meals to customers across campus and the city." },
  { _id: "fallback-marketing", title: "Marketing & Growth", slug: "marketing-growth", icon: "megaphone", description: "Storytellers and growth builders who bring new customers to Adakings." },
];

const FALLBACK_HIRING_PROCESS: NonNullable<SanityCareersPage["hiringProcess"]> = {
  eyebrow: "Hiring Process",
  heading: "What to expect when you apply",
  steps: [
    { icon: "file-text", title: "Apply", description: "Apply online to an open role — it takes about five minutes." },
    { icon: "phone-call", title: "Screening", description: "A quick call to learn more about you and the role." },
    { icon: "users", title: "Interview", description: "Meet the branch or department team in person." },
    { icon: "clipboard-check", title: "Offer", description: "We'll follow up with next steps and an offer." },
    { icon: "rocket", title: "Onboarding", description: "Structured training to set you up for day one." },
  ],
};

const FALLBACK_BENEFITS: NonNullable<SanityCareersPage["benefits"]> = {
  eyebrow: "Benefits",
  heading: "We take care of the people who take care of our customers",
  items: [
    { icon: "wallet", title: "Competitive, on-time pay", description: "Fair wages paid on schedule, every month." },
    { icon: "utensils", title: "Staff meals", description: "Enjoy Adakings meals on every shift." },
    { icon: "graduation-cap", title: "Paid training", description: "Learn food safety, service, and leadership on the job." },
    { icon: "trending-up", title: "Promotion from within", description: "Most of our shift leads started on the line." },
    { icon: "shield-check", title: "Safe workplace", description: "Proper equipment, hygiene standards, and support." },
    { icon: "calendar-clock", title: "Predictable rotas", description: "Shift schedules shared in advance, with room for students." },
  ],
};

const FALLBACK_FAQ: NonNullable<SanityCareersPage["faq"]> = {
  eyebrow: "FAQ",
  heading: "Questions candidates often ask",
  items: [
    { question: "Do I need previous experience?", answer: "Not for most entry-level roles. We train you on the job — we look for reliability, a good attitude, and a willingness to learn." },
    { question: "Can I work part-time while studying?", answer: "Yes. Many of our team members are students, and several roles are offered part-time with flexible shifts." },
    { question: "How long does the hiring process take?", answer: "Usually one to two weeks from application to offer, depending on the role." },
    { question: "Do I need a CV to apply?", answer: "It's optional, but we strongly recommend attaching one (PDF, up to 4 MB). It gives us a much fuller picture of your experience. If you don't have one, tell us about yourself in the application form." },
    { question: "What if there's no role that fits me right now?", answer: "Join our talent pool below and we'll contact you when a suitable role opens up." },
  ],
};

const FALLBACK_TALENT_POOL: Omit<NonNullable<SanityCareersPage["talentPool"]>, "cta"> = {
  heading: "Don't see the right role?",
  description: "Join the Adakings talent pool and we'll reach out when something that fits you opens up.",
};

const FALLBACK_HOME_CTA: NonNullable<SanityCareersPage["homeCta"]> = {
  eyebrow: "We're Hiring",
  heading: "Build your career with Adakings",
  description:
    "From the kitchen to branch leadership, we invest in our people. Join a team that's growing across Ghana.",
  cta: { label: "View Open Roles", href: "/careers" },
};

/** Most roles the Careers page and homepage list; the rest stay hidden. */
const LISTED_JOBS_LIMIT = 3;

/**
 * The roles listed on the Careers page and homepage: the "Top 3 urgent roles"
 * picked in Careers Page Settings, or the newest open postings when none of
 * the picks are open. Unlisted postings keep their own pages.
 */
export async function getListedJobs(): Promise<JobPostingCard[]> {
  const urgent = await sanityFetch<JobPostingCard[] | null>({
    query: urgentJobsQuery,
    params: { today: todayIso() },
    tags: [CAREERS_PAGE_TAG, ...JOB_TAGS],
  });
  if (urgent?.length) return urgent.slice(0, LISTED_JOBS_LIMIT);

  const open = await getOpenJobs();
  return open.slice(0, LISTED_JOBS_LIMIT);
}

export async function getOpenJobs(): Promise<JobPostingCard[]> {
  return sanityFetch<JobPostingCard[]>({
    query: allOpenJobsQuery,
    params: { today: todayIso() },
    tags: JOB_TAGS,
  });
}

export async function getJobBySlug(slug: string): Promise<JobPosting | null> {
  return sanityFetch<JobPosting | null>({
    query: jobBySlugQuery,
    params: { slug },
    tags: JOB_TAGS,
  });
}

export async function getDepartments(): Promise<Department[]> {
  const departments = await sanityFetch<Department[]>({
    query: departmentsQuery,
    tags: [DEPARTMENT_TAG],
  });
  return departments.length ? departments : FALLBACK_DEPARTMENTS;
}

export async function getCareersPage(): Promise<{
  hero: NonNullable<SanityCareersPage["hero"]>;
  image?: SanityCareersPage["image"];
  whyWorkHere: NonNullable<SanityCareersPage["whyWorkHere"]>;
  lifeAtAdakings: NonNullable<SanityCareersPage["lifeAtAdakings"]>;
  hiringProcess: NonNullable<SanityCareersPage["hiringProcess"]>;
  benefits: NonNullable<SanityCareersPage["benefits"]>;
  faq: NonNullable<SanityCareersPage["faq"]>;
  talentPool: NonNullable<SanityCareersPage["talentPool"]>;
  homeCta: NonNullable<SanityCareersPage["homeCta"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityCareersPage | null>({
    query: careerPageQuery,
    tags: [CAREERS_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    image: page?.image,
    whyWorkHere: page?.whyWorkHere?.cards?.length ? page.whyWorkHere : FALLBACK_WHY_WORK_HERE,
    lifeAtAdakings: page?.lifeAtAdakings?.heading ? page.lifeAtAdakings : FALLBACK_LIFE_AT_ADAKINGS,
    hiringProcess: page?.hiringProcess?.steps?.length ? page.hiringProcess : FALLBACK_HIRING_PROCESS,
    benefits: page?.benefits?.items?.length ? page.benefits : FALLBACK_BENEFITS,
    faq: page?.faq?.items?.length ? page.faq : FALLBACK_FAQ,
    talentPool: page?.talentPool?.heading ? page.talentPool : FALLBACK_TALENT_POOL,
    homeCta: page?.homeCta?.heading ? page.homeCta : FALLBACK_HOME_CTA,
    seo: page?.seo,
  };
}
