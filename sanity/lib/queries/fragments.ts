/**
 * GROQ projection fragments shared by `sanity/lib/queries.ts` and the
 * per-module query files in this folder.
 */

export const imageFields = /* groq */ `{
  asset,
  hotspot,
  crop,
  alt,
}`;

export const seoFields = /* groq */ `{
  metaTitle,
  metaDescription,
  ogImage${imageFields},
  noIndex,
}`;

export const pageHeroFields = /* groq */ `{
  eyebrow,
  title,
  description,
}`;
