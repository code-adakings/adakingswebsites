import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Navigation, Phone, Twitter } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { getContactPage } from "@/lib/contact";
import { getSiteSettings } from "@/lib/site-settings";
import { formatOpeningHours } from "@/lib/branches";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/lib/structured-data";

const FALLBACK_DESCRIPTION = "Get in touch with Adakings — general inquiries, catering, and franchise questions.";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPage();
  return buildMetadata({ path: "/contact", title: "Contact", description: FALLBACK_DESCRIPTION, seo });
}

export default async function ContactPage() {
  const [{ hero, branchesBlock }, settings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);

  const businessHours = formatOpeningHours(settings.businessHours);
  const socialLinks = [
    { label: "Instagram", href: settings.social.instagram, icon: Instagram },
    { label: "Facebook", href: settings.social.facebook, icon: Facebook },
    { label: "Twitter", href: settings.social.twitter, icon: Twitter },
    { label: "LinkedIn", href: settings.social.linkedin, icon: Linkedin },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold">{settings.siteName}</p>
              {settings.legalName ? (
                <p className="text-sm text-muted-foreground">{settings.legalName}</p>
              ) : null}
              {settings.description ? (
                <p className="mt-2 text-sm text-muted-foreground text-pretty">{settings.description}</p>
              ) : null}
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <a href={`mailto:${settings.contactEmail}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {settings.supportEmail ? (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">Support</p>
                  <a href={`mailto:${settings.supportEmail}`} className="text-sm text-muted-foreground hover:text-foreground">
                    {settings.supportEmail}
                  </a>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {settings.contactPhone}
                </a>
                {settings.phoneNumbers.length ? (
                  <ul className="mt-1 space-y-1">
                    {settings.phoneNumbers.map((phone) => (
                      <li key={phone.number}>
                        <a
                          href={`tel:${phone.number.replace(/\s+/g, "")}`}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {phone.label ? `${phone.label}: ` : ""}
                          {phone.number}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {settings.whatsapp ? (
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {settings.whatsapp}
                  </a>
                </div>
              </div>
            ) : null}

            {settings.registeredAddress ? (
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">Registered Address</p>
                  <p className="text-sm text-muted-foreground text-pretty">{settings.registeredAddress}</p>
                </div>
              </div>
            ) : null}

            {settings.gpsAddress ? (
              <div className="flex items-start gap-3">
                <Navigation className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">GPS Address</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.gpsAddress.lat}, {settings.gpsAddress.lng}
                  </p>
                </div>
              </div>
            ) : null}

            {businessHours ? (
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-sm text-muted-foreground">{businessHours}</p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium">{branchesBlock.heading}</p>
                <Link href="/branches" className="text-sm text-muted-foreground hover:text-foreground">
                  {branchesBlock.linkLabel}
                </Link>
              </div>
            </div>

            {settings.googleMapsUrl ? (
              <Button render={<a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" />}>
                Get Directions
              </Button>
            ) : null}

            {socialLinks.length ? (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="rounded-2xl border border-border p-6 sm:p-8">
            <ContactForm contactEmail={settings.contactEmail} />
          </div>
        </Container>
      </Section>
    </>
  );
}
