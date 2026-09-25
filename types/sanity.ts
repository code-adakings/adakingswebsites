/**
 * Hand-authored types mirroring `sanity/schemaTypes`. Kept close to the GROQ
 * projections in `sanity/lib/queries.ts` — if a query's shape changes, this
 * file changes with it. (Swap for `sanity typegen` output once the project
 * is connected to a real dataset — see sanity-typegen.json.)
 */

export type SanityImage = {
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
};

export type CtaLink = {
  label: string;
  href: string;
};

export type DayHours = {
  day: string;
  closed?: boolean;
  opens?: string;
  closes?: string;
};

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type FooterNavGroup = {
  title: string;
  items: NavItem[];
};

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
};

export type PortableTextBlock = { _type: string; _key?: string; [key: string]: unknown };

export type SanityAuthor = {
  name: string;
  slug: string;
  role?: string;
  avatar?: SanityImage;
  bio?: string;
  socialLinks?: SocialLinks;
};

export type SanityCategory = {
  title: string;
  slug: string;
};

export type SanityJournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  featured?: boolean;
  heroImage: SanityImage;
  readingTimeOverride?: number;
  body: PortableTextBlock[];
  author: SanityAuthor;
  categories: SanityCategory[];
  relatedPosts?: SanityJournalPost[];
  seo?: Seo;
};

export type SanityCareer = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salary?: string;
  description: PortableTextBlock[];
  requirements?: string[];
  benefits?: string[];
  deadline?: string;
  applicationUrl: string;
  status: "Open" | "Closed";
  postedAt?: string;
};

export type SanityBranch = {
  slug: string;
  name: string;
  status: "Open" | "Coming Soon" | "Temporarily Closed";
  address: string;
  city?: string;
  location?: { lat: number; lng: number };
  phone?: string;
  email?: string;
  googleMapsUrl?: string;
  openingHours?: DayHours[];
  services?: string[];
  acceptsDelivery?: boolean;
  acceptsPickup?: boolean;
  displayOrder?: number;
  heroImage?: SanityImage;
  gallery?: SanityImage[];
};

export type SanityTestimonial = {
  quote: string;
  name: string;
  detail?: string;
  rating?: number;
  avatar?: SanityImage;
  featured?: boolean;
};

export type SanityLeadership = {
  name: string;
  slug: string;
  position: string;
  photo?: SanityImage;
  biography?: string;
  socialLinks?: SocialLinks;
};

export type PageHero = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export type SanityHomepage = {
  hero?: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    backgroundImage?: SanityImage;
    primaryCta?: CtaLink;
    secondaryCta?: CtaLink;
  };
  trustMetrics?: { value: string; label: string }[];
  branchesPreview?: { eyebrow?: string; title?: string; description?: string };
  howOrderingWorks?: {
    eyebrow?: string;
    title?: string;
    steps?: { icon: string; title: string; description?: string }[];
    cta?: CtaLink;
  };
  testimonialsHeading?: { eyebrow?: string; title?: string };
  finalCta?: {
    heading?: string;
    description?: string;
    primaryCta?: CtaLink;
    secondaryCta?: CtaLink;
  };
  seo?: Seo;
};

export type SanityAboutPage = {
  hero?: PageHero;
  mission?: { eyebrow?: string; heading?: string; description?: string };
  teamSection?: { eyebrow?: string; heading?: string };
  seo?: Seo;
};

export type SanityOurStoryPage = {
  hero?: PageHero;
  image?: SanityImage;
  homeTeaser?: { heading?: string; description?: string };
  milestones?: { year?: string; title: string; description?: string }[];
  seo?: Seo;
};

export type SanityMenuPage = {
  hero?: PageHero;
  signatureMealsHeading?: { eyebrow?: string; title?: string; description?: string };
  signatureMeals?: { name: string; badge?: string; description?: string; image: SanityImage }[];
  categories?: { name: string; items?: { name: string; description?: string }[] }[];
  cta?: CtaLink;
  seo?: Seo;
};

export type SanityMenuItem = {
  slug: string;
  name: string;
  description?: string;
  image?: SanityImage;
  price: number;
  featured?: boolean;
  category?: { slug: string; title: string; displayOrder?: number };
};

export type SanityMenuCategory = {
  slug: string;
  title: string;
  description?: string;
  displayOrder?: number;
};

export type SanityCateringPage = {
  hero?: PageHero;
  highlights?: string[];
  image?: SanityImage;
  cta?: CtaLink;
  homeCta?: { heading?: string; description?: string; cta?: CtaLink };
  seo?: Seo;
};

export type FranchiseAdvantageCard = {
  icon: string;
  title: string;
  description?: string;
};

export type FranchiseProcessStep = {
  icon: string;
  title: string;
  description?: string;
};

export type FranchiseTrainingColumn = {
  title: string;
  description?: string;
  image?: SanityImage;
};

export type FranchiseFaqItem = {
  question: string;
  answer?: string;
};

export type SanityFranchisePage = {
  hero?: PageHero & { heroImage?: SanityImage; primaryCta?: CtaLink; secondaryCta?: CtaLink };
  image?: SanityImage;
  whyFranchise?: { eyebrow?: string; heading?: string; description?: string };
  founderVision?: { eyebrow?: string; heading?: string; body?: string; image?: SanityImage };
  advantages?: { eyebrow?: string; heading?: string; cards?: FranchiseAdvantageCard[] };
  howItWorks?: { eyebrow?: string; heading?: string; steps?: FranchiseProcessStep[] };
  trainingSupport?: { eyebrow?: string; heading?: string; columns?: FranchiseTrainingColumn[] };
  idealPartners?: { eyebrow?: string; heading?: string; description?: string; bullets?: string[] };
  faq?: { eyebrow?: string; heading?: string; items?: FranchiseFaqItem[] };
  enquiry?: { heading?: string; description?: string };
  prospectus?: {
    heading?: string;
    description?: string;
    prospectusFileUrl?: string;
    primaryCtaLabel?: string;
    secondaryCta?: CtaLink;
  };
  homeCta?: { heading?: string; description?: string; cta?: CtaLink };
  seo?: Seo;
};

export type SanityContactPage = {
  hero?: PageHero;
  branchesBlock?: { heading?: string; linkLabel?: string };
  seo?: Seo;
};

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

export type CareersValue = {
  title: string;
  description?: string;
};

export type SanityCareersPage = {
  hero?: PageHero;
  image?: SanityImage;
  cvCtaLabel?: string;
  whyWorkHere?: { eyebrow?: string; heading?: string; description?: string; cards?: CareersWhyCard[] };
  lifeAtAdakings?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    gallery?: SanityImage[];
    quote?: { text?: string; name?: string; role?: string };
  };
  departments?: { name: string; description?: string }[];
  hiringProcess?: { eyebrow?: string; heading?: string; steps?: CareersProcessStep[] };
  employeeValues?: { eyebrow?: string; heading?: string; description?: string; values?: CareersValue[] };
  finalCta?: { heading?: string; description?: string; cta?: CtaLink };
  homeCta?: { eyebrow?: string; heading?: string; description?: string; cta?: CtaLink };
  seo?: Seo;
};

export type SanityCommunityImpact = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  initiatives?: { title: string; description?: string }[];
  image?: SanityImage;
};

export type SanityWhyAdakings = {
  eyebrow?: string;
  heading?: string;
  reasons?: { icon: string; title: string; description?: string }[];
};

export type SanityJournalPage = {
  hero?: PageHero;
  newsletter?: { heading?: string; description?: string };
  seo?: Seo;
};

export type BranchService = {
  icon: string;
  title: string;
  description?: string;
};

export type SanityBranchesPage = {
  hero?: PageHero & { heroImage?: SanityImage; cta?: CtaLink };
  mapSection?: { eyebrow?: string; title?: string; description?: string };
  servicesSection?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: BranchService[];
  };
  growth?: { eyebrow?: string; title?: string; description?: string; image?: SanityImage };
  finalCta?: { heading?: string; description?: string; cta?: CtaLink };
  seo?: Seo;
};

export type Geopoint = {
  lat: number;
  lng: number;
  alt?: number;
};

export type PhoneNumber = {
  label?: string;
  number: string;
};

export type PrivateLandingMetric = {
  value: string;
  label: string;
};

export type PrivateLandingFeature = {
  icon: string;
  title: string;
  description?: string;
};

export type PrivateLandingPhase = {
  label: string;
  amount: string;
  description?: string;
  status?: string;
  isCurrent?: boolean;
};

export type PrivateLandingRepaymentRow = {
  investment: string;
  interest: string;
  total: string;
};

export type SanityPrivateLandingPage = {
  hero?: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    description?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    heroImage?: SanityImage;
    metrics?: PrivateLandingMetric[];
  };
  foundersLetter?: {
    eyebrow?: string;
    heading?: string;
    paragraphs?: string[];
    signatureName?: string;
    signatureRole?: string;
  };
  whyNow?: {
    heading?: string;
    body?: string[];
    features?: PrivateLandingFeature[];
  };
  businessToday?: {
    heading?: string;
    body?: string;
    serviceAreas?: string[];
    metrics?: PrivateLandingMetric[];
  };
  roadmap?: {
    heading?: string;
    phases?: PrivateLandingPhase[];
    caption?: string;
  };
  investmentTerms?: {
    eyebrow?: string;
    heading?: string;
    headlineRate?: string;
    rateCaption?: string;
    repaymentRows?: PrivateLandingRepaymentRow[];
    note?: string;
  };
  cta?: {
    heading?: string;
    body?: string;
    investmentAmountOptions?: string[];
    acknowledgementText?: string;
    submitLabel?: string;
    disclaimer?: string;
  };
  seo?: Seo;
};

export type SanitySiteSettings = {
  siteName: string;
  legalName?: string;
  description?: string;
  longDescription?: string;
  orderUrl?: string;
  registeredAddress?: string;
  gpsAddress?: Geopoint;
  googleMapsUrl?: string;
  businessHours?: DayHours[];
  navigation?: NavItem[];
  footerNav?: FooterNavGroup[];
  social?: SocialLinks;
  contactEmail?: string;
  supportEmail?: string;
  contactPhone?: string;
  phoneNumbers?: PhoneNumber[];
  whatsapp?: string;
};
