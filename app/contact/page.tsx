import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Adakings — general inquiries, catering, and franchise questions.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about catering, franchising, or anything else? Reach out."
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Branches</p>
                <a href="/branches" className="text-sm text-muted-foreground hover:text-foreground">
                  Find your nearest Adakings
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border p-6 sm:p-8">
            <ContactForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
