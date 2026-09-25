export const siteConfig = {
  name: "Adakings",
  legalName: "Adakings Franchise Corporation Ltd.",
  url: "https://adakings.com",
  description:
    "Adakings is a premium Ghanaian black-owned fast food and hospitality company — discover our story, branches, catering, franchise opportunities, and careers.",
  orderUrl: "https://adakingsapp.com",
  social: {
    instagram: "https://instagram.com/adakings",
    facebook: "https://facebook.com/adakings",
    twitter: "https://twitter.com/adakings",
    tiktok: "https://tiktok.com/@adakings",
    linkedin: "https://linkedin.com/company/adakings",
  },
  contact: {
    email: "hello@adakings.com",
    supportEmail: "support@adakings.com",
    phone: "+233 000 000 000",
    whatsapp: "+233000000000",
  },
  registeredAddress: "",
  googleMapsUrl: "",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Branches", href: "/branches" },
  { label: "Catering", href: "/catering" },
  { label: "Franchise", href: "/franchise" },
  { label: "Careers", href: "/careers" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Our Story", href: "/our-story" },
      { label: "Branches", href: "/branches" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Menu", href: "/menu" },
      { label: "Catering", href: "/catering" },
      { label: "Franchise", href: "/franchise" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
