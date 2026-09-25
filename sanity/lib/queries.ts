import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `{
  asset,
  hotspot,
  crop,
  alt,
}`;

const seoFields = /* groq */ `{
  metaTitle,
  metaDescription,
  ogImage${imageFields},
  noIndex,
}`;

const pageHeroFields = /* groq */ `{
  eyebrow,
  title,
  description,
}`;

export const homepageQuery = defineQuery(`
  *[_type == "homepage"][0]{
    hero{
      eyebrow,
      heading,
      subheading,
      backgroundImage${imageFields},
      primaryCta,
      secondaryCta,
    },
    trustMetrics[]{ value, label },
    branchesPreview{ eyebrow, title, description },
    howOrderingWorks{
      eyebrow,
      title,
      steps[]{ icon, title, description },
      cta,
    },
    testimonialsHeading{ eyebrow, title },
    finalCta{ heading, description, primaryCta, secondaryCta },
    seo${seoFields},
  }
`);

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0]{
    hero${pageHeroFields},
    mission{ eyebrow, heading, description },
    teamSection{ eyebrow, heading },
    seo${seoFields},
  }
`);

export const ourStoryPageQuery = defineQuery(`
  *[_type == "ourStoryPage"][0]{
    hero${pageHeroFields},
    image${imageFields},
    homeTeaser{ heading, description },
    milestones[]{ year, title, description },
    seo${seoFields},
  }
`);

export const menuPageQuery = defineQuery(`
  *[_type == "menuPage"][0]{
    hero${pageHeroFields},
    signatureMealsHeading{ eyebrow, title, description },
    signatureMeals[]{ name, badge, description, image${imageFields} },
    categories[]{ name, items[]{ name, description } },
    cta,
    seo${seoFields},
  }
`);

const menuItemFields = /* groq */ `{
  "slug": slug.current,
  name,
  description,
  image${imageFields},
  price,
}`;

export const featuredMenuItemsQuery = defineQuery(`
  *[_type == "menuItem" && featured == true && available == true] | order(displayOrder asc) [0...4] ${menuItemFields}
`);

export const allMenuCategoriesQuery = defineQuery(`
  *[_type == "menuCategory"] | order(displayOrder asc) {
    "slug": slug.current,
    title,
    description,
    displayOrder,
  }
`);

export const allMenuItemsQuery = defineQuery(`
  *[_type == "menuItem" && available == true] | order(category->displayOrder asc, displayOrder asc) {
    "slug": slug.current,
    name,
    description,
    image${imageFields},
    price,
    featured,
    "category": category->{ "slug": slug.current, title, displayOrder },
  }
`);

export const cateringPageQuery = defineQuery(`
  *[_type == "cateringPage"][0]{
    hero${pageHeroFields},
    highlights,
    image${imageFields},
    cta,
    homeCta{ heading, description, cta },
    seo${seoFields},
  }
`);

export const franchisePageQuery = defineQuery(`
  *[_type == "franchisePage"][0]{
    hero{
      eyebrow,
      title,
      description,
      heroImage${imageFields},
      primaryCta,
      secondaryCta,
    },
    image${imageFields},
    whyFranchise{ eyebrow, heading, description },
    founderVision{ eyebrow, heading, body, image${imageFields} },
    advantages{ eyebrow, heading, cards[]{ icon, title, description } },
    howItWorks{ eyebrow, heading, steps[]{ icon, title, description } },
    trainingSupport{ eyebrow, heading, columns[]{ title, description, image${imageFields} } },
    idealPartners{ eyebrow, heading, description, bullets },
    faq{ eyebrow, heading, items[]{ question, answer } },
    enquiry{ heading, description },
    prospectus{
      heading,
      description,
      "prospectusFileUrl": prospectusFile.asset->url,
      primaryCtaLabel,
      secondaryCta,
    },
    homeCta{ heading, description, cta },
    seo${seoFields},
  }
`);

export const contactPageQuery = defineQuery(`
  *[_type == "contactPage"][0]{
    hero${pageHeroFields},
    branchesBlock{ heading, linkLabel },
    seo${seoFields},
  }
`);

export const careersPageQuery = defineQuery(`
  *[_type == "careersPage"][0]{
    hero${pageHeroFields},
    image${imageFields},
    cvCtaLabel,
    whyWorkHere{ eyebrow, heading, description, cards[]{ icon, title, description } },
    lifeAtAdakings{
      eyebrow,
      heading,
      description,
      gallery[]${imageFields},
      quote{ text, name, role },
    },
    departments[]{ name, description },
    hiringProcess{ eyebrow, heading, steps[]{ icon, title, description } },
    employeeValues{ eyebrow, heading, description, values[]{ title, description } },
    finalCta{ heading, description, cta },
    homeCta{ eyebrow, heading, description, cta },
    seo${seoFields},
  }
`);

export const communityImpactQuery = defineQuery(`
  *[_type == "communityImpact"][0]{
    eyebrow,
    heading,
    description,
    initiatives[]{ title, description },
    image${imageFields},
  }
`);

export const whyAdakingsQuery = defineQuery(`
  *[_type == "whyAdakings"][0]{
    eyebrow,
    heading,
    reasons[]{ icon, title, description },
  }
`);

export const journalPageQuery = defineQuery(`
  *[_type == "journalPage"][0]{
    hero${pageHeroFields},
    newsletter{ heading, description },
    seo${seoFields},
  }
`);

export const branchesPageQuery = defineQuery(`
  *[_type == "branchesPage"][0]{
    hero{
      eyebrow,
      title,
      description,
      heroImage${imageFields},
      cta,
    },
    mapSection{ eyebrow, title, description },
    servicesSection{
      eyebrow,
      title,
      description,
      items[]{ icon, title, description },
    },
    growth{
      eyebrow,
      title,
      description,
      image${imageFields},
    },
    finalCta{ heading, description, cta },
    seo${seoFields},
  }
`);

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName,
    legalName,
    description,
    longDescription,
    orderUrl,
    registeredAddress,
    gpsAddress,
    googleMapsUrl,
    businessHours,
    navigation[]{ label, href },
    footerNav[]{ title, items[]{ label, href } },
    social,
    contactEmail,
    supportEmail,
    contactPhone,
    phoneNumbers[]{ label, number },
    whatsapp,
  }
`);

const journalPostCardFields = /* groq */ `{
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  featured,
  heroImage${imageFields},
  "readingTimeOverride": readingTimeOverride,
  "body": body,
  author->{ name, "slug": slug.current, role, avatar${imageFields}, bio, socialLinks },
  "categories": categories[]->{ title, "slug": slug.current },
}`;

export const allJournalPostsQuery = defineQuery(`
  *[_type == "journalPost"] | order(publishedAt desc) ${journalPostCardFields}
`);

export const featuredJournalPostQuery = defineQuery(`
  *[_type == "journalPost" && featured == true] | order(publishedAt desc)[0] ${journalPostCardFields}
`);

export const journalPostSlugsQuery = defineQuery(`
  *[_type == "journalPost" && defined(slug.current)][].slug.current
`);

export const journalPostBySlugQuery = defineQuery(`
  *[_type == "journalPost" && slug.current == $slug][0]{
    ...${journalPostCardFields},
    body[]{
      ...,
      _type == "image" => ${imageFields},
    },
    relatedPosts[]->${journalPostCardFields},
    seo${seoFields},
  }
`);

export const journalPostsForSitemapQuery = defineQuery(`
  *[_type == "journalPost" && defined(slug.current)]{
    "slug": slug.current,
    publishedAt,
    "noIndex": seo.noIndex,
  }
`);

export const journalCategoriesQuery = defineQuery(`
  array::unique(*[_type == "journalPost" && count(categories) > 0].categories[]->title)
`);

const careerFields = /* groq */ `{
  "slug": slug.current,
  title,
  department,
  location,
  employmentType,
  salary,
  description,
  requirements,
  benefits,
  deadline,
  applicationUrl,
  status,
  postedAt,
}`;

export const openCareersQuery = defineQuery(`
  *[_type == "career" && status == "Open"] | order(postedAt desc) ${careerFields}
`);

const branchFields = /* groq */ `{
  "slug": slug.current,
  name,
  status,
  address,
  city,
  location,
  phone,
  email,
  googleMapsUrl,
  openingHours[]{ day, closed, opens, closes },
  services,
  acceptsDelivery,
  acceptsPickup,
  displayOrder,
  heroImage${imageFields},
  gallery[]${imageFields},
}`;

export const allBranchesQuery = defineQuery(`
  *[_type == "branch"] | order(displayOrder asc, name asc) ${branchFields}
`);

export const openBranchesQuery = defineQuery(`
  *[_type == "branch" && status == "Open"] | order(displayOrder asc, name asc) [0...4] ${branchFields}
`);

const testimonialFields = /* groq */ `{
  quote,
  name,
  detail,
  rating,
  avatar${imageFields},
  featured,
}`;

export const featuredTestimonialsQuery = defineQuery(`
  *[_type == "testimonial" && featured == true] | order(_createdAt desc) [0...3] ${testimonialFields}
`);

export const allTestimonialsQuery = defineQuery(`
  *[_type == "testimonial"] | order(_createdAt desc) ${testimonialFields}
`);

export const leadershipQuery = defineQuery(`
  *[_type == "leadership"] | order(displayOrder asc) {
    name,
    "slug": slug.current,
    position,
    photo${imageFields},
    biography,
    socialLinks,
  }
`);

export const founderQuery = defineQuery(`
  *[_type == "leadership" && position match "*founder*"] | order(displayOrder asc) [0]{
    name,
    "slug": slug.current,
    position,
    photo${imageFields},
    biography,
    socialLinks,
  }
`);
