import { sanityFetch } from "@/sanity/lib/fetch";
import { allTestimonialsQuery, featuredTestimonialsQuery } from "@/sanity/lib/queries";
import type { SanityTestimonial } from "@/types/sanity";

const TESTIMONIAL_TAG = "testimonial";

export async function getFeaturedTestimonials(limit = 3): Promise<SanityTestimonial[]> {
  const featured = await sanityFetch<SanityTestimonial[]>({
    query: featuredTestimonialsQuery,
    tags: [TESTIMONIAL_TAG],
  });
  if (featured.length > 0) return featured.slice(0, limit);

  const all = await sanityFetch<SanityTestimonial[]>({
    query: allTestimonialsQuery,
    tags: [TESTIMONIAL_TAG],
  });
  return all.slice(0, limit);
}
