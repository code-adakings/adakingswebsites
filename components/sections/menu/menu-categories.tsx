import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { MenuItemCard } from "@/components/sections/menu/menu-item-card";
import type { MenuCategorySection } from "@/lib/menu";

export function MenuCategories({ categories }: { categories: MenuCategorySection[] }) {
  return (
    <>
      {categories.map((category) => (
        <Section key={category.slug} id={category.slug} className="scroll-mt-32">
          <Container>
            <SectionHeading title={category.title} description={category.description} />
            <Separator className="mt-6 mb-8 sm:mt-8 sm:mb-10" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {category.items.map((item) => (
                <MenuItemCard key={item.slug} item={item} />
              ))}
            </div>
          </Container>
        </Section>
      ))}
    </>
  );
}
