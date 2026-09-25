# CMS seed content

`seed.ndjson` contains 49 importable Sanity documents (NDJSON — one JSON document per line), generated for Phase 3.1.

`new-frontiers.ndjson` seeds the "Operation New Frontiers" private lending page (see [Private Landing Pages](#private-landing-pages) below).

## Import

```bash
npx sanity dataset import sanity/seed/seed.ndjson <dataset-name>
npx sanity dataset import sanity/seed/new-frontiers.ndjson <dataset-name>
```

Add `--replace` to overwrite documents that already exist with the same `_id` (safe to re-run — every document has a stable `_id`, so re-importing updates in place instead of duplicating).

## Private Landing Pages

`privateLandingPage` is a repeatable document type (Studio → **Private Landing Pages**) for one-off, invite-only pages — private lending rounds, investor updates, and similar. They are never linked from site navigation, never listed in the sitemap, and are always served with `noindex` regardless of the document's own SEO toggle. Next.js serves them from the catch-all route `app/(site)/[slug]/page.tsx`, which only matches a slug when no static page (like `/about`) already claims it.

To create a new one: in Studio, add a **Private Landing Page**, fill in an internal title (Studio reference only) and a URL slug — that slug becomes the live path, e.g. slug `phase-2-lending` publishes at `adakings.com/phase-2-lending`. No code change or redeploy needed; it goes live as soon as it's published.

The "Operation New Frontiers" page (`new-frontiers.ndjson`, slug `new-frontiers`) also has a hardcoded fallback in `lib/private-landing.ts` — until that document is imported or created in Studio, the page keeps rendering the same content from code, so the page was never at risk while the CMS document didn't exist yet.

Like other seeded content, `hero.heroImage` is left empty (Sanity image fields need a real uploaded asset, which a seed file can't fabricate) — upload the hero photo in Studio under **Private Landing Pages → Operation New Frontiers → Hero** after import. Until an image is uploaded, the hero simply renders without one.

## What's included

- **Singleton pages (11):** Site Settings, Homepage, About, Our Story, Contact, Catering, Franchise, Careers Page, Journal Page, Branches Page, Menu Page.
- **Menu:** 4 categories (Fried Rice, Jollof, Fries, Combos) and 16 menu items, referencing existing Adakings meals (Chek Chek, Classic Assorted, Premium, Loaded Fries, Signature Jollof, etc.).
- **Branches (3):** TF Hostel, Bani Hostel, UGMC — all in Legon, Accra, with placeholder GPS coordinates and phone numbers.
- **Leadership (4):** Kingsley K. Adase (Founder & Chief Visionary, real bio) plus 3 additional executive placeholders whose biographies are prefixed `(Draft placeholder)`.
- **Journal (3 posts, publish-ready):** "Our Story", "Why We Built Adakings", "The Future of Campus Dining in Ghana" — each with a real author reference, category reference(s), and full portable-text body.
- **Careers (3):** Kitchen Assistant, Fry Chef, Customer Service Associate — all status `Open` with requirements, benefits, and an application deadline.
- Supporting reference documents: 2 authors, 3 journal categories.

## Known gaps (intentional)

- **No image assets.** Fields like `journalPost.heroImage`, `menuPage.signatureMeals[].image`, `branch.heroImage`, and `leadership.photo` are left empty — Sanity image fields require a real uploaded asset reference, which this seed can't fabricate. Upload images in the Studio after import (`journalPost.heroImage` and `signatureMeals[].image` are schema-required, so those documents will show a validation warning in the Studio until an image is added — this does not block the import itself).
- **Contact details are realistic placeholders**, not live business numbers/addresses (phone numbers, `googleMapsUrl`, `gpsAddress`, branch coordinates). Replace with real values before going live.
- `menuPage.categories` and `menuPage.signatureMeals` (the embedded arrays) were left empty in favor of the standalone `menuCategory`/`menuItem` documents, which is the more scalable pattern given the schema provides both. The page will fall back to the component-level defaults in `lib/menu.ts` until those arrays are populated, if the page continues to read from them.
