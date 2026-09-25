import { Bike, ShoppingBag, ChefHat, Utensils, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import type { BranchService } from "@/types/sanity";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  delivery: Bike,
  pickup: ShoppingBag,
  catering: ChefHat,
};

export function BranchServices({
  items,
  eyebrow,
  title,
  description,
}: {
  items: BranchService[];
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  if (items.length === 0) return null;

  return (
    <Section className="bg-muted/40">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          className="mx-auto"
        />
        <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {items.map(({ icon, title: itemTitle, description: itemDescription }) => {
            const Icon = SERVICE_ICONS[icon] ?? Utensils;
            return (
              <div key={itemTitle} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{itemTitle}</h3>
                {itemDescription ? (
                  <p className="mt-2 text-sm text-muted-foreground">{itemDescription}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
