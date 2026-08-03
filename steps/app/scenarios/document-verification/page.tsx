"use client";

import { useState } from "react";
import { Steps } from "../../components/steps";
import { ScenarioNav } from "../../components/scenario-nav";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  UploadIcon,
  ShieldCheckIcon,
} from "../../components/icons";

const VERIFY_STEPS = ["Personal details", "Upload ID", "Selfie check", "Review"];

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

export default function DocumentVerificationPage() {
  const [step, setStep] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [details, setDetails] = useState({ name: "", dob: "", country: "" });
  const [idStatus, setIdStatus] = useState<"idle" | "checking" | "failed" | "ok">("idle");
  const [attempts, setAttempts] = useState(0);
  const [selfie, setSelfie] = useState<"idle" | "checking" | "ok">("idle");
  const [submitted, setSubmitted] = useState(false);

  const detailsValid =
    details.name.trim().length >= 2 &&
    /^\d{4}-\d{2}-\d{2}$/.test(details.dob) &&
    details.country.trim().length >= 2;

  const uploadId = () => {
    if (idStatus === "checking" || idStatus === "ok") return;
    setIdStatus("checking");
    window.setTimeout(() => {
      if (attempts === 0) {
        setErrorIndex(1);
        setIdStatus("failed");
      } else {
        setErrorIndex(null);
        setIdStatus("ok");
      }
      setAttempts((a) => a + 1);
    }, 1500);
  };

  const runSelfie = () => {
    if (selfie !== "idle") return;
    setSelfie("checking");
    window.setTimeout(() => setSelfie("ok"), 2000);
  };

  const reset = () => {
    setStep(0);
    setErrorIndex(null);
    setDetails({ name: "", dob: "", country: "" });
    setIdStatus("idle");
    setAttempts(0);
    setSelfie("idle");
    setSubmitted(false);
  };

  const chip = (ok: boolean, text: string) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {ok ? <CheckIcon className="h-3 w-3" /> : null}
      {text}
    </span>
  );

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Scenario 3 of 3 — verification
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">ID verification</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          A bank-style flow where a step can genuinely <strong>fail</strong>. Upload the ID and the
          first attempt is rejected — the step circle turns red with an{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">
            error
          </code>{" "}
          status (Ant Design: status=&quot;error&quot;). Retry without restarting the application.
        </p>
      </header>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Steps
          items={VERIFY_STEPS}
          current={step}
          errorIndex={errorIndex}
          onStepClick={(i) => {
            if (i <= step || (errorIndex != null && i === errorIndex)) setStep(i);
          }}
          ariaLabel="Verification progress"
        />

        <div className="mt-8 max-w-xl">
          <section aria-label="Current verification step">
            {step === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Personal details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Exactly as they appear on your ID document.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="v-name" className={label}>
                      Full legal name
                    </label>
                    <input
                      id="v-name"
                      className={input}
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                      placeholder="Ada Lovelace"
                    />
                    <FieldError
                      show={details.name.length > 0 && details.name.trim().length < 2}
                      msg="Required."
                    />
                  </div>
                  <div>
                    <label htmlFor="v-dob" className={label}>
                      Date of birth
                    </label>
                    <input
                      id="v-dob"
                      className={input}
                      value={details.dob}
                      onChange={(e) =>
                        setDetails({ ...details, dob: e.target.value.replace(/\D/g, "").slice(0, 8) })
                      }
                      placeholder="YYYY-MM-DD"
                      inputMode="numeric"
                    />
                    <FieldError
                      show={details.dob.length > 0 && !/^\d{4}-\d{2}-\d{2}$/.test(details.dob)}
                      msg="YYYY-MM-DD."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="v-country" className={label}>
                      Country of issue
                    </label>
                    <input
                      id="v-country"
                      className={input}
                      value={details.country}
                      onChange={(e) => setDetails({ ...details, country: e.target.value })}
                      placeholder="United Kingdom"
                    />
                    <FieldError
                      show={details.country.length > 0 && details.country.trim().length < 2}
                      msg="Required."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Upload a photo of your ID</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A clear, well-lit photo of the front of your passport or driver&apos;s licence.
                </p>
                <div className="mt-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <UploadIcon className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-700">{idStatus === "ok" ? "government-id.jpg" : "Drag your file here, or"}</p>
                  {idStatus !== "ok" ? (
                    <button type="button" className={`${btnPrimary} mx-auto mt-3`} onClick={uploadId} disabled={idStatus === "checking"}>
                      {idStatus === "checking" ? "Checking photo…" : "Choose file"}
                      {idStatus !== "checking" ? <ArrowRightIcon className="h-3.5 w-3.5" /> : null}
                    </button>
                  ) : (
                    <p className="mt-3 text-xs font-medium text-emerald-600">
                      Verified — the photo is clear and complete.
                    </p>
                  )}
                </div>
                {idStatus === "failed" && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-700">We couldn&apos;t read this photo</p>
                    <p className="mt-1 text-sm leading-relaxed text-red-600">
                      It may be blurry, cut off, or showing the wrong side. The step circle above is
                      now red — try again with better lighting, attempt {attempts + 1}.
                    </p>
                  </div>
                )}
                {idStatus === "ok" && (
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600">
                    <CheckIcon className="h-4 w-4" /> Upload complete — the red circle above turned
                    back into a checkmark.
                  </p>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Selfie check</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A live photo matching the ID you uploaded. It never leaves your device.
                </p>
                <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 p-5">
                  <div className="grid size-14 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                    <ShieldCheckIcon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    {selfie === "idle" && (
                      <>
                        <p className="text-sm font-medium text-slate-700">Ready when you are</p>
                        <button type="button" className={`${btnPrimary} mt-2`} onClick={runSelfie}>
                          Run automated check
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    {selfie === "checking" && (
                      <>
                        <p className="text-sm font-medium text-slate-700">Checking…</p>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-500" />
                        </div>
                      </>
                    )}
                    {selfie === "ok" && (
                      <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <CheckIcon className="h-4 w-4" /> It&apos;s a match — selfie verified.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && !submitted && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Review & submit</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Everything gathered across the four steps, in one place.
                </p>
                <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm">
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Full legal name</dt>
                    <dd className="font-medium text-slate-900">{details.name}</dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Date of birth</dt>
                    <dd className="font-medium text-slate-900">{details.dob}</dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Country of issue</dt>
                    <dd className="font-medium text-slate-900">{details.country}</dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">ID photo</dt>
                    <dd>{chip(idStatus === "ok", "Verified")}</dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <dt className="text-slate-500">Selfie</dt>
                    <dd>{chip(selfie === "ok", "Matched")}</dd>
                  </div>
                </dl>
              </div>
            )}

            {step === 3 && submitted && (
              <div className="py-4 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-600 text-white">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Application received — ref #NT-8841
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                  All four steps are complete. Our team reviews most applications within 24 hours —
                  you&apos;ll hear from us by email.
                </p>
                <button type="button" className={`${btnGhost} mx-auto mt-5`} onClick={reset}>
                  Run it again
                </button>
              </div>
            )}
          </section>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button
              type="button"
              className={btnGhost}
              disabled={step === 0 || submitted}
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                className={btnPrimary}
                disabled={
                  (step === 0 && !detailsValid) ||
                  (step === 1 && idStatus !== "ok") ||
                  (step === 2 && selfie !== "ok")
                }
                onClick={() => setStep(step + 1)}
              >
                {step === 2 ? "Review application" : "Continue"}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                className={btnPrimary}
                disabled={submitted}
                onClick={() => setSubmitted(true)}
              >
                Submit application
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Why it fits here
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Verification is the one flow where a step can honestly fail, and that is exactly what
            the error state is for: the red circle tells you which stage to revisit instead of
            making you guess. Retrying from the same step — never restarting the whole application
            — keeps the frustration down, and watching the checkmarks rebuild restores trust.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            What this variant exercises
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-600">
            <li>The error status (Ant Design status=&quot;error&quot;) on a failed step.</li>
            <li>Non-linear navigation — you can jump straight back to the failed step.</li>
            <li>The connector after the failed step tints red, then recovers on retry.</li>
          </ul>
        </div>
      </section>

      <ScenarioNav prev={{ href: "/scenarios/onboarding-wizard", label: "Account setup wizard" }} />
    </main>
  );
}
