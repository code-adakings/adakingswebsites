import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getAboutPage } from "@/lib/about";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "About Adakings";

export default async function Image() {
  const { hero, seo } = await getAboutPage();
  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: hero.eyebrow,
      title: hero.title,
      customImageUrl: resolveOgImage(seo?.ogImage),
    }),
    size,
  );
}
