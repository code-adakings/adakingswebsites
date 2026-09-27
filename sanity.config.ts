"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioPreviewOrigin } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { resolve } from "./sanity/presentation/resolve";
import { LendingOverrideAction, LendingTransitionAction } from "./sanity/lending/actions";
import { lendingPipelineTool } from "./sanity/lending/pipeline-tool";

// Lending applications are only ever created by the site's form (which
// issues the lender's private token), and settings is a fixed-id singleton.
const LENDING_TYPES = new Set(["lendingApplication", "lendingSettings"]);
// Job applications are only created by the job page form, which gives them a
// private `jobApplication.<uuid>` id. Studio-created or duplicated copies would
// get a plain id and bypass that.
const FORM_ONLY_TYPES = new Set([...LENDING_TYPES, "jobApplication"]);

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
    newDocumentOptions: (prev) => prev.filter((item) => !FORM_ONLY_TYPES.has(item.templateId)),
    actions: (prev, { schemaType }) => {
      if (schemaType === "lendingApplication") {
        return [
          LendingTransitionAction,
          // Status changes only via the actions above; the stock ones could
          // copy, unpublish, or delete a legal record.
          ...prev.filter(({ action }) => action === "publish" || action === "discardChanges"),
          LendingOverrideAction,
        ];
      }
      if (schemaType === "jobApplication") {
        return prev.filter(({ action }) => action !== "duplicate");
      }
      if (schemaType === "lendingSettings") {
        return prev.filter(({ action }) => action === "publish" || action === "discardChanges");
      }
      return prev;
    },
  },
});
