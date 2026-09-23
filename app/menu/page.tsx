import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { menu } from "@/lib/menu";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore the full Adakings menu — jollof, grilled specialties, swallow, and more.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Menu"
        title="Bold Ghanaian flavor, every day"
        description="A preview of what's on the menu. Order through the Adakings app for the full menu and live pricing."
      />
      <Section>
        <Container className="max-w-3xl space-y-12">
          {menu.map((category) => (
            <div key={category.name}>
              <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
              <Separator className="mt-4 mb-6" />
              <div className="space-y-6">
                {category.items.map((item) => (
                  <div key={item.name}>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-muted/60 p-8 text-center">
            <p className="text-muted-foreground">
              Ready to order? Get the full menu, prices, and delivery on the Adakings app.
            </p>
            <Button
              render={<a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" />}
              className="mt-4 bg-primary text-primary-foreground hover:bg-brand-red-dark"
            >
              Order Food
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
