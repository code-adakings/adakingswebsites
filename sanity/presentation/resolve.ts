import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/**
 * Maps every document type to the frontend route(s) it renders on, so the
 * Presentation tool can open the right preview URL and Visual Editing can
 * jump an editor from a clicked field straight to its document/path in
 * Studio. Kept in one place so new routes/schemas stay easy to wire up.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    homepage: defineLocations({
      locations: [{ title: "Home", href: "/" }],
    }),
    aboutPage: defineLocations({
      locations: [{ title: "About", href: "/about" }],
    }),
    ourStoryPage: defineLocations({
      locations: [{ title: "Our Story", href: "/our-story" }],
    }),
    menuPage: defineLocations({
      locations: [{ title: "Menu", href: "/menu" }],
    }),
    cateringPage: defineLocations({
      locations: [{ title: "Catering", href: "/catering" }],
    }),
    franchisePage: defineLocations({
      locations: [{ title: "Franchise", href: "/franchise" }],
    }),
    contactPage: defineLocations({
      locations: [{ title: "Contact", href: "/contact" }],
    }),
    careersPage: defineLocations({
      locations: [{ title: "Careers", href: "/careers" }],
    }),
    branchesPage: defineLocations({
      locations: [{ title: "Branches", href: "/branches" }],
    }),
    journalPage: defineLocations({
      locations: [{ title: "Journal", href: "/journal" }],
    }),
    communityImpact: defineLocations({
      locations: [{ title: "Home", href: "/" }],
      message: "Rendered in the Community Impact section on the homepage",
    }),
    whyAdakings: defineLocations({
      locations: [{ title: "Home", href: "/" }],
      message: "Rendered in the Why Adakings section on the homepage",
    }),
    siteSettings: defineLocations({
      locations: [
        { title: "Home", href: "/" },
        { title: "Contact", href: "/contact" },
      ],
      message: "Used site-wide (navigation, footer, contact details)",
    }),
    testimonial: defineLocations({
      locations: [{ title: "Home", href: "/" }],
      message: "Rendered in the Testimonials section on the homepage",
    }),
    leadership: defineLocations({
      locations: [{ title: "About", href: "/about" }],
      message: "Rendered in the Team section on the About page",
    }),
    menuCategory: defineLocations({
      locations: [{ title: "Menu", href: "/menu" }],
    }),
    menuItem: defineLocations({
      locations: [{ title: "Menu", href: "/menu" }],
    }),
    author: defineLocations({
      locations: [{ title: "Journal", href: "/journal" }],
      message: "Attributed on journal posts by this author",
    }),
    category: defineLocations({
      locations: [{ title: "Journal", href: "/journal" }],
      message: "Used to filter journal posts",
    }),
    journalPost: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || "Untitled", href: `/journal/${doc?.slug}` },
          { title: "Journal", href: "/journal" },
        ],
      }),
    }),
    branch: defineLocations({
      select: { name: "name" },
      resolve: (doc) => ({
        locations: [{ title: doc?.name || "Untitled", href: "/branches" }],
        message: "Listed on the Branches page",
      }),
    }),
    career: defineLocations({
      select: { title: "title" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Untitled", href: "/careers" }],
        message: "Listed on the Careers page",
      }),
    }),
  },
  mainDocuments: [
    { route: "/", type: "homepage" },
    { route: "/about", type: "aboutPage" },
    { route: "/our-story", type: "ourStoryPage" },
    { route: "/menu", type: "menuPage" },
    { route: "/catering", type: "cateringPage" },
    { route: "/franchise", type: "franchisePage" },
    { route: "/contact", type: "contactPage" },
    { route: "/careers", type: "careersPage" },
    { route: "/branches", type: "branchesPage" },
    { route: "/journal", type: "journalPage" },
    {
      route: "/journal/:slug",
      filter: `_type == "journalPost" && slug.current == $slug`,
      params: ({ params }) => ({ slug: params.slug }),
    },
  ],
};
