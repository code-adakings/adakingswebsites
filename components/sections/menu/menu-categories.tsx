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
            <Separator className="mt-8 mb-10" />
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
