import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export const metadata: Metadata = {
  title: "Franchise",
  description: "Franchise with Adakings and bring our proven fast-food model to your community.",
};

const steps = [
  { title: "Inquire", description: "Tell us about you and your target market." },
  { title: "Discovery", description: "We review your application and discuss the model together." },
  { title: "Training", description: "Hands-on training on operations, recipes, and standards." },
  { title: "Launch", description: "Open your branch with our full support behind you." },
];

export default function FranchisePage() {
  return (
    <>
      <PageHero
        eyebrow="Franchise"
        title="Bring Adakings to your community"
        description="Join a growing network of franchise partners building something that lasts."
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <PlaceholderImage label="Franchise branch storefront" className="aspect-4/3 lg:order-2" />
          <div className="lg:order-1">
            <SectionHeading
              eyebrow="Why Franchise With Us"
              title="A proven system, built for growth"
              description="Every franchise partner gets our recipes, operations playbook, and hands-on training — so a new branch opens with the standard our customers already trust."
            />
            <Button
              render={<a href="/contact" />}
              className="mt-6 bg-primary text-primary-foreground hover:bg-brand-red-dark"
            >
              Start Your Franchise Inquiry
            </Button>
          </div>
        </Container>
      </Section>
      <Section className="bg-muted/40">
        <Container>
          <SectionHeading eyebrow="The Process" title="How franchising works" align="center" className="mx-auto" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
