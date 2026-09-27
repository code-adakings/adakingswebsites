# CMS seed content

`seed.ndjson` contains 46 importable Sanity documents (NDJSON — one JSON document per line), generated for Phase 3.1.

`new-frontiers.ndjson` seeds the "Operation New Frontiers" private lending page (see [Private Landing Pages](#private-landing-pages) below).

`careers.ndjson` seeds the Careers module (see [Careers](#careers) below). Import it **after** `seed.ndjson`, because job postings reference the seeded branches.

## Import

```bash
npx sanity dataset import sanity/seed/seed.ndjson <dataset-name>
npx sanity dataset import sanity/seed/new-frontiers.ndjson <dataset-name>
npx sanity dataset import sanity/seed/careers.ndjson <dataset-name>
```

Add `--replace` to overwrite documents that already exist with the same `_id` (safe to re-run — every document has a stable `_id`, so re-importing updates in place instead of duplicating).

## Private Landing Pages

`privateLandingPage` is a repeatable document type (Studio → **Private Landing Pages**) for one-off, invite-only pages — private lending rounds, investor updates, and similar. They are never linked from site navigation, never listed in the sitemap, and are always served with `noindex` regardless of the document's own SEO toggle. Next.js serves them from the catch-all route `app/(site)/[slug]/page.tsx`, which only matches a slug when no static page (like `/about`) already claims it.

To create a new one: in Studio, add a **Private Landing Page**, fill in an internal title (Studio reference only) and a URL slug — that slug becomes the live path, e.g. slug `phase-2-lending` publishes at `adakings.com/phase-2-lending`. No code change or redeploy needed; it goes live as soon as it's published.

The "Operation New Frontiers" page (`new-frontiers.ndjson`, slug `new-frontiers`) also has a hardcoded fallback in `lib/private-landing.ts` — until that document is imported or created in Studio, the page keeps rendering the same content from code, so the page was never at risk while the CMS document didn't exist yet.

Like other seeded content, `hero.heroImage` is left empty (Sanity image fields need a real uploaded asset, which a seed file can't fabricate) — upload the hero photo in Studio under **Private Landing Pages → Operation New Frontiers → Hero** after import. Until an image is uploaded, the hero simply renders without one.

## Careers

`careers.ndjson` (17 documents), Studio → **Careers**:

- **Departments (4):** Kitchen Operations, Customer Operations, Delivery Operations, Marketing & Growth.
- **Job Roles (7):** Chef, Line Cook, Kitchen Assistant, Packer, Front Desk Associate, Rider, Marketing Associate. Each role references its department.
- **Job Postings (6):** Line Cook, Kitchen Assistant, Packer, and Front Desk Associate (all TF Hostel), plus Rider and Marketing Associate (no branch). All are `Open` and `featured`, with full description, responsibilities, requirements, and benefits.

A posting appears on `/careers` while its status is `Open` and its deadline (if set) hasn't passed. The featured grid shows open postings with **Featured** ticked; other open postings are listed underneath. Closed, filled, or expired postings still resolve at `/careers/<slug>`, but applications are disabled and the page is `noindex`.

The legacy `career` type (Phase 3.1) was replaced by `jobPosting`. If your dataset still contains the old `career-*` documents, delete them in Vision or with `npx sanity documents delete career-kitchen-assistant career-fry-chef career-customer-service-associate`.

## What's included

- **Singleton pages (11):** Site Settings, Homepage, About, Our Story, Contact, Catering, Franchise, Careers Page, Journal Page, Branches Page, Menu Page.
- **Menu:** 4 categories (Fried Rice, Jollof, Fries, Combos) and 16 menu items, referencing existing Adakings meals (Chek Chek, Classic Assorted, Premium, Loaded Fries, Signature Jollof, etc.).
- **Branches (3):** TF Hostel, Bani Hostel, UGMC — all in Legon, Accra, with placeholder GPS coordinates and phone numbers.
- **Leadership (4):** Kingsley K. Adase (Founder & Chief Visionary, real bio) plus 3 additional executive placeholders whose biographies are prefixed `(Draft placeholder)`.
- **Journal (3 posts, publish-ready):** "Our Story", "Why We Built Adakings", "The Future of Campus Dining in Ghana" — each with a real author reference, category reference(s), and full portable-text body.
- Supporting reference documents: 2 authors, 3 journal categories.

## Known gaps (intentional)

- **No image assets.** Fields like `journalPost.heroImage`, `menuPage.signatureMeals[].image`, `branch.heroImage`, and `leadership.photo` are left empty — Sanity image fields require a real uploaded asset reference, which this seed can't fabricate. Upload images in the Studio after import (`journalPost.heroImage` and `signatureMeals[].image` are schema-required, so those documents will show a validation warning in the Studio until an image is added — this does not block the import itself).
- **Contact details are realistic placeholders**, not live business numbers/addresses (phone numbers, `googleMapsUrl`, `gpsAddress`, branch coordinates). Replace with real values before going live.
- `menuPage.categories` and `menuPage.signatureMeals` (the embedded arrays) were left empty in favor of the standalone `menuCategory`/`menuItem` documents, which is the more scalable pattern given the schema provides both. The page will fall back to the component-level defaults in `lib/menu.ts` until those arrays are populated, if the page continues to read from them.
