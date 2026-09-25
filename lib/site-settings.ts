import { sanityFetch } from "@/sanity/lib/fetch";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { siteConfig, mainNav as defaultMainNav, footerNav as defaultFooterNav } from "@/lib/site-config";
import type { DayHours, Geopoint, PhoneNumber, SanitySiteSettings } from "@/types/sanity";

const SITE_SETTINGS_TAG = "siteSettings";

export type ResolvedSiteSettings = {
  siteName: string;
  orderUrl: string;
  navigation: { label: string; href: string }[];
  footerNav: { title: string; items: { label: string; href: string }[] }[];
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
  };
  contactEmail: string;
  supportEmail: string;
  contactPhone: string;
  phoneNumbers: PhoneNumber[];
  whatsapp: string;
  description: string;
  longDescription: string;
  legalName: string;
  registeredAddress: string;
  gpsAddress?: Geopoint;
  googleMapsUrl: string;
  businessHours: DayHours[];
};

/**
 * Merges the Sanity `siteSettings` singleton over the static defaults in
 * lib/site-config.ts, so the site still renders correctly before an editor
 * has populated Site Settings in the Studio.
 */
export async function getSiteSettings(): Promise<ResolvedSiteSettings> {
  const settings = await sanityFetch<SanitySiteSettings | null>({
    query: siteSettingsQuery,
    tags: [SITE_SETTINGS_TAG],
  });

  return {
    siteName: settings?.siteName || siteConfig.name,
    orderUrl: settings?.orderUrl || siteConfig.orderUrl,
    navigation: settings?.navigation?.length ? settings.navigation : defaultMainNav,
    footerNav: settings?.footerNav?.length ? settings.footerNav : defaultFooterNav,
    social: {
      instagram: settings?.social?.instagram || siteConfig.social.instagram,
      facebook: settings?.social?.facebook || siteConfig.social.facebook,
      twitter: settings?.social?.twitter || siteConfig.social.twitter,
      tiktok: settings?.social?.tiktok || siteConfig.social.tiktok,
      linkedin: settings?.social?.linkedin || siteConfig.social.linkedin,
    },
    contactEmail: settings?.contactEmail || siteConfig.contact.email,
    supportEmail: settings?.supportEmail || siteConfig.contact.supportEmail,
    contactPhone: settings?.contactPhone || siteConfig.contact.phone,
    phoneNumbers: settings?.phoneNumbers?.length ? settings.phoneNumbers : [],
    whatsapp: settings?.whatsapp || siteConfig.contact.whatsapp,
    description: settings?.description || siteConfig.description,
    longDescription: settings?.longDescription || siteConfig.description,
    legalName: settings?.legalName || siteConfig.legalName,
    registeredAddress: settings?.registeredAddress || siteConfig.registeredAddress,
    gpsAddress: settings?.gpsAddress,
    googleMapsUrl: settings?.googleMapsUrl || siteConfig.googleMapsUrl,
    businessHours: settings?.businessHours?.length ? settings.businessHours : [],
  };
}
