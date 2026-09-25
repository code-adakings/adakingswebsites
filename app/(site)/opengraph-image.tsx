import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getHomepage } from "@/lib/homepage";
import { siteConfig } from "@/lib/site-config";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = siteConfig.name;

export default async function Image() {
  const { hero, seo } = await getHomepage();
  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: hero.eyebrow,
      title: hero.heading,
      customImageUrl: resolveOgImage(seo?.ogImage),
    }),
    size,
  );
}
