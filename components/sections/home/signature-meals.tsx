import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { getFeaturedMenuItems, getMenuPage } from "@/lib/menu";
import { urlFor } from "@/sanity/lib/image";

const priceFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  minimumFractionDigits: 0,
});

export async function SignatureMeals() {
  const [{ signatureMealsHeading }, meals] = await Promise.all([
    getMenuPage(),
    getFeaturedMenuItems(4),
  ]);

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={signatureMealsHeading.eyebrow}
            title={signatureMealsHeading.title ?? ""}
            description={signatureMealsHeading.description}
          />
          <Button
            variant="outline"
            render={<a href="/menu" />}
            className="hidden shrink-0 sm:inline-flex"
          >
            View Full Menu
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {meals.map((meal) => (
            <div key={meal.slug} className="group">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={meal.image?.asset ? urlFor(meal.image).url() : meal.fallbackSrc ?? ""}
                  alt={meal.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{meal.name}</h3>
                <span className="shrink-0 text-sm font-semibold text-primary">
                  {priceFormatter.format(meal.price)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{meal.description}</p>
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
