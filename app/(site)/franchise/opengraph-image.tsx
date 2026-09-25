import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getFranchisePage } from "@/lib/franchise";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Franchise with Adakings";

export default async function Image() {
  const { hero, image, seo } = await getFranchisePage();
  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: hero.eyebrow,
      title: hero.title,
      customImageUrl: resolveOgImage(seo?.ogImage) || resolveOgImage(image),
    }),
    size,
  );
}
