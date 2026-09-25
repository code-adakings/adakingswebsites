"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioPreviewOrigin } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { resolve } from "./sanity/presentation/resolve";
import { LendingTransitionAction } from "./sanity/lending/actions";
import { lendingPipelineTool } from "./sanity/lending/pipeline-tool";

// Lending applications are only ever created by the site's form (which
// issues the lender's private token), and settings is a fixed-id singleton.
const LENDING_TYPES = new Set(["lendingApplication", "lendingSettings"]);

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
  tools: (prev) => [...prev, lendingPipelineTool],
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => !LENDING_TYPES.has(item.templateId)),
    actions: (prev, { schemaType }) => {
      if (schemaType === "lendingApplication") {
        return [
          LendingTransitionAction,
          ...prev.filter(({ action }) => action !== "duplicate" && action !== "unpublish"),
        ];
      }
      if (schemaType === "lendingSettings") {
        return prev.filter(({ action }) => action === "publish" || action === "discardChanges");
      }
      return prev;
    },
  },
});
