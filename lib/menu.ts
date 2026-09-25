import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allMenuCategoriesQuery,
  allMenuItemsQuery,
  featuredMenuItemsQuery,
  menuPageQuery,
} from "@/sanity/lib/queries";
import { siteConfig } from "@/lib/site-config";
import type {
  SanityImage,
  SanityMenuCategory,
  SanityMenuItem,
  SanityMenuPage,
  Seo,
} from "@/types/sanity";

const MENU_PAGE_TAG = "menuPage";
const MENU_ITEM_TAG = "menuItem";
const MENU_CATEGORY_TAG = "menuCategory";

export const priceFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 0,
});

export type SignatureMealData = {
  name: string;
  badge?: string;
  description?: string;
  image?: SanityImage;
  fallbackSrc?: string;
};

export type FeaturedMenuItemData = SanityMenuItem & { fallbackSrc?: string };

const FALLBACK_FEATURED_MENU_ITEMS: FeaturedMenuItemData[] = [
  {
    slug: "chek-chek",
    name: "Chek Chek",
    description:
      "The ultimate all-in-one meal — fried rice or jollof served with chicken, egg, baked beans, salad, and our signature chilli mayo.",
    price: 65,
    fallbackSrc: "/media/products/chek-chek.png",
  },
  {
    slug: "classic-assorted",
    name: "Classic Assorted",
    description:
      "Our best-selling stir-fried rice or jollof, loaded with chicken, gizzard, sausage, egg, and fresh vegetables.",
    price: 55,
    fallbackSrc: "/media/products/classic-assorted.png",
  },
  {
    slug: "premium",
    name: "Premium",
    description:
      "Rich assorted fried rice or jollof served with our signature crispy chicken, fresh coleslaw, and our house chilli sauce.",
    price: 60,
    fallbackSrc: "/media/products/premium.png",
  },
  {
    slug: "loaded-fries",
    name: "Loaded Fries",
    description:
      "Golden fries fully loaded with chicken, gizzard, sausage, creamy coleslaw, and spicy sauce.",
    price: 45,
    fallbackSrc: "/media/products/loaded-fries.png",
  },
];

const FALLBACK_HERO: NonNullable<SanityMenuPage["hero"]> = {
  eyebrow: "Menu",
  title: "Bold Ghanaian flavor, every day",
  description:
    "A preview of what's on the menu. Order through the Adakings app for the full menu and live pricing.",
};

const FALLBACK_SIGNATURE_HEADING: NonNullable<SanityMenuPage["signatureMealsHeading"]> = {
  eyebrow: "4 Signature Meals",
  title: "Built for foodies",
  description: "Fast, filling, and worth every cedi — our four most-ordered meals.",
};

const FALLBACK_SIGNATURE_MEALS: SignatureMealData[] = [
  {
    name: "Chek Chek",
    badge: "Best Seller",
    description:
      "The ultimate all-in-one meal — fried rice or jollof served with chicken, egg, baked beans, salad, and our signature chilli mayo.",
    fallbackSrc: "/media/products/chek-chek.png",
  },
  {
    name: "Classic Assorted",
    badge: "Most Popular",
    description:
      "Our best-selling stir-fried rice or jollof, loaded with chicken, gizzard, sausage, egg, and fresh vegetables.",
    fallbackSrc: "/media/products/classic-assorted.png",
  },
  {
    name: "Premium",
    badge: "Best Value",
    description:
      "Rich assorted fried rice or jollof served with our signature crispy chicken, fresh coleslaw, and our house chilli sauce.",
    fallbackSrc: "/media/products/premium.png",
  },
  {
    name: "Loaded Fries",
    badge: "Highly Recommended",
    description:
      "Golden fries fully loaded with chicken, gizzard, sausage, creamy coleslaw, and spicy sauce.",
    fallbackSrc: "/media/products/loaded-fries.png",
  },
];

const FALLBACK_CATEGORIES: NonNullable<SanityMenuPage["categories"]> = [
  {
    name: "Rice & Sides",
    items: [
      { name: "Adakings Signature Jollof", description: "Smoky, slow-cooked jollof rice with our house spice blend." },
      { name: "Fried Rice", description: "Wok-tossed rice with mixed vegetables and your choice of protein." },
      { name: "Waakye", description: "Rice and beans served with shito, gari, and boiled egg." },
    ],
  },
  {
    name: "Chicken & Grill",
    items: [
      { name: "Crispy Fried Chicken", description: "Marinated overnight, fried fresh to order, always crispy." },
      { name: "Grilled Chicken", description: "Char-grilled chicken with pepper sauce." },
      { name: "Grilled Tilapia Platter", description: "Whole grilled tilapia with pepper sauce and banku or rice." },
    ],
  },
  {
    name: "Swallow & Soup",
    items: [
      { name: "Banku & Okro Stew", description: "Fermented corn and cassava dough with fresh okro stew." },
      { name: "Fufu & Light Soup", description: "Pounded cassava and plantain with spicy light soup." },
    ],
  },
  {
    name: "Drinks & Extras",
    items: [
      { name: "Sobolo", description: "Chilled hibiscus drink with ginger and pineapple." },
      { name: "Fresh Juice", description: "Seasonal fruit juice, made fresh daily." },
    ],
  },
];

const FALLBACK_CTA = { label: "Order Food", href: siteConfig.orderUrl };

export async function getMenuPage(): Promise<{
  hero: NonNullable<SanityMenuPage["hero"]>;
  signatureMealsHeading: NonNullable<SanityMenuPage["signatureMealsHeading"]>;
  signatureMeals: SignatureMealData[];
  categories: NonNullable<SanityMenuPage["categories"]>;
  cta: NonNullable<SanityMenuPage["cta"]>;
  seo?: Seo;
}> {
  const page = await sanityFetch<SanityMenuPage | null>({
    query: menuPageQuery,
    tags: [MENU_PAGE_TAG],
  });

  return {
    hero: page?.hero?.title ? page.hero : FALLBACK_HERO,
    signatureMealsHeading: page?.signatureMealsHeading?.title
      ? page.signatureMealsHeading
      : FALLBACK_SIGNATURE_HEADING,
    signatureMeals: page?.signatureMeals?.length ? page.signatureMeals : FALLBACK_SIGNATURE_MEALS,
    categories: page?.categories?.length ? page.categories : FALLBACK_CATEGORIES,
    cta: page?.cta?.href ? page.cta : FALLBACK_CTA,
    seo: page?.seo,
  };
}

export async function getFeaturedMenuItems(limit = 4): Promise<FeaturedMenuItemData[]> {
  const items = await sanityFetch<SanityMenuItem[]>({
    query: featuredMenuItemsQuery,
    tags: [MENU_ITEM_TAG],
  });

  return (items.length ? items : FALLBACK_FEATURED_MENU_ITEMS).slice(0, limit);
}

const FALLBACK_MENU_CATEGORIES: SanityMenuCategory[] = [
  { slug: "rice-sides", title: "Rice & Sides", description: "Jollof, fried rice, waakye, and the sides that finish a plate." },
  { slug: "chicken-grill", title: "Chicken & Grill", description: "Crispy, grilled, and char-flamed proteins." },
  { slug: "swallow-soup", title: "Swallow & Soup", description: "Traditional swallows paired with rich, slow-cooked soups." },
  { slug: "drinks-extras", title: "Drinks & Extras", description: "Chilled drinks and extras to round out your order." },
];

const FALLBACK_MENU_ITEMS: SanityMenuItem[] = [
  {
    slug: "adakings-signature-jollof",
    name: "Adakings Signature Jollof",
    description: "Smoky, slow-cooked jollof rice with our house spice blend.",
    price: 40,
    category: { slug: "rice-sides", title: "Rice & Sides" },
  },
  {
    slug: "fried-rice",
    name: "Fried Rice",
    description: "Wok-tossed rice with mixed vegetables and your choice of protein.",
    price: 40,
    category: { slug: "rice-sides", title: "Rice & Sides" },
  },
  {
    slug: "waakye",
    name: "Waakye",
    description: "Rice and beans served with shito, gari, and boiled egg.",
    price: 35,
    category: { slug: "rice-sides", title: "Rice & Sides" },
  },
  {
    slug: "crispy-fried-chicken",
    name: "Crispy Fried Chicken",
    description: "Marinated overnight, fried fresh to order, always crispy.",
    price: 30,
    featured: true,
    category: { slug: "chicken-grill", title: "Chicken & Grill" },
  },
  {
    slug: "grilled-chicken",
    name: "Grilled Chicken",
    description: "Char-grilled chicken with pepper sauce.",
    price: 30,
    category: { slug: "chicken-grill", title: "Chicken & Grill" },
  },
  {
    slug: "grilled-tilapia-platter",
    name: "Grilled Tilapia Platter",
    description: "Whole grilled tilapia with pepper sauce and banku or rice.",
    price: 70,
    category: { slug: "chicken-grill", title: "Chicken & Grill" },
  },
  {
    slug: "banku-okro-stew",
    name: "Banku & Okro Stew",
    description: "Fermented corn and cassava dough with fresh okro stew.",
    price: 45,
    category: { slug: "swallow-soup", title: "Swallow & Soup" },
  },
  {
    slug: "fufu-light-soup",
    name: "Fufu & Light Soup",
    description: "Pounded cassava and plantain with spicy light soup.",
    price: 45,
    category: { slug: "swallow-soup", title: "Swallow & Soup" },
  },
  {
    slug: "sobolo",
    name: "Sobolo",
    description: "Chilled hibiscus drink with ginger and pineapple.",
    price: 15,
    category: { slug: "drinks-extras", title: "Drinks & Extras" },
  },
  {
    slug: "fresh-juice",
    name: "Fresh Juice",
    description: "Seasonal fruit juice, made fresh daily.",
    price: 15,
    category: { slug: "drinks-extras", title: "Drinks & Extras" },
  },
];

export type MenuCategorySection = SanityMenuCategory & {
  items: SanityMenuItem[];
};

export async function getFullMenu(): Promise<MenuCategorySection[]> {
  const [categories, items] = await Promise.all([
    sanityFetch<SanityMenuCategory[]>({
      query: allMenuCategoriesQuery,
      tags: [MENU_CATEGORY_TAG],
    }),
    sanityFetch<SanityMenuItem[]>({
      query: allMenuItemsQuery,
      tags: [MENU_ITEM_TAG],
    }),
  ]);

  const resolvedCategories = categories.length ? categories : FALLBACK_MENU_CATEGORIES;
  const resolvedItems = items.length ? items : FALLBACK_MENU_ITEMS;

  return resolvedCategories
    .map((category) => ({
      ...category,
      items: resolvedItems.filter((item) => item.category?.slug === category.slug),
    }))
    .filter((category) => category.items.length > 0);
}
