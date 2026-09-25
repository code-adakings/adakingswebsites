import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { urlFor } from "@/sanity/lib/image";
import { extractPlainText } from "@/sanity/lib/portable-text";
import type { ResolvedSiteSettings } from "@/lib/site-settings";
import type { DayHours, SanityBranch, SanityCareer, SanityImage } from "@/types/sanity";
import type { JournalPost } from "@/types/journal";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function imageUrl(image?: SanityImage, width = 1200, height = 630): string | undefined {
  return image?.asset ? urlFor(image).width(width).height(height).url() : undefined;
}

function openingHoursSpecification(hours: DayHours[] = []) {
  return hours
    .filter((day) => !day.closed && day.opens && day.closes)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${day.day}`,
      opens: day.opens,
      closes: day.closes,
    }));
}

export function organizationSchema(settings: ResolvedSiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: settings.siteName,
    legalName: settings.legalName || undefined,
    url: siteConfig.url,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    description: settings.description,
    email: settings.contactEmail || undefined,
    telephone: settings.contactPhone || undefined,
    sameAs: Object.values(settings.social).filter(Boolean),
  };
}

export function websiteSchema(settings: ResolvedSiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: settings.siteName,
    description: settings.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function restaurantSchema(settings: ResolvedSiteSettings) {
  const openingHours = openingHoursSpecification(settings.businessHours);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.url}/#restaurant`,
    name: settings.siteName,
    url: siteConfig.url,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    servesCuisine: "Ghanaian",
    telephone: settings.contactPhone || undefined,
    email: settings.contactEmail || undefined,
    ...(settings.registeredAddress
      ? { address: { "@type": "PostalAddress", streetAddress: settings.registeredAddress, addressCountry: "GH" } }
      : {}),
    ...(settings.gpsAddress
      ? { geo: { "@type": "GeoCoordinates", latitude: settings.gpsAddress.lat, longitude: settings.gpsAddress.lng } }
      : {}),
    ...(openingHours.length ? { openingHoursSpecification: openingHours } : {}),
    sameAs: Object.values(settings.social).filter(Boolean),
    parentOrganization: { "@id": `${siteConfig.url}/#organization` },
  };
}

function branchRestaurantSchema(branch: SanityBranch) {
  return {
    "@type": "Restaurant",
    "@id": `${siteConfig.url}/branches#${branch.slug}`,
    name: `${siteConfig.name} — ${branch.name}`,
    url: absoluteUrl("/branches"),
    servesCuisine: "Ghanaian",
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressCountry: "GH",
    },
    ...(branch.location
      ? { geo: { "@type": "GeoCoordinates", latitude: branch.location.lat, longitude: branch.location.lng } }
      : {}),
    telephone: branch.phone || undefined,
    email: branch.email || undefined,
    ...(branch.openingHours?.length
      ? { openingHoursSpecification: openingHoursSpecification(branch.openingHours) }
      : {}),
    image: imageUrl(branch.heroImage),
  };
}

export function branchesItemListSchema(branches: SanityBranch[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: branches.map((branch, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: branchRestaurantSchema(branch),
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogSchema(posts: JournalPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/journal#blog`,
    url: absoluteUrl("/journal"),
    name: `${siteConfig.name} Journal`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/journal/${post.slug}`),
      datePublished: post.publishedAt,
    })),
  };
}

export function articleSchema(post: JournalPost) {
  const image = imageUrl(post.heroImage);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/journal/${post.slug}`) },
  };
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

export function jobPostingSchema(career: SanityCareer, settings: ResolvedSiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: career.title,
    description: extractPlainText(career.description) || career.title,
    datePosted: career.postedAt,
    validThrough: career.deadline || undefined,
    employmentType: EMPLOYMENT_TYPE_MAP[career.employmentType] ?? "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: settings.siteName,
      sameAs: siteConfig.url,
      logo: absoluteUrl(DEFAULT_OG_IMAGE),
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: career.location, addressCountry: "GH" },
    },
    ...(career.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "GHS",
            value: { "@type": "QuantitativeValue", value: career.salary },
          },
        }
      : {}),
  };
}
