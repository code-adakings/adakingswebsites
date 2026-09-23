import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { Button } from "@/components/ui/button";

const meals = [
  {
    name: "Adakings Signature Jollof",
    description: "Smoky, slow-cooked jollof rice with our house spice blend.",
  },
  {
    name: "Crispy Fried Chicken",
    description: "Marinated overnight, fried fresh to order, always crispy.",
  },
  {
    name: "Grilled Tilapia Platter",
    description: "Whole grilled tilapia with pepper sauce and banku or rice.",
  },
];

export function SignatureMeals() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Fan Favorites"
            title="Signature meals worth the trip"
            description="The dishes our customers order again and again — made fresh, every time."
          />
          <Button
            variant="outline"
            render={<a href="/menu" />}
            className="hidden shrink-0 sm:inline-flex"
          >
            View Full Menu
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <div key={meal.name} className="group">
              <PlaceholderImage
                label={meal.name}
                className="aspect-4/3 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <h3 className="mt-4 text-lg font-semibold">{meal.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {meal.description}
              </p>
            </div>
          ))}
        </div>

        <Button variant="outline" render={<a href="/menu" />} className="mt-8 w-full sm:hidden">
          View Full Menu
        </Button>
      </Container>
    </Section>
  );
}
