export type Civil = { y: number; m: number; d: number };
export type RangeSelection = { start: string | null; end: string | null };
export type DayCell = { key: string; civil: Civil; inView: boolean };

const pad = (n: number) => String(n).padStart(2, "0");

export const toKey = (c: Civil) => `${c.y}-${pad(c.m + 1)}-${pad(c.d)}`;

export const fromKey = (key: string): Civil => {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m: m - 1, d };
};

export const toDate = (c: Civil) => new Date(c.y, c.m, c.d);

export const todayCivil = (): Civil => {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
};

export const addDays = (c: Civil, n: number): Civil => {
  const dt = new Date(c.y, c.m, c.d + n);
  return { y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate() };
};

export const addMonths = (c: Civil, n: number): Civil => {
  const dt = new Date(c.y, c.m + n, 1);
  const dim = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
  return { y: dt.getFullYear(), m: dt.getMonth(), d: Math.min(c.d, dim) };
};

export const isSameMonth = (a: Civil, b: Civil) => a.y === b.y && a.m === b.m;

export const buildWeeks = (view: Civil, weekStart: number): DayCell[] => {
  const first = new Date(view.y, view.m, 1);
  const offset = (first.getDay() - weekStart + 7) % 7;
  const start = new Date(view.y, view.m, 1 - offset);
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({
      key: toKey({ y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate() }),
      civil: { y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate() },
      inView: dt.getFullYear() === view.y && dt.getMonth() === view.m,
    });
  }
  return cells;
};

const MONDAY = 5; // 2026-01-05 is a Monday

export const weekdayLabels = (locale: string, weekStart: number): string[] =>
  Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
      new Date(2026, 0, MONDAY + i - (weekStart - 1) - (weekStart === 0 ? 7 : 0)),
    ),
  );

export const monthLabel = (c: Civil, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(toDate({ ...c, d: 1 }));

export const formatLong = (key: string, locale = "en-GB") => {
  const c = fromKey(key);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(toDate(c));
};

export const formatDayLabel = (key: string, locale = "en-GB") => {
  const c = fromKey(key);
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(toDate(c));
};

export const selectInRange = (prev: RangeSelection, key: string): RangeSelection => {
  if (!prev.start || (prev.start && prev.end)) return { start: key, end: null };
  return prev.start <= key
    ? { start: prev.start, end: key }
    : { start: key, end: prev.start };
};

export const rangeDays = (sel: RangeSelection) =>
  sel.start && sel.end
    ? Math.round(
        (toDate(fromKey(sel.end)).getTime() - toDate(fromKey(sel.start)).getTime()) / 86400000,
      )
    : 0;
