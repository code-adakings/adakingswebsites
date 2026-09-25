import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getJournalPage } from "@/lib/journal";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "The Adakings Journal";

export default async function Image() {
  const { hero, seo } = await getJournalPage();
  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: hero.eyebrow,
      title: hero.title,
      customImageUrl: resolveOgImage(seo?.ogImage),
    }),
    size,
  );
}
