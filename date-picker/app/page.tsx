import { Anatomy } from "./components/anatomy";
import { BookingDemo } from "./components/booking-demo";
import { CalendarIcon, ChevronDown } from "./components/icons";

function PartCard({
  num,
  title,
  caption,
  visual,
}: {
  num: string;
  title: string;
  caption: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <div className="my-4">{visual}</div>
      <p className="mt-auto text-xs leading-relaxed text-slate-500">{caption}</p>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{kicker}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Date Picker</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Also called: <span className="font-medium text-slate-700">calendar popover</span>,{" "}
          <span className="font-medium text-slate-700">date range picker</span>, calendar dropdown,
          month view. A date field — the trigger — pops open a floating month grid — the popover.
          The chosen day carries <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">aria-selected</code>.
        </p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <PartCard
          num="1"
          title="Trigger — the date field"
          caption="Click it and the calendar pops open. The field itself holds the value."
          visual={
            <div className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 shadow-sm">
              <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">20 Jul — 28 Jul 2026</span>
              <ChevronDown className="ml-auto h-3 w-3 text-slate-400" />
            </div>
          }
        />
        <PartCard
          num="2"
          title="Popover — the floating calendar"
          caption="It floats above the page in its own layer. Esc or a click outside dismisses it."
          visual={
            <div className="w-full">
              <div className="h-1 w-1/2 rounded bg-slate-300" />
              <div className="mx-auto mt-1.5 w-4/5 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
                <div className="mx-auto h-1.5 w-1/3 rounded bg-slate-200" />
                <div className="mt-1.5 grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-sm ${i === 4 ? "bg-indigo-600" : "bg-slate-100"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        />
        <PartCard
          num="3"
          title='Grid — role="grid" of days'
          caption="Arrows move by day and week, PageUp/PageDown by month, Enter selects."
          visual={
            <div className="grid w-fit grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`size-5 rounded-md border ${
                    i === 3
                      ? "border-indigo-300 bg-indigo-100"
                      : i === 4
                        ? "border-indigo-600 bg-indigo-600"
                        : i === 5
                          ? "border-indigo-400 bg-white"
                          : "border-slate-200 bg-white"
                  }`}
                />
              ))}
            </div>
          }
        />
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="Anatomy"
          title="Every part, named"
          note="This is a real, working date picker — click days and the labels chase your selection."
        />
        <div className="mt-6">
          <Anatomy />
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          kicker="In the wild"
          title="A booking range"
          note="Pick two days and watch which modifier each day becomes."
        />
        <div className="mt-6">
          <BookingDemo />
        </div>
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-400">
        Anatomy names follow react-day-picker modifiers — button_previous / button_next,
        range_start, range_middle, range_end, today — and the ARIA model of a date grid
        (role="grid", aria-selected). Built by hand: no date library, dates stay yyyy-mm-dd
        civil strings end to end.
      </footer>
    </main>
  );
}
