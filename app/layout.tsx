import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/site-settings";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ce1126",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.description,
    alternates: { canonical: "/" },
    icons: {
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#ce1126" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
      type: "website",
      title: settings.siteName,
      description: settings.description,
      url: siteConfig.url,
      siteName: settings.siteName,
      locale: "en_GH",
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
