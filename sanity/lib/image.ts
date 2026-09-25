import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImage } from "@/types/sanity";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImage) {
  return imageBuilder.image(source);
}
