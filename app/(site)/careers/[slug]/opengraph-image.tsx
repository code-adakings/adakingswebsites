import { ImageResponse } from "next/og";
import { ogImageSize, ogImageContentType, renderBrandOgImage } from "@/lib/og-image";
import { resolveOgImage } from "@/lib/seo";
import { getJobBySlug } from "@/lib/careers";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Careers at Adakings";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  return new ImageResponse(
    renderBrandOgImage({
      eyebrow: job?.department?.title ? `We're hiring · ${job.department.title}` : "We're hiring",
      title: job?.title ?? "Careers at Adakings",
      customImageUrl: resolveOgImage(job?.seo?.ogImage),
    }),
    size,
  );
}
