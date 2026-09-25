import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/lib/token";

/**
 * Entered from Sanity Studio (previewUrl.previewMode.enable) or the
 * sanity-plugin-iframe-pane. next-sanity validates the request's
 * sanity-preview-secret against the project before enabling Draft Mode, so
 * this route never trusts a client-supplied secret directly.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
});
