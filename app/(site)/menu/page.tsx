import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { MenuCategoryNav } from "@/components/sections/menu/menu-category-nav";
import { FeaturedMeals } from "@/components/sections/menu/featured-meals";
import { MenuCategories } from "@/components/sections/menu/menu-categories";
import { WhyAdakings } from "@/components/sections/home/why-adakings";
import { FinalCta } from "@/components/sections/home/final-cta";
import { getFullMenu, getMenuPage } from "@/lib/menu";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION = "Explore the full Adakings menu — jollof, grilled specialties, swallow, and more.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getMenuPage();
  return buildMetadata({ path: "/menu", title: "Menu", description: FALLBACK_DESCRIPTION, seo });
}

export default async function MenuPage() {
  const [{ hero, cta }, categories] = await Promise.all([getMenuPage(), getFullMenu()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Menu", path: "/menu" },
        ])}
      />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
      <MenuCategoryNav categories={categories} />
      <FeaturedMeals />
      <MenuCategories categories={categories} />
      <WhyAdakings />
      <FinalCta
        heading="Ready to order?"
        description="Get the full menu, live pricing, and delivery on the Adakings app."
        primaryCta={cta}
        secondaryCta={{ label: "Find a Branch", href: "/branches" }}
      />
    </>
  );
}
