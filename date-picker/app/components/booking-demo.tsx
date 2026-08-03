"use client";

import { useEffect, useState } from "react";
import {
  type RangeSelection,
  formatLong,
  rangeDays,
  todayCivil,
  toKey,
} from "../lib/civil";
import { DatePicker } from "./date-picker";
import { HouseIcon } from "./icons";

type ChipStyle = "start" | "middle" | "today";

const CHIP_CLS: Record<ChipStyle, string> = {
  start: "bg-indigo-600 text-white",
  middle: "bg-indigo-100 text-indigo-900",
  today: "bg-white text-slate-800 ring-1 ring-indigo-400",
};

function ModifierChip({
  label,
  value,
  note,
  style,
}: {
  label: string;
  value: string;
  note: string;
  style: ChipStyle;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${CHIP_CLS[style]}`}>
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] font-semibold opacity-90">{label}</p>
        <p className="truncate text-[10px] opacity-70">{note}</p>
      </div>
      <p className="shrink-0 font-mono text-xs font-semibold">{value}</p>
    </div>
  );
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
    {children}
  </kbd>
);

export function BookingDemo() {
  const [selection, setSelection] = useState<RangeSelection>({ start: null, end: null });
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(toKey(todayCivil()));
  }, []);

  const nights = rangeDays(selection);
  const total = nights * 140;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-5">
          <div className="grid size-11 place-items-center rounded-xl bg-indigo-600 text-white">
            <HouseIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Casa del Lago</p>
            <p className="text-xs text-slate-500">Lake cabins · $140 / night</p>
          </div>
        </div>

        <DatePicker
          selection={selection}
          onSelectionChange={setSelection}
          placeholder="Check-in — Check-out"
          inputLabel="Stay dates"
          className="w-full"
        />

        <dl className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Check-in</dt>
            <dd className="font-medium text-slate-900">{selection.start ? formatLong(selection.start) : "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Check-out</dt>
            <dd className="font-medium text-slate-900">{selection.end ? formatLong(selection.end) : "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Nights</dt>
            <dd className="font-medium text-slate-900">{selection.end ? nights : "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-1.5">
            <dt className="font-medium text-slate-700">Total</dt>
            <dd className="font-semibold text-slate-900">{selection.end ? `$${total.toLocaleString("en-US")}` : "—"}</dd>
          </div>
        </dl>

        <button
          type="button"
          disabled={!selection.end}
          className="mt-5 w-full cursor-pointer rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-default disabled:opacity-40"
        >
          Reserve cabin
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Live modifiers {today ? `— today is ${today}` : ""}
          </p>
          <div className="mt-3 space-y-2">
            <ModifierChip label="today" value={today ?? "—"} note="outlined — independent of selection" style="today" />
            <ModifierChip label="range_start" value={selection.start ?? "…"} note="solid — first day clicked" style="start" />
            <ModifierChip label="range_middle" value={selection.start && selection.end ? `${nights - 1} days` : "…"} note="pale tint — every day between" style="middle" />
            <ModifierChip label="range_end" value={selection.end ?? "…"} note="solid — second day clicked" style="start" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 font-mono text-[11px] leading-relaxed shadow-sm">
          <p className="text-slate-600">
            <span className="text-slate-400">value</span> ={" "}
            <span className="text-indigo-700">
              "{selection.start ?? "……"} … {selection.end ?? "……"}"
            </span>
          </p>
          <p className="mt-1 text-slate-400">
            // civil dates as yyyy-mm-dd strings — never Date.parse, no UTC off-by-one
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Keyboard model
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="flex gap-1">
                <Kbd>←</Kbd>
                <Kbd>→</Kbd>
              </span>
              move by day
            </li>
            <li className="flex items-center gap-2">
              <span className="flex gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </span>
              move by week
            </li>
            <li className="flex items-center gap-2">
              <span className="flex gap-1">
                <Kbd>PgUp</Kbd>
                <Kbd>PgDn</Kbd>
              </span>
              move by month
            </li>
            <li className="flex items-center gap-2">
              <Kbd>Enter</Kbd> selects the focused day
            </li>
            <li className="flex items-center gap-2">
              <Kbd>Esc</Kbd> closes the popover
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
