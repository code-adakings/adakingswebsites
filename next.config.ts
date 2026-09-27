import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Rendered server-side for the lending agreement PDF; its font/layout
  // engines don't survive bundling, so load it from node_modules as-is.
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    // Job applications post a CV (max 4 MB, see lib/job-application.ts) through
    // a Server Action; the default 1 MB limit would reject it. Vercel caps
    // function bodies at 4.5 MB regardless, which is why the CV limit is 4 MB.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  // pdfkit loads its built-in fonts (Helvetica, Times…) through a dynamic
  // `require("#standard-fonts/*")` the file tracer can't follow. Without this
  // they're missing on Vercel and the PDF route 500s with an empty body.
  outputFileTracingIncludes: {
    "/new-frontiers/d/*/pdf": ["./node_modules/pdfkit/js/standard-fonts/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter],
  },
});

export default withMDX(nextConfig);
