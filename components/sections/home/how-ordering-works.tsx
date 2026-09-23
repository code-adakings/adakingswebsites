import { Smartphone, ChefHat, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const steps = [
  {
    icon: Smartphone,
    title: "Order on the app",
    description: "Browse the menu and place your order on the Adakings app in minutes.",
  },
  {
    icon: ChefHat,
    title: "We cook it fresh",
    description: "Your meal is prepared fresh to order at your nearest branch.",
  },
  {
    icon: Truck,
    title: "Delivered or ready for pickup",
    description: "Track your order in real time, delivered to your door or ready to collect.",
  },
];

export function HowOrderingWorks() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Ordering Adakings is simple"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="relative text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-6" />
              </div>
              <span className="mt-4 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button
            size="lg"
            render={<a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" />}
            className="h-11 bg-primary px-6 text-base text-primary-foreground hover:bg-brand-red-dark"
          >
            Order Now
          </Button>
        </div>
      </Container>
    </Section>
  );
}
