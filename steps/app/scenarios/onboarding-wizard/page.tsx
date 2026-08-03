"use client";

import { useState } from "react";
import { Steps, type StepItem } from "../../components/steps";
import { ScenarioNav } from "../../components/scenario-nav";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../../components/icons";

const WIZARD: StepItem[] = [
  { label: "Account details", hint: "Your name and work email" },
  { label: "Security", hint: "A password only you know" },
  { label: "Preferences", hint: "How the app should behave" },
  { label: "You're in", hint: "Everything is set up" },
];

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

export default function OnboardingWizardPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirm: "",
    theme: "auto",
    digest: true,
  });

  const valid = [
    data.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(data.email.trim()),
    data.password.length >= 8 && data.password === data.confirm,
    true,
  ];
  const stepValid = valid[step] ?? true;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Scenario 2 of 3 — onboarding
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Account setup wizard</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          A sign-up wizard turned on its side: the steps run <strong>vertically</strong> down the
          page, and the Continue button stays disabled until the step you are on is valid. Go back
          and your answers are still there — everything lives in one state object.
        </p>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Steps
            items={WIZARD}
            current={step}
            orientation="vertical"
            onStepClick={(i) => {
              if (i <= step) setStep(i);
            }}
            ariaLabel="Account setup progress"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <section aria-label="Current setup step">
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Account details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  We will use these to create your workspace.
                </p>
                <div className="mt-4 grid gap-4">
                  <div>
                    <label htmlFor="w-name" className={label}>
                      Full name
                    </label>
                    <input
                      id="w-name"
                      className={input}
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      placeholder="Grace Hopper"
                    />
                    <FieldError
                      show={data.name.length > 0 && data.name.trim().length < 2}
                      msg="At least 2 characters."
                    />
                  </div>
                  <div>
                    <label htmlFor="w-email" className={label}>
                      Work email
                    </label>
                    <input
                      id="w-email"
                      type="email"
                      className={input}
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="grace@company.com"
                    />
                    <FieldError
                      show={data.email.length > 0 && !/^\S+@\S+\.\S+$/.test(data.email.trim())}
                      msg="That email doesn't look right."
                    />
                  </div>
                  <div>
                    <label htmlFor="w-company" className={label}>
                      Company <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      id="w-company"
                      className={input}
                      value={data.company}
                      onChange={(e) => setData({ ...data, company: e.target.value })}
                      placeholder="Hoppers Inc."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Security</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Eight characters minimum. We check it while you type.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="w-pass" className={label}>
                      Password
                    </label>
                    <input
                      id="w-pass"
                      type="password"
                      className={input}
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      placeholder="••••••••"
                    />
                    <FieldError
                      show={data.password.length > 0 && data.password.length < 8}
                      msg="At least 8 characters."
                    />
                  </div>
                  <div>
                    <label htmlFor="w-confirm" className={label}>
                      Repeat password
                    </label>
                    <input
                      id="w-confirm"
                      type="password"
                      className={input}
                      value={data.confirm}
                      onChange={(e) => setData({ ...data, confirm: e.target.value })}
                      placeholder="••••••••"
                    />
                    <FieldError
                      show={data.confirm.length > 0 && data.confirm !== data.password}
                      msg="Passwords don't match."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
                <p className="mt-1 text-sm text-slate-500">Small things that make it feel yours.</p>
                <div className="mt-4 grid gap-4">
                  <div>
                    <label htmlFor="w-theme" className={label}>
                      Appearance
                    </label>
                    <select
                      id="w-theme"
                      className={input}
                      value={data.theme}
                      onChange={(e) => setData({ ...data, theme: e.target.value })}
                    >
                      <option value="auto">Match system</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={data.digest}
                      onChange={(e) => setData({ ...data, digest: e.target.checked })}
                      className="size-4 accent-indigo-600"
                    />
                    <span className="text-sm text-slate-700">
                      Send me a weekly UI vocabulary digest
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="py-4 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-indigo-600 text-white">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Welcome aboard, {data.name.trim() || "friend"}!
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                  Your workspace for <span className="font-medium text-slate-700">{data.company || data.email}</span> is
                  ready — password locked in, appearance set to{" "}
                  <span className="font-medium text-slate-700">{data.theme}</span>
                  {data.digest ? ", and the digest is on its way" : ""}.
                </p>
                <button
                  type="button"
                  className={`${btnGhost} mx-auto mt-5`}
                  onClick={() => {
                    setStep(0);
                    setData({
                      name: "",
                      email: "",
                      company: "",
                      password: "",
                      confirm: "",
                      theme: "auto",
                      digest: true,
                    });
                  }}
                >
                  Set up another account
                </button>
              </div>
            )}
          </section>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              type="button"
              className={btnGhost}
              disabled={step === 0}
              onClick={() => setStep(Math.max(0, step - 1))}
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                className={btnPrimary}
                disabled={!stepValid}
                onClick={() => setStep(step + 1)}
              >
                {step === 2 ? "Finish setup" : "Continue"}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Why it fits here
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Onboarding asks a lot of a new user at once. The vertical layout reads like a checklist
            you tick down the page — you can always see what you have given and what is left. The
            disabled Continue button stops you from skipping a required field, and because every
            answer lives in one place, going back never makes you retype.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            What this variant exercises
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-600">
            <li>Vertical orientation with per-step hint text under the labels.</li>
            <li>Validation gating — Continue is disabled until the current step is valid.</li>
            <li>Form data persists when you jump back to an earlier step.</li>
          </ul>
        </div>
      </section>

      <ScenarioNav
        prev={{ href: "/scenarios/checkout-flow", label: "Store checkout" }}
        next={{ href: "/scenarios/document-verification", label: "ID verification" }}
      />
    </main>
  );
}
