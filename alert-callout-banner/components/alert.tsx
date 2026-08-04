import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  CheckCircleIcon,
  CloseIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  WarningTriangleIcon,
} from "@/components/icons";

export type Severity = "info" | "success" | "warning" | "error";
export type AlertVariant = "standard" | "outlined" | "filled";
export type LiveRegion = "alert" | "status" | "none";

const SEVERITY_ICONS: Record<Severity, ComponentType<SVGProps<SVGSVGElement>>> = {
  info: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: WarningTriangleIcon,
  error: ErrorCircleIcon,
};

const SEVERITY_TONES: Record<
  Severity,
  { icon: string; standard: string; outlined: string; filled: string }
> = {
  info: {
    icon: "text-sky-600",
    standard: "bg-sky-50/70 text-sky-900 border-sky-600/15 border-s-sky-600",
    outlined: "bg-surface text-sky-900 border-sky-600/40 border-s-sky-600",
    filled: "bg-sky-600 text-white",
  },
  success: {
    icon: "text-emerald-600",
    standard: "bg-emerald-50/70 text-emerald-900 border-emerald-600/15 border-s-emerald-600",
    outlined: "bg-surface text-emerald-900 border-emerald-600/40 border-s-emerald-600",
    filled: "bg-emerald-600 text-white",
  },
  warning: {
    icon: "text-amber-500",
    standard: "bg-amber-50/80 text-amber-900 border-amber-600/20 border-s-amber-500",
    outlined: "bg-surface text-amber-900 border-amber-600/40 border-s-amber-500",
    filled: "bg-amber-500 text-white",
  },
  error: {
    icon: "text-red-500",
    standard: "bg-red-50/70 text-red-900 border-red-600/15 border-s-red-600",
    outlined: "bg-surface text-red-900 border-red-600/40 border-s-red-600",
    filled: "bg-red-600 text-white",
  },
};

export interface AlertProps {
  severity?: Severity;
  variant?: AlertVariant;
  title?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  liveRegion?: LiveRegion;
  className?: string;
  id?: string;
}

export function Alert({
  severity = "warning",
  variant = "standard",
  title,
  children,
  action,
  onClose,
  closeLabel = "Dismiss",
  liveRegion = "none",
  className = "",
  id,
}: AlertProps) {
  const Icon = SEVERITY_ICONS[severity];
  const tone = SEVERITY_TONES[severity];
  const surface =
    variant === "filled"
      ? tone.filled
      : variant === "outlined"
        ? tone.outlined
        : tone.standard;
  const iconColor = variant === "filled" ? "text-white/90" : tone.icon;

  return (
    <div
      id={id}
      role={liveRegion === "none" ? undefined : liveRegion}
      className={`relative flex items-start gap-3 rounded-xl border-s-4 px-4 py-3.5 text-sm leading-relaxed shadow-sm ${
        variant === "filled" ? "border-0" : "border"
      } ${surface} ${className}`}
    >
      <span aria-hidden="true" className={`mt-0.5 shrink-0 ${iconColor}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <div className="min-w-0 flex-1">
        {title != null && <p className="font-semibold">{title}</p>}
        <div className={title != null ? "opacity-90" : undefined}>{children}</div>
      </div>

      {action != null && (
        <div className="flex shrink-0 items-center pt-0.5 font-semibold underline decoration-1 underline-offset-4 opacity-90 transition hover:opacity-100">
          {action}
        </div>
      )}

      {onClose != null && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className={`-mr-1 -mt-1 shrink-0 rounded-md p-1 transition ${
            variant === "filled"
              ? "text-white/80 hover:bg-white/15 hover:text-white"
              : "text-current/50 hover:bg-black/5 hover:text-current"
          }`}
        >
          <CloseIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
