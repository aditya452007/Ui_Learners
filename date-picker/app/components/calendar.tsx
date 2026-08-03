"use client";

import { useEffect, useRef, useState } from "react";
import {
  type Civil,
  type RangeSelection,
  addDays,
  addMonths,
  buildWeeks,
  formatDayLabel,
  fromKey,
  monthLabel,
  toKey,
  weekdayLabels,
} from "../lib/civil";
import { ChevronLeft, ChevronRight } from "./icons";

type CalendarProps = {
  view: Civil;
  onViewChange: (v: Civil) => void;
  selection: RangeSelection;
  onSelectDay: (key: string) => void;
  todayKey: string;
  weekStart?: number;
  locale?: string;
  autoFocus?: boolean;
  onEscape?: () => void;
};

const BASE =
  "size-10 cursor-pointer text-sm transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2";

export function Calendar({
  view,
  onViewChange,
  selection,
  onSelectDay,
  todayKey,
  weekStart = 1,
  locale = "en-GB",
  autoFocus = true,
  onEscape,
}: CalendarProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cells = buildWeeks(view, weekStart);
  const [focusKey, setFocusKey] = useState<string>(() => {
    const t = cells.find((c) => c.key === todayKey) ?? cells.find((c) => c.inView);
    return (t ?? cells[0]).key;
  });

  const prevFocusKey = useRef(focusKey);
  useEffect(() => {
    if (!autoFocus && focusKey === prevFocusKey.current) return;
    prevFocusKey.current = focusKey;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-key="${focusKey}"]`)
      ?.focus({ preventScroll: true });
  }, [focusKey, autoFocus]);

  const changeMonth = (delta: number) => {
    const next = addMonths(view, delta);
    onViewChange(next);
    setFocusKey(toKey(addMonths(fromKey(focusKey), delta)));
  };

  const moveFocus = (deltaDays: number) => {
    const target = addDays(fromKey(focusKey), deltaDays);
    setFocusKey(toKey(target));
    if (target.y !== view.y || target.m !== view.m)
      onViewChange({ y: target.y, m: target.m, d: 1 });
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(7);
        break;
      case "PageUp":
        e.preventDefault();
        changeMonth(-1);
        break;
      case "PageDown":
        e.preventDefault();
        changeMonth(1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelectDay(focusKey);
        break;
      case "Escape":
        onEscape?.();
        break;
    }
  };

  const rangeOn = selection.start !== null && selection.end !== null;
  const rows = Array.from({ length: 6 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

  return (
    <div className="w-[312px] select-none">
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => changeMonth(-1)}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div aria-live="polite" className="text-sm font-semibold tracking-tight text-slate-900">
          {monthLabel(view, locale)}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => changeMonth(1)}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-readonly="true"
        onKeyDown={onGridKeyDown}
        className="grid grid-cols-7"
      >
        <div role="row" className="contents">
          {weekdayLabels(locale, weekStart).map((w) => (
            <div
              role="columnheader"
              key={w}
              className="grid h-8 place-items-center text-[11px] font-medium uppercase tracking-wide text-slate-400"
            >
              {w}
            </div>
          ))}
        </div>
        {rows.map((row, r) => (
          <div role="row" className="contents" key={r}>
            {row.map((cell) => {
              const isToday = cell.key === todayKey;
              const isStart = selection.start === cell.key;
              const isEnd = selection.end === cell.key;
              const isMiddle =
                rangeOn &&
                (selection.start ?? "") < cell.key &&
                cell.key < (selection.end ?? "");
              const isEndpoint = isStart || isEnd;

              let cls = BASE + " text-slate-700 hover:bg-indigo-50 hover:text-indigo-700";
              if (!cell.inView) cls = BASE + " text-slate-300 hover:bg-transparent";
              if (isMiddle) cls = BASE + " bg-indigo-100 text-indigo-900 hover:bg-indigo-100";
              if (isStart && !isEnd) cls = BASE + " rounded-l-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-600";
              if (isEnd && !isStart) cls = BASE + " rounded-r-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-600";
              if (isStart && isEnd) cls = BASE + " rounded-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-600";
              if (isToday && !isEndpoint)
                cls = BASE + " font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-400";

              return (
                <div
                  role="gridcell"
                  key={cell.key}
                  aria-selected={isEndpoint}
                  aria-current={isToday ? "date" : undefined}
                  className="contents"
                >
                  <button
                    type="button"
                    data-key={cell.key}
                    tabIndex={focusKey === cell.key ? 0 : -1}
                    aria-label={
                      formatDayLabel(cell.key, locale) + (isToday ? ", today" : "")
                    }
                    onClick={() => {
                      setFocusKey(cell.key);
                      onSelectDay(cell.key);
                    }}
                    className={cls}
                  >
                    {cell.civil.d}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
