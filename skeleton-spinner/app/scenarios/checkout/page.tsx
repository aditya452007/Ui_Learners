"use client";

import { useRef, useState } from "react";
import { ScenarioNav, Spinner, TopBar } from "../../components/ui";

type PayState = "idle" | "processing" | "success" | "error";

export default function CheckoutPage() {
  const [pay, setPay] = useState<PayState>("idle");
  const [saving, setSaving] = useState(false);
  const [decline, setDecline] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPay = () => {
    if (pay === "processing") return;
    if (timer.current) clearTimeout(timer.current);
    setPay("processing");
    timer.current = setTimeout(() => {
      setPay(decline ? "error" : "success");
    }, 2200);
  };

  const saveAddress = () => {
    if (saving) return;
    setSaving(true);
    setTimeout(() => setSaving(false), 1400);
  };

  const reset = () => setPay("idle");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
          Scenario 2 · Spinner · detached action
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Checkout where Pay has no shape to preview
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
          <strong className="font-semibold text-foreground">Why it fits here:</strong>{" "}
          paying is a detached operation — there is no “coming card” to outline,
          only a wait. An inline spinner inside the button keeps context (“your
          €84.50 is being charged”), blocks double-submits, then yields to a
          receipt or a clear error. Faster to understand, impossible to
          double-pay.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
          {/* order + form */}
          <section className="rounded-3xl border border-border bg-surface p-6 shadow-[0_8px_30px_rgba(28,25,23,0.06)]">
            <h2 className="text-base font-semibold">Order summary</h2>
            <div className="mt-4 space-y-3">
              {[
                { t: "Fjord kayak rental — 2 days", d: "Geiranger · incl. drysuits", p: "€58.00" },
                { t: "Floating sauna session", d: "Aker Brygge · 90 min, 4 guests", p: "€26.50" },
              ].map((i) => (
                <div
                  key={i.t}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-alt/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{i.t}</p>
                    <p className="text-[12.5px] text-text-muted">{i.d}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{i.p}</p>
                </div>
              ))}
              <div className="flex items-center justify-between px-1 pt-1 text-sm">
                <span className="text-text-muted">Total due today</span>
                <span className="text-lg font-semibold tabular-nums">€84.50</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12.5px] font-medium">Email for receipt</span>
                <input
                  defaultValue="marit@example.no"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition placeholder:text-text-faint focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                />
              </label>
              <label className="block">
                <span className="text-[12.5px] font-medium">Card</span>
                <input
                  defaultValue="4242 4242 4242 4242"
                  inputMode="numeric"
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 font-mono text-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-border bg-surface-alt/60 px-4 py-3">
              <div>
                <p className="text-[13px] font-medium">Billing address</p>
                <p className="text-[12.5px] text-text-muted">
                  Skippergata 22, 0154 Oslo
                </p>
              </div>
              <button
                onClick={saveAddress}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent disabled:opacity-70"
              >
                {saving && <Spinner size={14} label="Saving address…" />}
                {saving ? "Saving…" : "Save address"}
              </button>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px] text-text-muted">
              <input
                type="checkbox"
                checked={decline}
                onChange={(e) => setDecline(e.target.checked)}
                className="size-4 accent-teal-700"
              />
              Simulate a declined card (shows the error state replacing the spinner)
            </label>
          </section>

          {/* payment panel */}
          <section
            aria-busy={pay === "processing"}
            className="flex flex-col rounded-3xl border border-border bg-stone-950 p-6 text-white shadow-[0_8px_30px_rgba(28,25,23,0.18)]"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Secure payment
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums">€84.50</p>
            <p className="mt-1 text-[13px] text-white/60">
              Charged once. Never twice — the button locks while working.
            </p>

            <div className="mt-6 flex-1">
              {pay === "idle" && (
                <div className="animate-fade-in">
                  <button
                    onClick={startPay}
                    className="w-full rounded-2xl bg-teal-500 py-3.5 text-[15px] font-semibold text-teal-950 transition hover:bg-teal-400"
                  >
                    Pay €84.50
                  </button>
                  <p className="mt-3 text-center text-[12.5px] text-white/50">
                    Inline spinner appears here — same button, same size.
                  </p>
                </div>
              )}

              {pay === "processing" && (
                <div className="animate-fade-in">
                  <button
                    disabled
                    aria-disabled="true"
                    className="flex w-full cursor-wait items-center justify-center gap-2.5 rounded-2xl bg-teal-500/80 py-3.5 text-[15px] font-semibold text-teal-950"
                  >
                    <Spinner
                      size={18}
                      label="Processing payment…"
                      trackClass="text-teal-900/25"
                      arcClass="text-teal-950"
                    />
                    Processing…
                  </button>
                  <div className="mt-4 rounded-2xl bg-white/5 p-3.5 text-[12.5px] leading-relaxed text-white/70">
                    <span role="status">Contacting your bank… do not close.</span>
                    <span className="mt-1 block font-mono text-[11px] text-white/40">
                      role=&quot;status&quot; announces politely · focus stays put
                    </span>
                  </div>
                </div>
              )}

              {pay === "success" && (
                <div className="animate-pop-in rounded-2xl bg-teal-500/15 p-5 text-center">
                  <span className="mx-auto grid size-11 place-items-center rounded-full bg-teal-400 text-lg font-bold text-teal-950">
                    ✓
                  </span>
                  <p className="mt-2 font-semibold">Payment confirmed</p>
                  <p className="mt-1 text-[13px] text-white/65">
                    Receipt sent to marit@example.no · ref FJ-2941
                  </p>
                  <button
                    onClick={reset}
                    className="mt-4 w-full rounded-xl border border-white/20 py-2 text-[13px] font-medium transition hover:bg-white/10"
                  >
                    Start over
                  </button>
                </div>
              )}

              {pay === "error" && (
                <div className="animate-pop-in rounded-2xl bg-red-500/15 p-5 text-center">
                  <span className="mx-auto grid size-11 place-items-center rounded-full bg-red-400 text-lg font-bold text-red-950">
                    !
                  </span>
                  <p className="mt-2 font-semibold">Card declined</p>
                  <p className="mt-1 text-[13px] text-white/65">
                    No charge made. Check the card number and try again.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-4 w-full rounded-xl bg-white py-2 text-[13px] font-semibold text-stone-900 transition hover:bg-stone-200"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4" aria-live="polite">
              <p className="font-mono text-[11px] text-white/45">
                {pay === "processing"
                  ? "● processing — spinner owns the button"
                  : pay === "success"
                    ? "● done — spinner replaced by receipt"
                    : pay === "error"
                      ? "● done — spinner replaced by error"
                      : "○ idle — ready"}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-[13px] leading-relaxed text-text-muted">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
            Why a spinner, not a skeleton, here
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              A skeleton would have to invent a shape for “bank reply” — there
              isn&apos;t one. The honest signal is a spinner anchored where the
              action started: the Pay button.
            </li>
            <li>
              The button keeps its size while spinning, so the total below never
              shifts — spinner, used inline, still respects layout.
            </li>
            <li>
              Success <em>and</em> decline both evict the spinner immediately. A
              loader that survives its answer is the classic bug this component
              warns against.
            </li>
          </ul>
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/feed", label: "Magazine feed" }}
          next={{ href: "/scenarios/dashboard", label: "Dashboard" }}
        />
      </main>
    </div>
  );
}
