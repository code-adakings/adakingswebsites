import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getPostBySlug } from "@/lib/journal";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Adakings Journal";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: post?.categories?.[0]?.title ?? "Journal",
      title: post?.title ?? "Adakings Journal",
      customImageUrl: resolveOgImage(post?.seo?.ogImage) || resolveOgImage(post?.heroImage),
    }),
    size,
  );
}
