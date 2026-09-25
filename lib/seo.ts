import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { urlFor } from "@/sanity/lib/image";
import type { Seo, SanityImage } from "@/types/sanity";

export const DEFAULT_OG_IMAGE = "/brand/adakings-logo-wordmark.png";

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function resolveOgImage(image?: SanityImage): string | undefined {
  if (!image?.asset) return undefined;
  return urlFor(image).width(1200).height(630).fit("crop").url();
}

type BuildMetadataArgs = {
  path: string;
  description: string;
  title?: string;
  seo?: Seo;
  image?: SanityImage;
  /**
   * Set when this route segment has its own `opengraph-image.tsx`. Next only
   * auto-applies that file-convention image when config-based metadata leaves
   * `openGraph.images` undefined, so when true (and no custom Sanity image is
   * set) we omit `images` here and let Next wire up the generated image instead
   * of falling back to the static default.
   */
  hasOwnOgImage?: boolean;
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  authors?: string[];
};

export function buildMetadata({
  path,
  title,
  description,
  seo,
  image,
  hasOwnOgImage,
  type = "website",
  publishedAt,
  modifiedAt,
  authors,
}: BuildMetadataArgs): Metadata {
  const resolvedTitle = seo?.metaTitle || title;
  const resolvedDescription = seo?.metaDescription || description;
  const customOgImage = resolveOgImage(seo?.ogImage) || resolveOgImage(image);
  const ogImage = customOgImage || (hasOwnOgImage ? undefined : absoluteUrl(DEFAULT_OG_IMAGE));
  const noIndex = Boolean(seo?.noIndex);

  return {
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    description: resolvedDescription,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type,
      title: resolvedTitle || siteConfig.name,
      description: resolvedDescription,
      url: path,
      siteName: siteConfig.name,
      locale: "en_GH",
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle || siteConfig.name }] }
        : {}),
      ...(type === "article" ? { publishedTime: publishedAt, modifiedTime: modifiedAt, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle || siteConfig.name,
      description: resolvedDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
