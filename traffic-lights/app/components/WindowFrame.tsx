"use client";

import { ReactNode } from "react";
import TrafficLights from "./TrafficLights";

interface WindowFrameProps {
  /** Window title */
  title: string;
  /** Traffic lights props */
  trafficLightsProps?: React.ComponentProps<typeof TrafficLights>;
  /** Window content */
  children: ReactNode;
  /** Additional className */
  className?: string;
  /** Whether to show the title bar */
  showTitleBar?: boolean;
  /** Custom title bar content (replaces title) */
  titleBarContent?: ReactNode;
}

export default function WindowFrame({
  title,
  trafficLightsProps,
  children,
  className = "",
  showTitleBar = true,
  titleBarContent,
}: WindowFrameProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-xl bg-white border border-zinc-200 ${className}`}
      style={{ width: "100%", maxWidth: "900px" }}
    >
      {showTitleBar && (
        <div
          className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200"
          style={{ height: 44 }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <TrafficLights {...trafficLightsProps} />
            {titleBarContent || (
              <span className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">
                {title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2" />
        </div>
      )}
      <div className="bg-white">{children}</div>
    </div>
  );
}