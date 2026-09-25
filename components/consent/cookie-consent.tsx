"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";

const CONSENT_STORAGE_KEY = "adakings-cookie-consent";

type ConsentValue = "accepted" | "declined";

function readStoredConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(readStoredConsent());
    setHydrated(true);
  }, []);

  function decide(value: ConsentValue) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // localStorage unavailable (private browsing, blocked storage) — consent
      // still applies for the current session via component state.
    }
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" ? <AnalyticsScripts /> : null}
      {hydrated && consent === null ? (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80 sm:p-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              We use cookies to understand how you use Adakings.com and to improve your
              experience. You can accept or decline non-essential cookies at any time.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={() => decide("declined")}>
                Decline
              </Button>
              <Button size="sm" onClick={() => decide("accepted")}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
