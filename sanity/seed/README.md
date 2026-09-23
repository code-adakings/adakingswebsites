# CMS seed content

`seed.ndjson` contains 49 importable Sanity documents (NDJSON — one JSON document per line), generated for Phase 3.1.

## Import

```bash
npx sanity dataset import sanity/seed/seed.ndjson <dataset-name>
```

Add `--replace` to overwrite documents that already exist with the same `_id` (safe to re-run — every document has a stable `_id`, so re-importing updates in place instead of duplicating).

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
