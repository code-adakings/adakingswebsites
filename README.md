# Adakings Websites

The official corporate website for Adakings Franchise Corporation Ltd. (`adakings.com`) — brand, marketing, recruitment, franchise, catering, and editorial content. This is a standalone project, independent of the Adakings Web Apps ordering platform (`adakingsapp.com`).

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config, see `app/globals.css`)
- shadcn/ui (`base-nova` style, on `@base-ui/react` primitives — components use a `render` prop instead of `asChild`)
- Framer Motion for subtle animation
- **Sanity** — headless CMS, Studio embedded at `/studio`. See [Going live](#going-live-full-walkthrough) below.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your Sanity project ID (see "Going live" below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site will render with static fallback copy until a Sanity project is connected and content is published.

## Going live: full walkthrough

The code (schema, Studio, data-fetching) is already done. Nothing in this repo needs to change — everything below happens in your browser (sanity.io, Vercel) or in two small text files (`.env.local` / your host's env var settings). This gets you from "cloned repo" to "live site editors can update themselves."

### Part A — Create your Sanity project (~3 minutes)

Do this on the web, not the CLI — it's less error-prone for a first-time setup.

1. Go to **[sanity.io/manage](https://www.sanity.io/manage)** and sign in (or create a free account).
2. Click **Create project**. Name it anything, e.g. "Adakings Websites".
3. Sanity automatically creates a dataset called **`production`** with public read access — leave it as-is. That's correct for a public marketing site (visitors' browsers need to load images/content without logging in).
4. On the new project's dashboard, copy the **Project ID** shown near the top (a short string like `ab12cd34`). You'll need it in Part B.
5. Still on this project, go to **API → CORS Origins → Add CORS origin**, and add:
   - `http://localhost:3000` — with **"Allow credentials"** checked (this is required for `/studio` to work at all locally — without it, the Studio fails to load with a CORS/network error the moment you open it)
   - You'll come back here in Part D to add your real production domain the same way.

This project is now empty — no content types exist in it yet. That's expected: the schema (what content types exist, what fields they have) lives in *this repository's code* (`sanity/schemaTypes/`), not in the Sanity project itself. The Studio reads the schema from the code it's running, and stores the actual content (your journal posts, branches, etc.) in the empty project you just created. So there's no "import schema" step — running the app with the right project ID connects them automatically.

### Part B — Connect this repo to your project (~1 minute)

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=ab12cd34        # the Project ID from Part A, step 4
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_REVALIDATE_SECRET=any-random-string-you-make-up
```

Then:

```bash
npm install   # if you haven't already
npm run dev
```

Open **[http://localhost:3000/studio](http://localhost:3000/studio)**. You should see a Sanity login screen — sign in with the same account from Part A. You'll land in the Studio with "Homepage", "Site Settings", and the rest of the content types listed on the left, all empty. If you instead see a CORS/network error, you missed step 5 in Part A — add `http://localhost:3000` to CORS Origins and refresh.

### Part C — Add your content (~30–60 minutes for a full first pass)

The site renders with placeholder text/images for anything you haven't created yet, so you can do this gradually. **Do these two first** — everything else depends on them for navigation/branding to look right:

1. **Site Settings** (left sidebar, near the top) — fill in Site name, Navigation (add one item per page: Home → `/`, About → `/about`, Branches → `/branches`, Catering → `/catering`, Franchise → `/franchise`, Careers → `/careers`, Journal → `/journal`, Contact → `/contact`), Footer link groups, Social links, Contact email/phone, Order URL. Click **Publish** (top right) — not just the auto-saved draft.
2. **Homepage** — Hero eyebrow/heading/subheading/background image, primary + secondary CTA buttons, Trust metrics (up to 4 stat tiles). Publish.

Then the rest, in whatever order — each is independent:

3. **Authors** — at least one, for Journal Posts to reference.
4. **Categories** — a few, e.g. "Company News", "Franchise", "Careers".
5. **Journal Posts** — needs a hero image, an Author, and at least one Category to publish (those are required fields). Tick "Featured" on one post to make it the Journal page's featured story.
6. **Branches** — name, address, status, opening hours, services, hero image.
7. **Careers** — create Departments and Job Roles first, then Job Postings. A posting shows on `/careers` while its Status is "Open" and its deadline hasn't passed; tick "Featured" to put it in the Featured openings grid. Each posting gets its own page at `/careers/<slug>`.
8. **Testimonials** — tick "Featured" on 1–3 so they show on the homepage (unfeatured ones just don't appear there).
9. **Team Members** — shows on `/about`.

**Important**: content only appears on the site once you hit **Publish** — a saved draft is invisible to visitors. After publishing, refresh the page you're checking; it updates within ~60 seconds even without the webhook in Part E.

### Part D — Deploy the website (Vercel example, ~5 minutes)

1. Push this repo to GitHub if it isn't already there.
2. Go to **[vercel.com](https://vercel.com)** → **Add New → Project** → import your GitHub repo.
3. Before clicking Deploy, expand **Environment Variables** and add the same 4 values from your `.env.local`:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_REVALIDATE_SECRET`
4. Click **Deploy**. Vercel gives you a URL like `adakings-websites.vercel.app` — to use `adakings.com` instead, add it under Project Settings → Domains and follow Vercel's DNS instructions.
5. Back in **sanity.io/manage → API → CORS Origins**, add your real domain (`https://adakings.com` and/or the `.vercel.app` URL), same as Part A step 5, with "Allow credentials" checked — otherwise `/studio` will work locally but not in production.

### Part E — Instant updates (webhook, ~2 minutes, recommended)

Without this, edits still go live automatically within ~60 seconds. With it, they're instant.

1. **sanity.io/manage → your project → API → Webhooks → Create webhook**.
2. Name: anything, e.g. "Revalidate live site".
3. URL: `https://adakings.com/api/revalidate` (your real deployed domain).
4. Dataset: `production`.
5. Trigger on: Create, Update, Delete.
6. HTTP method: `POST`.
7. Secret: the exact same value you set for `SANITY_REVALIDATE_SECRET` on Vercel.
8. Save. Test it by editing and publishing anything in the Studio — the live site should reflect it within a couple of seconds.

### Part F — Optional: fully generated types

`npm run typegen` reads your live project's schema plus the queries in `sanity/lib/queries.ts` and writes `sanity.types.ts`. The repo currently ships with hand-written types in `types/sanity.ts` that mirror the schema exactly, so this is a nice-to-have upgrade once Part A–B are done, not a requirement.

### CMS architecture

- `sanity.config.ts` / `sanity.cli.ts` — Studio config, mounted at `/studio` via `app/studio/[[...tool]]/page.tsx`
- `sanity/schemaTypes/documents/` — the 9 content types (Homepage, Journal Post, Author, Category, Department / Job Role / Job Posting, Branch, Testimonial, Team Member, Site Settings)
- `sanity/schemaTypes/objects/` — reusable field groups (SEO, CTA link, opening hours, social links, nav items)
- `sanity/structure.ts` — Studio desk structure (pins the two singletons — Homepage, Site Settings — above the document lists)
- `sanity/lib/queries.ts` — GROQ queries, one per page/section's data need
- `sanity/lib/fetch.ts` — tagged, ISR-cached fetch wrapper (`sanityFetch`) used by every `lib/*.ts` data helper
- `sanity/lib/image.ts` — `urlFor()` image URL builder; `components/ui/sanity-image.tsx` renders a real Sanity image when set, falling back to the branded placeholder otherwise
- `app/api/revalidate/route.ts` — webhook target that revalidates the relevant ISR tag on publish
- `lib/*.ts` (`journal.ts`, `branches.ts`, `careers.ts`, `testimonials.ts`, `team.ts`, `homepage.ts`, `site-settings.ts`) — typed data-fetching functions consumed by pages/components; each falls back to sensible static defaults when a document hasn't been created in the Studio yet

## Project Structure

- `app/(site)/` — the marketing site's routes (About, Our Story, Branches, Menu, Catering, Franchise, Careers, Journal, Contact), sharing the Navbar/Footer layout
- `app/studio/` — embedded Sanity Studio (`/studio`), outside the `(site)` route group so it renders full-screen without site chrome
- `app/api/revalidate/` — Sanity webhook → ISR revalidation
- `sanity/` — Studio schema, GROQ queries, and fetch/image helpers (see [CMS architecture](#cms-architecture))
- `components/layout/` — Navbar, Footer, Logo
- `components/sections/home/` — homepage sections
- `components/journal/` — Journal-specific UI (post cards, featured post, search/filter, newsletter, Portable Text renderer)
- `components/ui/` — shadcn primitives + shared layout primitives (`Container`, `Section`, `PlaceholderImage`, `SanityImage`, `PageHero`)
- `lib/` — site config and typed Sanity data-fetching helpers
- `types/sanity.ts` — hand-written types mirroring the Sanity schema (swap for `sanity.types.ts` after running `npm run typegen` against a real project)
- `public/brand/` — real Adakings logo assets (copied from the Adakings Web Apps brand folder)

## Brand

- Colors: Red `#CE1126`, Gold `#D4A017`, Black `#111111`, White `#FFFFFF` — defined as CSS variables in `app/globals.css`
- Typography: Inter (`next/font/google`)
- "Order Food" buttons link out to `adakingsapp.com` — this site does not handle ordering.

## Known placeholders to replace before launch

- **Content**: every content type now lives in Sanity — nothing renders until it's created in `/studio` (falls back to the branded placeholder image / static hero copy until then). See [Going live](#going-live-full-walkthrough).
- **Photography**: pages fall back to a branded placeholder (`components/ui/placeholder-image.tsx`) wherever a Sanity image field is empty — upload real photography in the Studio to replace it, no code changes needed (`components/ui/sanity-image.tsx` handles the swap automatically).
- **Newsletter signup**: UI-only, not yet wired to an email provider (e.g. Resend, Mailchimp).
- **Contact form**: opens the visitor's email client via `mailto:` — no backend/API yet.
- **Careers**: each job page's application form saves a **Job Application** document (Studio → Careers → Applications) with the applicant's details, their PDF CV (max 4 MB), a link to the posting, a status (New → Screening → Interview → Hired, or Rejected), and HR notes. Applications use private `jobApplication.<uuid>` IDs and can only be created by the form. Requires `SANITY_API_WRITE_TOKEN`. The CV is optional but recommended in the UI. Each application triggers an email alert to `CAREERS_NOTIFY_EMAIL` (via Resend, applicant set as reply-to, CV not attached, with a link to the application in Studio). The email is sent after the response, so a mail failure never loses an application.
- **The dataset must be private** because it holds CVs, and on a public dataset anyone can list and download every uploaded file. The site reads with `SANITY_API_READ_TOKEN`, so roll out in this order: (1) put a valid Viewer token in `SANITY_API_READ_TOKEN` locally and on Vercel, (2) deploy, (3) run `npx sanity dataset visibility set production private`. Doing step 3 before steps 1–2 takes the public site down. Image URLs on cdn.sanity.io stay public either way.
