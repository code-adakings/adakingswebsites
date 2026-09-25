import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getCareersPage } from "@/lib/careers";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Careers at Adakings";

export default async function Image() {
  const { hero, image, seo } = await getCareersPage();
  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: hero.eyebrow,
      title: hero.title,
      customImageUrl: resolveOgImage(seo?.ogImage) || resolveOgImage(image),
    }),
    size,
  );
}
