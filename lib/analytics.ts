export type AnalyticsEventName =
  | "order_click"
  | "franchise_submit"
  | "career_apply"
  | "catering_quote"
  | "branch_call"
  | "branch_maps"
  | "new_frontiers_submit";

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, params?: AnalyticsEventParams): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);
}
