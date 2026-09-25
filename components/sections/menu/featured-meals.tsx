import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { MenuItemCard } from "@/components/sections/menu/menu-item-card";
import { getFeaturedMenuItems } from "@/lib/menu";

export async function FeaturedMeals() {
  const meals = await getFeaturedMenuItems(4);

  if (!meals.length) return null;

  return (
    <Section id="featured" className="scroll-mt-32">
      <Container>
        <SectionHeading eyebrow="Featured" title="Fan favorites" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4">
          {meals.map((meal) => (
            <MenuItemCard key={meal.slug} item={{ ...meal, featured: true }} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
