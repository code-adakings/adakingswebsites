"use client";

import * as React from "react";
import { trackEvent, type AnalyticsEventName, type AnalyticsEventParams } from "@/lib/analytics";

export function TrackClick({
  event,
  params,
  children,
}: {
  event: AnalyticsEventName;
  params?: AnalyticsEventParams;
  children: React.ReactElement<{ onClick?: (event: React.MouseEvent) => void }>;
}) {
  return React.cloneElement(children, {
    onClick: (clickEvent: React.MouseEvent) => {
      trackEvent(event, params);
      children.props.onClick?.(clickEvent);
    },
  });
}
