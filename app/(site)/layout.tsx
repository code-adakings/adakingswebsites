import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/consent/cookie-consent";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/structured-data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, { isEnabled: isDraftMode }] = await Promise.all([
    getSiteSettings(),
    draftMode(),
  ]);

  return (
    <>
      <CookieConsent />
      <JsonLd data={[organizationSchema(settings), websiteSchema(settings)]} />
      <Navbar nav={settings.navigation} orderUrl={settings.orderUrl} />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={settings.siteName}
        footerNav={settings.footerNav}
        description={settings.description}
        legalName={settings.legalName}
        social={settings.social}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        whatsapp={settings.whatsapp}
      />
      {isDraftMode ? <VisualEditing /> : null}
    </>
  );
}
