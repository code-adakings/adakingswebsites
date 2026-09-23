import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Careers",
  description: "Build your career with Adakings — kitchen, operations, and corporate roles across Ghana.",
};

const departments = [
  { name: "Kitchen & Culinary", description: "Line cooks, chefs, and kitchen leadership." },
  { name: "Branch Operations", description: "Shift leads, supervisors, and branch managers." },
  { name: "Delivery & Logistics", description: "Riders and dispatch coordinators." },
  { name: "Corporate & Support", description: "Marketing, finance, HR, and operations support." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Grow your career with Adakings"
        description="From the kitchen to branch leadership, we invest in our people and promote from within."
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Departments"
              title="Where you could work at Adakings"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {departments.map((dept) => (
                <div key={dept.name} className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold">{dept.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{dept.description}</p>
                </div>
              ))}
            </div>
            <Button
              render={<a href={`mailto:${siteConfig.contact.email}?subject=Career%20Inquiry`} />}
              className="mt-8 bg-primary text-primary-foreground hover:bg-brand-red-dark"
            >
              Send Us Your CV
            </Button>
          </div>
          <PlaceholderImage label="Team at work" className="aspect-4/3" />
        </Container>
      </Section>
    </>
  );
}
