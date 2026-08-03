"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Civil,
  type RangeSelection,
  formatLong,
  selectInRange,
  todayCivil,
  toKey,
} from "../lib/civil";
import { Calendar } from "./calendar";
import { CalendarIcon, ChevronDown } from "./icons";

type DatePickerProps = {
  selection: RangeSelection;
  onSelectionChange: (s: RangeSelection) => void;
  defaultOpen?: boolean;
  lockOpen?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  inputLabel?: string;
  onViewChange?: (v: Civil) => void;
  className?: string;
};

export function DatePicker({
  selection,
  onSelectionChange,
  defaultOpen = false,
  lockOpen = false,
  autoFocus = true,
  placeholder = "Pick a date range",
  inputLabel = "Choose dates",
  onViewChange,
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [today, setToday] = useState<Civil | null>(null);
  const [view, setView] = useState<Civil>(() => todayCivil());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setToday(todayCivil());
  }, []);

  useEffect(() => {
    if (!open || lockOpen) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, lockOpen]);

  const hasRange = selection.start !== null && selection.end !== null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={inputLabel}
        onClick={() => {
          if (!lockOpen) setOpen((o) => !o);
        }}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm shadow-sm transition-colors hover:border-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
        <span className={hasRange ? "font-medium text-slate-900" : "text-slate-400"}>
          {hasRange ? `${formatLong(selection.start!)} — ${formatLong(selection.end!)}` : placeholder}
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && today && (
        <div
          role="dialog"
          aria-label={inputLabel}
          className="absolute left-0 top-full z-20 mt-2 w-full min-w-[312px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-300/50"
        >
          <Calendar
            view={view}
            onViewChange={(v) => {
              setView(v);
              onViewChange?.(v);
            }}
            selection={selection}
            onSelectDay={(k) => onSelectionChange(selectInRange(selection, k))}
            todayKey={toKey(today)}
            autoFocus={autoFocus}
            onEscape={lockOpen ? undefined : () => setOpen(false)}
          />
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => onSelectionChange({ start: null, end: null })}
              disabled={!selection.start}
              className="cursor-pointer text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 disabled:cursor-default disabled:opacity-40"
            >
              Clear dates
            </button>
            <span className="font-mono text-[11px] text-slate-400">
              {selection.start ?? "······"} → {selection.end ?? "······"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
