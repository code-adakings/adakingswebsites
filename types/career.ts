/**
 * Careers module types. Mirrors `sanity/schemaTypes/documents/{department,
 * jobRole,jobPosting,careersPage}.ts` and the GROQ projections in
 * `sanity/lib/queries/careers.ts` — if a projection changes, this file
 * changes with it.
 *
 * The const tuples are also imported by the Sanity schemas so the Studio
 * options and the frontend unions can never drift apart.
 */
import type { CtaLink, PageHero, PortableTextBlock, SanityImage, Seo } from "@/types/sanity";

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship"] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const JOB_STATUSES = ["Open", "Closed", "Filled"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

export type Department = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  /** Lucide icon key from the schema's option list; unknown keys fall back in the UI. */
  icon?: string;
};

export type DepartmentSummary = Pick<Department, "title" | "slug" | "icon">;

export type JobRoleSummary = {
  title: string;
  slug: string;
};

export type JobBranch = {
  name: string;
  slug: string;
  city?: string;
};

/** Projection used by listings (cards, open roles grid, homepage, sitemap). */
export type JobPostingCard = {
  _id: string;
  slug: string;
  title: string;
  employmentType: EmploymentType;
  salary?: string;
  location: string;
  status: JobStatus;
  /** ISO date (YYYY-MM-DD). */
  deadline?: string;
  /** ISO datetime. */
  postedAt?: string;
  /** Pulled from the referenced role. */
  summary?: string;
  noIndex: boolean;
  /** Dereferenced — null when the reference is missing or points at a deleted document. */
  role: JobRoleSummary | null;
  department: DepartmentSummary | null;
  branch: JobBranch | null;
};

/** Full projection for `/careers/[slug]`. */
export type JobPosting = JobPostingCard & {
  description: PortableTextBlock[];
  responsibilities?: PortableTextBlock[];
  requirements?: PortableTextBlock[];
  benefits?: PortableTextBlock[];
  seo?: Seo;
};

/* ------------------------------------------------------------------ */
/* Careers page singleton                                              */
/* ------------------------------------------------------------------ */

export type CareersWhyCard = {
  icon: string;
  title: string;
  description?: string;
};

export type CareersProcessStep = {
  icon: string;
  title: string;
  description?: string;
};

export type CareersBenefit = {
  icon: string;
  title: string;
  description?: string;
};

export type CareersFaqItem = {
  question: string;
  answer?: string;
};

export type CareersQuote = {
  text?: string;
  name?: string;
  role?: string;
};

export type SanityCareersPage = {
  hero?: PageHero;
  image?: SanityImage;
  whyWorkHere?: { eyebrow?: string; heading?: string; description?: string; cards?: CareersWhyCard[] };
  lifeAtAdakings?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    gallery?: SanityImage[];
    quote?: CareersQuote;
  };
  hiringProcess?: { eyebrow?: string; heading?: string; steps?: CareersProcessStep[] };
  benefits?: { eyebrow?: string; heading?: string; description?: string; items?: CareersBenefit[] };
  faq?: { eyebrow?: string; heading?: string; items?: CareersFaqItem[] };
  talentPool?: { heading?: string; description?: string; cta?: CtaLink };
  homeCta?: { eyebrow?: string; heading?: string; description?: string; cta?: CtaLink };
  seo?: Seo;
};

/* ------------------------------------------------------------------ */
/* Applications (Phase 1.7 applicant CRM)                               */
/* ------------------------------------------------------------------ */

/** Pipeline order. "Rejected" closes unsuccessful applications. */
export const APPLICATION_STATUSES = ["New", "Screening", "Interview", "Hired", "Rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type JobApplicationField =
  | "fullName"
  | "phone"
  | "email"
  | "areaOfResidence"
  | "employmentType"
  | "introduction"
  | "cv";

export type JobApplicationErrors = Partial<Record<JobApplicationField, string>>;

/** Result of the `submitJobApplication` server action. */
export type JobApplicationResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string; errors?: JobApplicationErrors };
