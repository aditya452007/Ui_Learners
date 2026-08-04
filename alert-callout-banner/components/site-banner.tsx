import type { ReactNode } from "react";
import { CloseIcon, MegaphoneIcon } from "@/components/icons";
import type { LiveRegion } from "@/components/alert";

export type BannerTone = "info" | "warning" | "emergency";

const BANNER_TONES: Record<BannerTone, string> = {
  info: "bg-sky-700 text-sky-50",
  warning: "bg-amber-400 text-amber-950",
  emergency: "bg-red-600 text-red-50",
};

export interface SiteBannerProps {
  tone?: BannerTone;
  children: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  liveRegion?: LiveRegion;
  id?: string;
  className?: string;
}

export function SiteBanner({
  tone = "info",
  children,
  action,
  onClose,
  closeLabel = "Dismiss",
  liveRegion = "none",
  id,
  className = "",
}: SiteBannerProps) {
  return (
    <div
      id={id}
      role={liveRegion === "none" ? undefined : liveRegion}
      className={`text-sm leading-relaxed ${BANNER_TONES[tone]} ${className}`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-start gap-3 px-5 py-2.5 sm:items-center sm:px-8">
        <MegaphoneIcon className="mt-0.5 h-4 w-4 shrink-0 opacity-80 sm:mt-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">{children}</div>
        {action != null && (
          <div className="shrink-0 font-semibold underline decoration-1 underline-offset-4 opacity-90 transition hover:opacity-100">
            {action}
          </div>
        )}
        {onClose != null && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-1 shrink-0 rounded-md p-1 opacity-60 transition hover:bg-black/10 hover:opacity-100"
          >
            <CloseIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
