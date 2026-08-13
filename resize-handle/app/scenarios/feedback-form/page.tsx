"use client";

import { useState } from "react";
import { Code, Kicker, ScenarioNav, WhyNote } from "../../components/shared";

export default function FeedbackForm() {
  const [gripOn, setGripOn] = useState(true);
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <Kicker>Scenario 3 of 3 · Support</Kicker>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
        Feedback form
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        A support form where the grip is a <em>policy</em>, not an accident:
        flip a toggle between <Code>resize: vertical</Code> and{" "}
        <Code>resize: none</Code> and watch the field obey — then read why each
        choice is the right one in different products.
      </p>

      <div className="mt-8">
        <WhyNote>
          Forms are layout-sensitive: a message box stretched to 600px tall can
          push the submit button off screen or break a two-column card. The
          grip on by default gives users room to write long explanations;
          locking it is a deliberate trade — predictable over flexible — for
          dense flows like checkout or signup, where every pixel is accounted
          for.
        </WhyNote>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_32px_-20px_rgba(0,0,0,0.16)]">
        <div className="border-b border-stone-100 px-7 py-5">
          <h2 className="text-lg font-semibold text-stone-900">Send us feedback</h2>
          <p className="mt-1 text-sm text-stone-500">
            Found a bug, want a feature, or just want to talk? Tell us.
          </p>
        </div>

        <form
          className="space-y-5 px-7 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 outline-none transition-[border-color,box-shadow] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                defaultValue="Bug report"
              >
                <option>Bug report</option>
                <option>Feature request</option>
                <option>Billing</option>
                <option>Something else</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Subject
            </label>
            <input
              type="text"
              placeholder="What's this about?"
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 outline-none transition-[border-color,box-shadow] placeholder:text-stone-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Message
              </label>
              <span
                className={
                  gripOn
                    ? "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] text-emerald-700"
                    : "rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 font-mono text-[11px] text-stone-500"
                }
              >
                {gripOn ? "resize: vertical — grip on" : "resize: none — grip off"}
              </span>
            </div>
            <textarea
              defaultValue={
                "The dashboard takes about four seconds to load on my connection. Everything else is great — the charts render beautifully once they arrive!"
              }
              className={
                gripOn
                  ? "min-h-[140px] w-full resize-y rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm leading-6 text-stone-800 outline-none transition-[border-color,box-shadow] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  : "h-36 w-full resize-none rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-3 text-sm leading-6 text-stone-800 outline-none transition-[border-color,box-shadow] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              }
            />
            <p className="mt-1.5 text-xs text-stone-400">
              {gripOn
                ? "The grip is the ribbed corner — drag it for a bigger writing area."
                : "This box is locked at a fixed height so the card never shifts."}
            </p>
          </div>

          {sent ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-sm font-medium text-emerald-800">
                Thanks — your feedback is on its way.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-xs font-medium text-emerald-700 underline-offset-2 hover:underline"
              >
                Write another
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
            >
              Send feedback
            </button>
          )}
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          The policy switch
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-stone-700">Message box:</span>
          <div className="flex rounded-lg border border-stone-200 bg-stone-100 p-1">
            <button
              onClick={() => setGripOn(true)}
              className={
                gripOn
                  ? "rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-colors"
                  : "rounded-md px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:text-stone-900"
              }
            >
              Let users resize
            </button>
            <button
              onClick={() => setGripOn(false)}
              className={
                !gripOn
                  ? "rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition-colors"
                  : "rounded-md px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:text-stone-900"
              }
            >
              Lock the height
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          {gripOn ? (
            <>
              <strong className="text-stone-900">Why keep it:</strong> users
              writing bug reports type a lot. The grip lets them see everything
              they&apos;ve written without scrolling — fewer truncated,
              frustrated rants. Vertical-only means the card never widens, so
              the layout holds no matter how tall the message gets.
            </>
          ) : (
            <>
              <strong className="text-stone-900">Why lock it:</strong> in dense
              forms — checkout, signup, embedded support widgets — a stretched
              message box pushes the submit button off screen or breaks a
              two-column grid. <Code>resize: none</Code> trades a little
              flexibility for a completely predictable layout. Note: ordinary{" "}
              <Code>&lt;input&gt;</Code> fields can&apos;t be resized by users
              at all — only textareas get the grip.
            </>
          )}
        </p>
      </div>

      <ScenarioNav
        nextHref="/scenarios/notes-editor"
        nextLabel="Notes editor"
      />
    </main>
  );
}