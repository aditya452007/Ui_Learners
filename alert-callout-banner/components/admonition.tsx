import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  ErrorCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  LightbulbIcon,
  WarningTriangleIcon,
} from "@/components/icons";

export type AdmonitionType = "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";

export const ADMONITION_TYPES: AdmonitionType[] = [
  "NOTE",
  "TIP",
  "IMPORTANT",
  "WARNING",
  "CAUTION",
];

const ADMONITION_TONES: Record<
  AdmonitionType,
  { icon: ComponentType<SVGProps<SVGSVGElement>>; iconColor: string; text: string }
> = {
  NOTE: { icon: InfoCircleIcon, iconColor: "text-sky-600", text: "text-sky-900" },
  TIP: { icon: LightbulbIcon, iconColor: "text-emerald-600", text: "text-emerald-900" },
  IMPORTANT: { icon: ExclamationCircleIcon, iconColor: "text-violet-600", text: "text-violet-900" },
  WARNING: { icon: WarningTriangleIcon, iconColor: "text-amber-500", text: "text-amber-900" },
  CAUTION: { icon: ErrorCircleIcon, iconColor: "text-red-500", text: "text-red-900" },
};

const ADMONITION_TINT: Record<AdmonitionType, string> = {
  NOTE: "bg-sky-50/60 border-sky-600/20 border-s-sky-500",
  TIP: "bg-emerald-50/60 border-emerald-600/20 border-s-emerald-500",
  IMPORTANT: "bg-violet-50/60 border-violet-600/20 border-s-violet-500",
  WARNING: "bg-amber-50/70 border-amber-600/20 border-s-amber-500",
  CAUTION: "bg-red-50/60 border-red-600/20 border-s-red-500",
};

export const ADMONITION_MARKDOWN: Record<AdmonitionType, string> = {
  NOTE: "> [!NOTE]\n> Useful information that users should know, even when skimming content.",
  TIP: "> [!TIP]\n> Helpful advice for doing things better or more easily.",
  IMPORTANT: "> [!IMPORTANT]\n> Key information users need to know to achieve their goal.",
  WARNING: "> [!WARNING]\n> Urgent info that needs immediate user attention to avoid problems.",
  CAUTION: "> [!CAUTION]\n> Advises about risks or negative outcomes of certain actions.",
};

export interface AdmonitionProps {
  type?: AdmonitionType;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Admonition({
  type = "NOTE",
  title,
  children,
  className = "",
}: AdmonitionProps) {
  const tone = ADMONITION_TONES[type];
  const Icon = tone.icon;

  return (
    <aside
      className={`rounded-lg border border-s-[3px] px-4 py-3.5 text-sm leading-relaxed ${ADMONITION_TINT[type]} ${tone.text} ${className}`}
    >
      <p className="mb-1.5 flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em]">
        <Icon className={`h-4 w-4 ${tone.iconColor}`} aria-hidden="true" />
        <span>{title ?? type}</span>
      </p>
      <div className="opacity-90">{children}</div>
    </aside>
  );
}
