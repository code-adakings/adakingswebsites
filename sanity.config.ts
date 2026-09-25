"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioPreviewOrigin } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { resolve } from "./sanity/presentation/resolve";

export default defineConfig({
  basePath: "/studio",
  name: "adakings",
  title: "Adakings CMS",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        initial: studioPreviewOrigin ? `${studioPreviewOrigin}/` : "/",
        previewMode: {
          enable: "/api/draft",
        },
      },
    }),
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
});
