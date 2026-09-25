import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

export const ogImageSize = { width: 1200, height: 630 } as const;
export const ogImageContentType = "image/png" as const;

let cachedLogoDataUri: string | undefined;

function getLogoDataUri(): string {
  if (!cachedLogoDataUri) {
    const filePath = path.join(process.cwd(), "public/brand/adakings-logo-icon.png");
    const file = fs.readFileSync(filePath);
    cachedLogoDataUri = `data:image/png;base64,${file.toString("base64")}`;
  }
  return cachedLogoDataUri;
}

export function renderBrandOgImage({
  eyebrow,
  title,
  customImageUrl,
}: {
  eyebrow?: string;
  title: string;
  customImageUrl?: string;
}) {
  if (customImageUrl) {
    return (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customImageUrl}
          width={ogImageSize.width}
          height={ogImageSize.height}
          style={{ objectFit: "cover" }}
          alt=""
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "80px",
        backgroundColor: "#111111",
        backgroundImage: "linear-gradient(135deg, #111111 0%, #1a1a1a 55%, #2a0a0d 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getLogoDataUri()} width={64} height={53} alt="" />
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#ffffff", letterSpacing: 2 }}>
          {siteConfig.name.toUpperCase()}
        </div>
      </div>
      {eyebrow ? (
        <div
          style={{
            display: "flex",
            marginTop: 64,
            fontSize: 26,
            fontWeight: 600,
            color: "#d4a017",
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          marginTop: 16,
          fontSize: 60,
          fontWeight: 800,
          color: "#ffffff",
          lineHeight: 1.15,
          maxWidth: 980,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", marginTop: 48, width: 120, height: 8, backgroundColor: "#ce1126", borderRadius: 4 }} />
    </div>
  );
}
