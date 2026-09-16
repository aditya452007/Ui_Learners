"use client";

import { useRef, useState } from "react";
import { Radio, ScenarioNav, Token, TopBar } from "../../components/ui";

const SPEEDS = [
  { v: "standard", label: "Standard", description: "4–6 business days · tracked", price: 0, badge: "Free" },
  { v: "express", label: "Express", description: "2 business days · priority handling", price: 6.9 },
  { v: "overnight", label: "Overnight", description: "Next business day by noon", price: 14.9, disabled: true, disabledNote: "Unavailable for P.O. boxes — this order ships to P.O. Box 418." },
] as const;

const PAYMENTS = [
  { v: "card", label: "Card", description: "Visa ···· 4242 · expires 09/28" },
  { v: "paypal", label: "PayPal", description: "maya@example.com · buyer protection included" },
  { v: "pickup", label: "Cash on pickup", description: "Pay at the Portland Pearl counter, no fees" },
] as const;

const SUBTOTAL = 84.0;

export default function CheckoutDeliveryPage() {
  const [speed, setSpeed] = useState<string | null>(null);
  const [pay, setPay] = useState<string>("card");
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const speedPrice = SPEEDS.find((s) => s.v === speed)?.price ?? 0;
  const total = SUBTOTAL + speedPrice;

  const speedLabel = SPEEDS.find((s) => s.v === speed)?.label;
  const payLabel = PAYMENTS.find((p) => p.v === pay)?.label;

  const continueOrder = () => {
    if (!speed) {
      setError("Choose a delivery speed — exactly one is required before your order can continue.");
      errorRef.current?.focus();
      return;
    }
    setError(null);
    setPlaced(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <header className="pb-6 pt-10">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
            Scenario 2 · Radio — exactly one wins
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Northwind checkout</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            A parcel can only travel at one speed and be paid for one way — so each question is a same-name radio
            group. Pick a speed and watch the previous dot vanish: the browser clears the rest for you.
          </p>
        </header>

        {error && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="animate-pop-in mb-4 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-800 outline-none"
          >
            {error}
          </div>
        )}

        {placed && (
          <div role="status" className="animate-pop-in mb-4 rounded-2xl border border-teal-700/30 bg-teal-50 px-5 py-4 text-sm leading-relaxed">
            <span className="font-semibold">Order placed.</span> {speedLabel} delivery · {payLabel} ·{" "}
            <span className="font-semibold tabular-nums">${total.toFixed(2)}</span> charged. Start over by picking a
            different speed — the summary follows the dot.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <fieldset className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <legend className="px-1 text-sm font-semibold">
                Delivery speed <span className="ml-1 font-normal text-text-muted">(required · one only · <Token>name="speed"</Token>)</span>
              </legend>
              <div className="grid gap-2 pt-1">
                {SPEEDS.map((s) => (
                  <Radio
                    key={s.v}
                    name="speed"
                    value={s.v}
                    label={`${s.label} — ${s.price === 0 ? "Free" : `$${s.price.toFixed(2)}`}`}
                    description={s.description}
                    badge={"badge" in s ? (s.badge as string) : undefined}
                    disabled={"disabled" in s && !!s.disabled}
                    disabledNote={"disabledNote" in s ? (s.disabledNote as string) : undefined}
                    checked={speed === s.v}
                    onChange={(v) => {
                      setSpeed(v);
                      setError(null);
                      setPlaced(false);
                    }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <legend className="px-1 text-sm font-semibold">
                Payment method <span className="ml-1 font-normal text-text-muted">(one only · <Token>name="pay"</Token>)</span>
              </legend>
              <div className="grid gap-2 pt-1 sm:grid-cols-3">
                {PAYMENTS.map((p) => (
                  <Radio
                    key={p.v}
                    name="pay"
                    value={p.v}
                    label={p.label}
                    description={p.description}
                    checked={pay === p.v}
                    onChange={(v) => {
                      setPay(v);
                      setPlaced(false);
                    }}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-20">
            <h2 className="text-sm font-semibold">Order summary</h2>
            <dl className="mt-3 space-y-2 text-sm tabular-nums">
              <div className="flex justify-between">
                <dt className="text-text-muted">Trailhead backpack</dt>
                <dd className="font-medium">${SUBTOTAL.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Delivery{speedLabel ? ` (${speedLabel})` : ""}</dt>
                <dd className="font-medium">{speed ? (speedPrice === 0 ? "Free" : `$${speedPrice.toFixed(2)}`) : "—"}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-[15px] font-semibold">
                <dt>Total</dt>
                <dd>${total.toFixed(2)}</dd>
              </div>
            </dl>
            <p className="mt-3 rounded-xl bg-surface-alt px-3 py-2.5 text-[13px] leading-relaxed text-text-muted" aria-live="polite">
              {speed
                ? `Exactly one speed selected: ${speedLabel}. Pick another and this line rewrites itself.`
                : "No speed selected yet — the dot can only live in one circle, so choose yours."}
            </p>
            <button
              onClick={continueOrder}
              className="mt-3 w-full rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Continue with {speedLabel ?? "a speed"}
            </button>
          </aside>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Why radios fit here</h2>
          <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-text-muted">
            Delivery speed and payment are mutually exclusive by nature — two speeds cannot both apply to one parcel.
            Sharing <Token>name="speed"</Token> (and a separate <Token>name="pay"</Token>) lets the browser enforce
            “exactly one” with zero bookkeeping, announces “2 of 3” to screen readers, and supports arrow-key travel
            between options. The disabled Overnight row shows edge handling: it stays visible so the shopper learns
            the rule instead of wondering where the option went.
          </p>
        </div>

        <ScenarioNav
          prev={{ href: "/scenarios/notification-settings", label: "Scenario 1: Settings" }}
          next={{ href: "/scenarios/signup-preferences", label: "Scenario 3: Preferences" }}
        />
      </main>
    </div>
  );
}
