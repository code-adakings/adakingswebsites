import {
  DashboardIcon,
  HomeIcon,
  CogIcon,
  InfoOutlineIcon,
  BookIcon,
  UlistIcon,
  CalendarIcon,
  RocketIcon,
  EnvelopeIcon,
  CaseIcon,
  HeartIcon,
  SparklesIcon,
  DocumentsIcon,
  DocumentTextIcon,
  PinIcon,
  UserIcon,
  UsersIcon,
  TagIcon,
  TagsIcon,
  BasketIcon,
  CommentIcon,
  LockIcon,
} from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";
import { singletonTypes } from "./schemaTypes";

const singleton = (
  S: Parameters<StructureResolver>[0],
  id: string,
  title: string,
  icon: React.ComponentType,
) =>
  S.listItem()
    .title(title)
    .id(id)
    .icon(icon)
    .child(S.document().schemaType(id).documentId(id));

// Collection document types placed explicitly below — kept in sync with the
// fallback catch-all so nothing new silently disappears from the sidebar.
const explicitCollectionTypes = new Set([
  "journalPost",
  "author",
  "category",
  "career",
  "branch",
  "testimonial",
  "leadership",
  "menuCategory",
  "menuItem",
  "privateLandingPage",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Dashboard")
        .icon(DashboardIcon)
        .child(
          S.list()
            .title("Dashboard")
            .items([
              singleton(S, "homepage", "Homepage", HomeIcon),
              singleton(S, "siteSettings", "Site Settings", CogIcon),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton(S, "homepage", "Homepage", HomeIcon),
              singleton(S, "aboutPage", "About", InfoOutlineIcon),
              singleton(S, "cateringPage", "Catering", CalendarIcon),
              singleton(S, "contactPage", "Contact", EnvelopeIcon),
              S.divider(),
              singleton(S, "ourStoryPage", "Our Story", BookIcon),
              singleton(S, "whyAdakings", "Why Adakings", SparklesIcon),
              singleton(S, "communityImpact", "Community Impact", HeartIcon),
              S.documentTypeListItem("testimonial").title("Testimonials").icon(CommentIcon),
            ]),
        ),
      S.listItem()
        .title("Journal")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Journal")
            .items([
              singleton(S, "journalPage", "Journal Page Settings", DocumentsIcon),
              S.documentTypeListItem("journalPost").title("Blog Posts").icon(DocumentTextIcon),
              S.documentTypeListItem("author").title("Authors").icon(UserIcon),
              S.documentTypeListItem("category").title("Categories").icon(TagIcon),
            ]),
        ),
      S.listItem()
        .title("Careers")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Careers")
            .items([
              singleton(S, "careersPage", "Careers Page Settings", CaseIcon),
              S.documentTypeListItem("career").title("Open Roles").icon(CaseIcon),
            ]),
        ),
      singleton(S, "franchisePage", "Franchise", RocketIcon),
      S.listItem()
        .title("Restaurant")
        .icon(PinIcon)
        .child(
          S.list()
            .title("Restaurant")
            .items([
              singleton(S, "branchesPage", "Branches Page Settings", PinIcon),
              S.documentTypeListItem("branch").title("Branches").icon(PinIcon),
              S.documentTypeListItem("menuCategory").title("Menu Categories").icon(TagsIcon),
              S.documentTypeListItem("menuItem").title("Menu Items").icon(BasketIcon),
              singleton(S, "menuPage", "Menu Page Settings", UlistIcon),
            ]),
        ),
      S.documentTypeListItem("leadership").title("Leadership").icon(UsersIcon),
      S.divider(),
      S.documentTypeListItem("privateLandingPage")
        .title("Private Landing Pages")
        .icon(LockIcon),
      S.divider(),
      singleton(S, "siteSettings", "Settings", CogIcon),
      // Safety net: surfaces any future document type that hasn't been
      // explicitly placed above yet, so nothing silently disappears.
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() ?? "";
        return !singletonTypes.has(id) && !explicitCollectionTypes.has(id);
      }),
    ]);
