"use client";

import { useState } from "react";
import { Steps } from "../../components/steps";
import { ScenarioNav } from "../../components/scenario-nav";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../../components/icons";

const CART = [
  { name: "NameThatUi Pro — 1-year course", meta: "Digital download · lifetime access", price: 189 },
  { name: "UI Vocabulary Flash Deck", meta: "200 cards · ships free", price: 42 },
  { name: "Component Anatomy Poster", meta: "A2 · rolled in a tube", price: 24 },
];

const STEP_LABELS = ["Cart", "Shipping", "Payment", "Confirmation"];

const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";
const label = "mb-1 block text-xs font-semibold text-slate-700";
const btnPrimary =
  "flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400";
const btnGhost =
  "flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

function FieldError({ show, msg }: { show: boolean; msg: string }) {
  if (!show) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

export default function CheckoutFlowPage() {
  const [step, setStep] = useState(2);
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", zip: "" });
  const [payment, setPayment] = useState({ card: "", expiry: "", cvc: "" });

  const shippingValid =
    shipping.name.trim().length >= 2 &&
    shipping.address.trim().length >= 5 &&
    shipping.city.trim().length >= 2 &&
    /^\d{4,6}$/.test(shipping.zip.trim());

  const cardDigits = payment.card.replace(/\s/g, "");
  const paymentValid =
    /^\d{16}$/.test(cardDigits) &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry) &&
    /^\d{3}$/.test(payment.cvc);

  const subtotal = CART.reduce((sum, it) => sum + it.price, 0);
  const shippingFee = subtotal >= 100 ? 0 : 9;
  const total = subtotal + shippingFee;

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const restart = () => {
    setStep(0);
    setShipping({ name: "", address: "", city: "", zip: "" });
    setPayment({ card: "", expiry: "", cvc: "" });
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Scenario 1 of 3 — checkout
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Store checkout</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          The scene from the prompt: you arrive on <strong>Payment</strong> (step 2, zero-based),
          so all three states are on screen at once — two checkmarks behind, one ringed stage now,
          one muted ahead. Click a completed circle to go back and change things; your data stays.
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Steps
          items={STEP_LABELS}
          current={step}
          onStepClick={(i) => {
            if (i <= step) setStep(i);
          }}
          ariaLabel="Checkout progress"
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <section aria-label="Current checkout step">
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Your cart</h2>
                <ul className="mt-4 divide-y divide-slate-100">
                  {CART.map((it) => (
                    <li key={it.name} className="flex items-center gap-4 py-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-600">
                        NTU
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900">{it.name}</p>
                        <p className="text-xs text-slate-400">{it.meta}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">${it.price}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-slate-500">Free shipping over $100 — you have it.</p>
                  <button type="button" className={btnPrimary} onClick={() => setStep(1)}>
                    Continue to shipping
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Shipping address</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="ship-name" className={label}>
                      Full name
                    </label>
                    <input
                      id="ship-name"
                      className={input}
                      value={shipping.name}
                      onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                      placeholder="Ada Lovelace"
                    />
                    <FieldError
                      show={shipping.name.length > 0 && shipping.name.trim().length < 2}
                      msg="At least 2 characters."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ship-address" className={label}>
                      Street address
                    </label>
                    <input
                      id="ship-address"
                      className={input}
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="221B Baker Street"
                    />
                    <FieldError
                      show={shipping.address.length > 0 && shipping.address.trim().length < 5}
                      msg="That address looks too short."
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-city" className={label}>
                      City
                    </label>
                    <input
                      id="ship-city"
                      className={input}
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="London"
                    />
                    <FieldError
                      show={shipping.city.length > 0 && shipping.city.trim().length < 2}
                      msg="Required."
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-zip" className={label}>
                      ZIP / postal code
                    </label>
                    <input
                      id="ship-zip"
                      className={input}
                      value={shipping.zip}
                      onChange={(e) =>
                        setShipping({ ...shipping, zip: e.target.value.replace(/\D/g, "") })
                      }
                      placeholder="12345"
                      inputMode="numeric"
                    />
                    <FieldError
                      show={shipping.zip.length > 0 && !/^\d{4,6}$/.test(shipping.zip)}
                      msg="4–6 digits."
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" className={btnGhost} onClick={() => setStep(0)}>
                    <ArrowLeftIcon className="h-3.5 w-3.5" />
                    Back to cart
                  </button>
                  <button
                    type="button"
                    className={btnPrimary}
                    disabled={!shippingValid}
                    onClick={() => setStep(2)}
                  >
                    Continue to payment
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A test card: any 16 digits, any future expiry, any 3-digit CVC.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="pay-card" className={label}>
                      Card number
                    </label>
                    <input
                      id="pay-card"
                      className={input}
                      value={payment.card}
                      onChange={(e) => setPayment({ ...payment, card: formatCard(e.target.value) })}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                    />
                    <FieldError
                      show={cardDigits.length > 0 && !/^\d{16}$/.test(cardDigits)}
                      msg="16 digits."
                    />
                  </div>
                  <div>
                    <label htmlFor="pay-expiry" className={label}>
                      Expiry
                    </label>
                    <input
                      id="pay-expiry"
                      className={input}
                      value={payment.expiry}
                      onChange={(e) =>
                        setPayment({ ...payment, expiry: formatExpiry(e.target.value) })
                      }
                      placeholder="08/28"
                      inputMode="numeric"
                    />
                    <FieldError
                      show={payment.expiry.length > 0 && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)}
                      msg="MM/YY."
                    />
                  </div>
                  <div>
                    <label htmlFor="pay-cvc" className={label}>
                      CVC
                    </label>
                    <input
                      id="pay-cvc"
                      className={input}
                      value={payment.cvc}
                      onChange={(e) =>
                        setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })
                      }
                      placeholder="123"
                      inputMode="numeric"
                    />
                    <FieldError
                      show={payment.cvc.length > 0 && !/^\d{3}$/.test(payment.cvc)}
                      msg="3 digits."
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button type="button" className={btnGhost} onClick={() => setStep(1)}>
                    <ArrowLeftIcon className="h-3.5 w-3.5" />
                    Back to shipping
                  </button>
                  <button
                    type="button"
                    className={btnPrimary}
                    disabled={!paymentValid}
                    onClick={() => setStep(3)}
                  >
                    Place order — ${total}
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="py-4 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-indigo-600 text-white">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Order #NT-10482 confirmed
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                  Your receipt is on its way to the email you entered. Every step above is now a
                  checkmark — the whole journey is banked.
                </p>
                <button type="button" className={`${btnGhost} mx-auto mt-5`} onClick={restart}>
                  Start a new order
                </button>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Order summary
            </p>
            <ul className="mt-3 space-y-2">
              {CART.map((it) => (
                <li key={it.name} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate text-slate-600">{it.name}</span>
                  <span className="shrink-0 font-medium text-slate-900">${it.price}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-sm">
              <p className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </p>
              <p className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : `$${shippingFee}`}</span>
              </p>
              <p className="flex justify-between pt-1 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>${total}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Why it fits here
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Checkout is where the step bar was born. Shoppers want to know how many stages remain
            before handing over money, and that their order hasn&apos;t vanished along the way. The
            tinted connectors and checkmarks make progress visible at a glance, and the clickable
            completed circles let you fix the address or the card without losing your place.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            What this variant exercises
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-600">
            <li>Horizontal orientation, driven by one zero-based index (Material UI activeStep).</li>
            <li>Clickable completed steps — jumping back keeps the form data.</li>
            <li>The full arc: every circle becomes a checkmark once the order is placed.</li>
          </ul>
        </div>
      </section>

      <ScenarioNav next={{ href: "/scenarios/onboarding-wizard", label: "Account setup wizard" }} />
    </main>
  );
}
