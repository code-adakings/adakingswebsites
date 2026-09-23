import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

const initiatives = [
  {
    title: "Local sourcing",
    description: "We partner with Ghanaian farmers and suppliers wherever possible.",
  },
  {
    title: "Youth training programs",
    description: "Hands-on culinary and hospitality training for young people.",
  },
  {
    title: "Community giving",
    description: "Supporting local causes in every community we operate in.",
  },
];

export function CommunityImpact() {
  return (
    <Section className="bg-muted/40">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Community Impact"
            title="Investing in the communities we serve"
            description="Being black-owned and Ghanaian isn't just our identity — it's a responsibility we take seriously."
          />
          <dl className="mt-8 space-y-6">
            {initiatives.map((item) => (
              <div key={item.title} className="border-l-2 border-primary pl-4">
                <dt className="font-semibold">{item.title}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <PlaceholderImage label="Community initiative" className="aspect-4/3" />
      </Container>
    </Section>
  );
}
