import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import type { ResolvedSiteSettings } from "@/lib/site-settings";

export function Footer({
  siteName,
  footerNav,
  description,
  legalName,
  social,
  contactEmail,
  contactPhone,
  whatsapp,
}: Pick<
  ResolvedSiteSettings,
  "siteName" | "footerNav" | "description" | "legalName" | "social" | "contactEmail" | "contactPhone" | "whatsapp"
>) {
  const socialLinks = [
    { label: "Instagram", href: social.instagram, icon: Instagram },
    { label: "Facebook", href: social.facebook, icon: Facebook },
    { label: "Twitter", href: social.twitter, icon: Twitter },
    { label: "LinkedIn", href: social.linkedin, icon: Linkedin },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  return (
    <footer className="bg-brand-black text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" aria-label={`${siteName} home`} className="inline-flex items-center gap-2.5">
              <Image
                src="/brand/adakings-logo-icon.png"
                alt=""
                width={36}
                height={36}
                className="h-8 w-8"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                {siteName}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              {description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="transition-colors hover:text-white"
                >
                  {contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {contactPhone}
                </a>
              </li>
              {whatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <MessageCircle className="size-3.5" />
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} {legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
