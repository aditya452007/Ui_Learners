"use client";

import { CheckIcon, XIcon } from "./icons";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

export interface StepItem {
  label: string;
  hint?: string;
}

export interface StepsProps {
  items: (string | StepItem)[];
  /** Zero-based index of the step you are on now (Material UI activeStep, Ant Design current). */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Pass a callback to make steps clickable. */
  onStepClick?: (index: number) => void;
  /** Zero-based index of a step rendered in the error state (Ant Design status="error"). */
  errorIndex?: number | null;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}

const SIZES = {
  sm: { circle: 28, icon: "h-3.5 w-3.5", number: "text-[11px]", label: "text-[11px]", hint: "text-[10px]" },
  md: { circle: 40, icon: "h-4 w-4", number: "text-sm", label: "text-sm", hint: "text-xs" },
  lg: { circle: 48, icon: "h-5 w-5", number: "text-base", label: "text-base", hint: "text-sm" },
} as const;

const CIRCLE_STYLE: Record<StepStatus, string> = {
  complete: "bg-indigo-600 text-white",
  current: "bg-white text-indigo-600 ring-2 ring-indigo-600 shadow-[0_0_0_5px_rgba(79,70,229,0.12)]",
  upcoming: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200",
  error: "bg-white text-red-600 ring-2 ring-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.10)]",
};

const LABEL_STYLE: Record<StepStatus, string> = {
  complete: "font-medium text-slate-700",
  current: "font-semibold text-slate-900",
  upcoming: "text-slate-400",
  error: "font-medium text-red-600",
};

export function statusOf(
  index: number,
  current: number,
  errorIndex: number | null | undefined
): StepStatus {
  if (errorIndex != null && index === errorIndex) return "error";
  if (index < current) return "complete";
  if (index === current) return "current";
  return "upcoming";
}

export function Steps({
  items,
  current,
  orientation = "horizontal",
  onStepClick,
  errorIndex = null,
  size = "md",
  ariaLabel = "Progress",
}: StepsProps) {
  const s = SIZES[size];
  const norm = items.map((it) => (typeof it === "string" ? { label: it } : it));
  const last = norm.length - 1;

  const circle = (status: StepStatus, index: number) => (
    <span
      data-part="circle"
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full transition-all duration-300 ${CIRCLE_STYLE[status]} ${
        onStepClick ? "cursor-pointer group-hover:scale-110" : ""
      }`}
      style={{ width: s.circle, height: s.circle }}
    >
      {status === "complete" ? (
        <CheckIcon className={s.icon} />
      ) : status === "error" ? (
        <XIcon className={s.icon} />
      ) : (
        <span className={`font-semibold ${s.number}`}>{index + 1}</span>
      )}
    </span>
  );

  const stepName = (label: string, i: number, status: StepStatus) =>
    `Step ${i + 1} of ${norm.length}: ${label}${
      status === "complete" ? " (complete)" : status === "current" ? " (current)" : ""
    }`;

  const connectorClass = (i: number) => {
    const st = statusOf(i, current, errorIndex);
    if (st === "complete") return "bg-indigo-500";
    if (st === "error") return "bg-red-400";
    return "bg-slate-200";
  };

  if (orientation === "horizontal") {
    return (
      <ol data-part="ol" aria-label={ariaLabel} className="flex w-full items-start">
        {norm.map((item, i) => {
          const status = statusOf(i, current, errorIndex);
          const inner = (
            <>
              {circle(status, i)}
              <p
                data-part="label"
                className={`mt-2 text-center leading-snug ${LABEL_STYLE[status]} ${s.label}`}
              >
                {item.label}
              </p>
            </>
          );
          return (
            <li
              key={i}
              aria-current={status === "current" ? "step" : undefined}
              className="relative flex flex-1 flex-col items-center"
            >
              {onStepClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  aria-label={stepName(item.label, i, status)}
                  className="group flex flex-col items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {inner}
                </button>
              ) : (
                inner
              )}
              {i < last && (
                <span
                  data-part="connector"
                  aria-hidden="true"
                  className={`absolute h-[3px] rounded-full transition-colors duration-500 ${connectorClass(i)}`}
                  style={{ top: s.circle / 2 - 1, left: "50%", width: "100%" }}
                />
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol data-part="ol" aria-label={ariaLabel} className="flex flex-col">
      {norm.map((item, i) => {
        const status = statusOf(i, current, errorIndex);
        return (
          <li
            key={i}
            aria-current={status === "current" ? "step" : undefined}
            className="relative flex items-start"
          >
            <div className="flex shrink-0 flex-col items-center self-stretch">
              {onStepClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  aria-label={stepName(item.label, i, status)}
                  className="group rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {circle(status, i)}
                </button>
              ) : (
                circle(status, i)
              )}
              {i < last && (
                <span
                  data-part="connector"
                  aria-hidden="true"
                  className={`mt-2 w-[3px] flex-1 rounded-full transition-colors duration-500 ${connectorClass(i)}`}
                />
              )}
            </div>
            <div className={`pl-4 pt-1.5 ${i < last ? "pb-10" : ""}`}>
              <p data-part="label" className={`leading-snug ${LABEL_STYLE[status]} ${s.label}`}>
                {item.label}
              </p>
              {item.hint && (
                <p className={`mt-0.5 ${s.hint} text-slate-400`}>{item.hint}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
