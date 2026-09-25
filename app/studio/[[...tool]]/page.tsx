import { headers } from "next/headers";
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default async function StudioPage() {
  // On studio.adakings.com, middleware.ts rewrites "/" to "/studio" without
  // changing the browser URL, so Studio's router must think it's mounted at
  // "/" (not "/studio") to generate links that match what's in the address bar.
  const host = (await headers()).get("host") || "";
  const studioConfig = host === "studio.adakings.com" ? { ...config, basePath: "/" } : config;

  return <NextStudio config={studioConfig} />;
}
