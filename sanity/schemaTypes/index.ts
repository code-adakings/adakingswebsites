import type { SchemaTypeDefinition } from "sanity";

import { seo } from "./objects/seo";
import { ctaLink } from "./objects/ctaLink";
import { dayHours } from "./objects/dayHours";
import { socialLinks } from "./objects/socialLinks";
import { navItem, footerNavGroup } from "./objects/navItem";
import { pageHero } from "./objects/pageHero";
import { richTextBlock } from "./objects/richTextBlock";

import { homepage } from "./documents/homepage";
import { journalPost } from "./documents/journalPost";
import { author } from "./documents/author";
import { category } from "./documents/category";
import { career } from "./documents/career";
import { branch } from "./documents/branch";
import { testimonial } from "./documents/testimonial";
import { leadership } from "./documents/leadership";
import { menuCategory } from "./documents/menuCategory";
import { menuItem } from "./documents/menuItem";
import { siteSettings } from "./documents/siteSettings";
import { aboutPage } from "./documents/aboutPage";
import { ourStoryPage } from "./documents/ourStoryPage";
import { menuPage } from "./documents/menuPage";
import { cateringPage } from "./documents/cateringPage";
import { franchisePage } from "./documents/franchisePage";
import { contactPage } from "./documents/contactPage";
import { careersPage } from "./documents/careersPage";
import { communityImpact } from "./documents/communityImpact";
import { whyAdakings } from "./documents/whyAdakings";
import { journalPage } from "./documents/journalPage";
import { branchesPage } from "./documents/branchesPage";
import { privateLandingPage } from "./documents/privateLandingPage";
import { newFrontiersLead } from "./documents/newFrontiersLead";
import { lendingApplication } from "./documents/lendingApplication";
import { lendingSettings } from "./documents/lendingSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Singleton page documents
    homepage,
    siteSettings,
    aboutPage,
    ourStoryPage,
    menuPage,
    cateringPage,
    franchisePage,
    contactPage,
    careersPage,
    communityImpact,
    whyAdakings,
    journalPage,
    branchesPage,
    // Repeatable documents
    journalPost,
    author,
    category,
    career,
    branch,
    testimonial,
    leadership,
    menuCategory,
    menuItem,
    privateLandingPage,
    newFrontiersLead,
    lendingApplication,
    lendingSettings,
    // Reusable objects
    seo,
    ctaLink,
    dayHours,
    socialLinks,
    navItem,
    footerNavGroup,
    pageHero,
    richTextBlock,
  ],
};

export const singletonTypes = new Set([
  "homepage",
  "siteSettings",
  "aboutPage",
  "ourStoryPage",
  "menuPage",
  "cateringPage",
  "franchisePage",
  "contactPage",
  "careersPage",
  "communityImpact",
  "whyAdakings",
  "journalPage",
  "branchesPage",
]);
