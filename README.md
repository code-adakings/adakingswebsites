# Adakings Websites

The official corporate website for Adakings Franchise Corporation Ltd. (`adakings.com`) — brand, marketing, recruitment, franchise, catering, and editorial content. This is a standalone project, independent of the Adakings Web Apps ordering platform (`adakingsapp.com`).

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config, see `app/globals.css`)
- shadcn/ui (`base-nova` style, on `@base-ui/react` primitives — components use a `render` prop instead of `asChild`)
- Framer Motion for subtle animation
- MDX for the Journal (editorial/blog), content in `content/journal/*.mdx`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/` — routes (About, Our Story, Branches, Menu, Catering, Franchise, Careers, Journal, Contact)
- `components/layout/` — Navbar, Footer, Logo
- `components/sections/home/` — homepage sections
- `components/journal/` — Journal-specific UI (post cards, featured post, search/filter, newsletter)
- `components/ui/` — shadcn primitives + shared layout primitives (`Container`, `Section`, `PlaceholderImage`, `PageHero`)
- `content/journal/` — MDX article source files
- `lib/` — site config, nav, branches, menu, testimonials, authors, journal data helpers
- `public/brand/` — real Adakings logo assets (copied from the Adakings Web Apps brand folder)

## Brand

- Colors: Red `#CE1126`, Gold `#D4A017`, Black `#111111`, White `#FFFFFF` — defined as CSS variables in `app/globals.css`
- Typography: Inter (`next/font/google`)
- "Order Food" buttons link out to `adakingsapp.com` — this site does not handle ordering.

## Known placeholders to replace before launch

- **Photography**: all imagery is currently a branded placeholder (`components/ui/placeholder-image.tsx`). Swap for authentic photography of Ghanaian people/environments.
- **Testimonials** (`lib/testimonials.ts`): placeholder quotes — replace with real, sourced customer testimonials.
- **Newsletter signup**: UI-only, not yet wired to an email provider (e.g. Resend, Mailchimp).
- **Contact form**: opens the visitor's email client via `mailto:` — no backend/API yet.
- **Careers**: no ATS/job board integration yet — currently routes to an email inquiry.
