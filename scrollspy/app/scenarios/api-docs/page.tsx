"use client";

import { ScrollSpyNav } from "../../components/scrollspy";
import { ScenarioNav } from "../../components/scenario-nav";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "authentication", label: "Authentication" },
  { id: "rate-limits", label: "Rate limits" },
  { id: "core-endpoints", label: "Core endpoints" },
  { id: "error-handling", label: "Error handling" },
  { id: "webhooks", label: "Webhooks" },
  { id: "changelog", label: "Changelog" },
];

function MethodChip({ method }: { method: string }) {
  const color =
    method === "GET"
      ? "text-indigo-400"
      : method === "POST"
        ? "text-emerald-400"
        : "text-amber-400";
  return (
    <span
      className={`rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold ${color}`}
    >
      {method}
    </span>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-800 px-4 py-2.5">
        <span className="size-2 rounded-full bg-slate-700" />
        <span className="size-2 rounded-full bg-slate-700" />
        <span className="size-2 rounded-full bg-slate-700" />
        <span className="ml-2 font-mono text-[11px] text-slate-400">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParamTable({
  rows,
}: {
  rows: { name: string; type: string; desc: string }[];
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <th className="px-4 py-2 font-semibold">Parameter</th>
            <th className="px-4 py-2 font-semibold">Type</th>
            <th className="px-4 py-2 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((r) => (
            <tr key={r.name}>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-900">
                {r.name}
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">
                {r.type}
              </td>
              <td className="px-4 py-2.5 text-xs leading-relaxed text-slate-600">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EndpointCard({
  method,
  path,
  description,
  params,
  responseTitle,
  code,
}: {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; desc: string }[];
  responseTitle: string;
  code: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <MethodChip method={method} />
        <code className="font-mono text-sm font-semibold text-slate-900">{path}</code>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      {params && <ParamTable rows={params} />}
      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Response
        </p>
        <CodeBlock title={responseTitle} code={code} />
      </div>
    </div>
  );
}

function SectionIntro({
  id,
  title,
  text,
}: {
  id: string;
  title: string;
  text: string;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{text}</p>
    </section>
  );
}

export default function ApiDocsScenario() {
  return (
    <main className="w-full flex-1">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-600/30">
              <svg viewBox="0 0 20 20" className="size-4.5" fill="none" aria-hidden="true">
                <path
                  d="M2 11.5 5.5 8l3 3L14 5l4 4.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm font-semibold text-slate-900">Pulse Analytics</span>
            <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline">
              API v2
            </span>
          </div>
          <nav className="ml-auto flex items-center gap-5 text-sm">
            <a
              href="#introduction"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              Docs
            </a>
            <a href="#changelog" className="text-slate-500 transition-colors hover:text-slate-900">
              Changelog
            </a>
            <a
              href="https://github.com"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              GitHub
            </a>
            <a
              href="#authentication"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors hover:bg-indigo-500"
            >
              Get API key
            </a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
          <article className="min-w-0">
            <header className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                Scenario 1 of 3 — reference
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Pulse Analytics API
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                This is the canonical home of the scrollspy: a long reference document you jump
                around in constantly. Scroll and watch the On-this-page rail on the right track
                which section you are reading — while the site header stays pinned on top, so the
                activation zone has to start below it. Every rail item is a real link: click it and
                the page glides to that section.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <code className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                  Base URL: https://api.pulseanalytics.dev/v1
                </code>
                <code className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                  Format: JSON
                </code>
                <code className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                  Auth: X-API-Key
                </code>
              </div>
            </header>

            <div className="mt-10 space-y-16">
              <section id="introduction" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Introduction</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Pulse Analytics is a privacy-first product analytics API. You send it events
                    from your app or website — signups, purchases, feature toggles — and it answers
                    questions like &quot;how many trial users converted from the invite link this
                    week?&quot; without you writing a single SQL query. This reference documents
                    every endpoint, parameter, error, and delivery guarantee of the v2 API.
                  </p>
                  <p>
                    The data model is deliberately small. An <em>event</em> has a name, an
                    occurrence time, a flat map of properties, and the id of the user it happened
                    to. Events are collected through <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">POST /v1/events</code> or
                    pushed from your backend via webhooks. All timestamps are ISO-8601 strings in
                    UTC, and every successful response is a JSON object.
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          <th className="px-4 py-2.5 font-semibold">At a glance</th>
                          <th className="px-4 py-2.5 font-semibold">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          ["Base URL", "https://api.pulseanalytics.dev/v1"],
                          ["Authentication", "X-API-Key header, or Bearer token"],
                          ["Response format", "application/json"],
                          ["Timestamps", "ISO-8601, UTC"],
                          ["Request timeout", "15 seconds"],
                          ["Versioning", "Path versioning — breaking changes ship as /v2"],
                        ].map(([k, v]) => (
                          <tr key={k}>
                            <td className="px-4 py-2.5 font-medium text-slate-700">{k}</td>
                            <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Before you start
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  You need three things: a Pulse account, a project with events flowing into it,
                  and an API key. Keys are minted in the dashboard under{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">
                    Settings → API keys
                  </code>{" "}
                  — create one before reading on, and keep it on the server.
                </p>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Design notes
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Two behaviors shape most of the API. First, list endpoints are cursor-paginated:
                  a response returns a <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">next_cursor</code>{" "}
                  token that you pass back to fetch the following page — page numbers shift when
                  new data arrives, cursors do not. Second, every write is idempotent: send an{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">Idempotency-Key</code>{" "}
                  header and a replayed request returns the original result instead of creating a
                  duplicate event. Both rules exist because retries are normal, and duplicates are
                  how analytics go quietly wrong.
                </p>
              </section>

              <section id="authentication" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Authentication</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Every request must authenticate with your secret API key, sent in the{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">X-API-Key</code>{" "}
                    header. A missing or invalid key returns{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">401</code>{" "}
                    and the request is counted against your rate limit regardless. Keys are minted
                    in the dashboard, are shown in full exactly once, and can be revoked instantly
                    — revoke a key and the next request that uses it fails.
                  </p>
                  <p>
                    Never ship an API key in client-side code. Browser bundles are public
                    documents; a key inside one is a key you have already leaked. Route traffic
                    through your own backend, which adds the header, or mint a scoped bearer token
                    (below) that expires on its own.
                  </p>
                </div>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Using the header
                </h3>
                <div className="mt-3 space-y-3">
                  <CodeBlock
                    title="curl"
                    code={`curl https://api.pulseanalytics.dev/v1/events \\
  -H "X-API-Key: pls_live_4f9c2a8e7d" \\
  -H "Content-Type: application/json"`}
                  />
                  <CodeBlock
                    title="fetch"
                    code={`fetch("https://api.pulseanalytics.dev/v1/events", {
  headers: {
    "X-API-Key": "pls_live_4f9c2a8e7d",
    "Content-Type": "application/json",
  },
});`}
                  />
                </div>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Bearer tokens (server-to-server)
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  When one of your services needs to act on behalf of a user — reading their
                  project&apos;s events, for example — mint a short-lived token with{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">POST /v1/tokens</code>{" "}
                  and send it as{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">Authorization: Bearer &lt;token&gt;</code>.
                  Tokens expire after 15 minutes, are scoped to a single project, and stop working
                  the moment the user&apos;s key is revoked.
                </p>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Rotating keys
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-600">
                  <li>Create a second key in the dashboard so your service never runs without one.</li>
                  <li>Deploy it, confirm traffic in the key activity log, then revoke the old key.</li>
                  <li>
                    Repeat on a schedule. Keys that rotate quarterly leak far less than keys that
                    live forever.
                  </li>
                </ul>
              </section>

              <section id="rate-limits" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Rate limits</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Requests are counted per API key over rolling windows, so a burst at the top of
                    the minute does not cost you the whole day&apos;s budget. The limits below
                    apply to every plan by default; they exist to protect the pipeline, and most
                    integrations never come close.
                  </p>
                </div>

                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-2.5 font-semibold">Limit</th>
                        <th className="px-4 py-2.5 font-semibold">Quota</th>
                        <th className="px-4 py-2.5 font-semibold">Resets</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        ["Standard", "60 requests / minute", "rolling 60s window"],
                        ["Daily", "500 requests / day", "midnight UTC"],
                        ["Burst", "30 requests / 5 seconds", "rolling 5s window"],
                        ["Batch", "5,000 events / request", "per payload"],
                      ].map(([k, v, r]) => (
                        <tr key={k}>
                          <td className="px-4 py-2.5 font-medium text-slate-700">{k}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{v}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-500">{r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  Every response carries{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">X-RateLimit-Remaining</code>{" "}
                  and{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">X-RateLimit-Reset</code>{" "}
                  headers so you can back off before you hit the wall. When you do, the API answers{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">429</code>{" "}
                  with a{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">Retry-After</code>{" "}
                  header telling you exactly how many seconds to wait.
                </p>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Burst handling
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  A daily export job that fires five thousand requests at once will trip the burst
                  window long before the daily quota. Batch instead: one request can carry up to
                  5,000 events, which is almost always the right shape for imports, backfills, and
                  overnight reconciliation.
                </p>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Retrying politely
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  On a{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">429</code>{" "}
                  or a transient network failure, retry with exponential backoff — wait 1s, then
                  2s, then 4s, and give up after five attempts. Always attach an{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">Idempotency-Key</code>{" "}
                  to writes so a retry that actually landed does not double-count an event.
                </p>
              </section>

              <section id="core-endpoints" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Core endpoints</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Four endpoints cover the everyday workflow: writing events, reading them back,
                    and shaping audiences for targeting. Everything lives under{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">
                      https://api.pulseanalytics.dev/v1
                    </code>
                    . Errors of any kind use the shape described in the next section.
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  <EndpointCard
                    method="GET"
                    path="/v1/events"
                    description="List events in reverse chronological order, filtered by the query parameters. Pagination is cursor-based — pass the returned next_cursor to walk the full result set."
                    params={[
                      {
                        name: "limit",
                        type: "integer",
                        desc: "Max events per page. 1–100, default 25.",
                      },
                      {
                        name: "cursor",
                        type: "string",
                        desc: "Opaque token from the previous page. Omit for the first page.",
                      },
                      {
                        name: "type",
                        type: "string",
                        desc: "Event name to filter on, e.g. signup_completed.",
                      },
                      {
                        name: "since / until",
                        type: "string",
                        desc: "Inclusive ISO-8601 bounds on occurred_at.",
                      },
                    ]}
                    responseTitle="200 — page of events"
                    code={`{
  "data": [
    {
      "id": "evt_01J3FQ2KX",
      "name": "signup_completed",
      "occurred_at": "2026-07-28T09:14:22Z",
      "user_id": "user_8f41",
      "properties": { "plan": "pro" }
    }
  ],
  "next_cursor": "eyJvZmZzZXQiOjI1fQ"
}`}
                  />

                  <EndpointCard
                    method="POST"
                    path="/v1/events"
                    description="Record a single event. Returns 201 with the stored event, including the received_at timestamp the pipeline assigned. Replays with the same idempotency key return the original event instead."
                    params={[
                      {
                        name: "name",
                        type: "string",
                        desc: "Required. snake_case event name, max 64 chars.",
                      },
                      {
                        name: "occurred_at",
                        type: "string",
                        desc: "Required. ISO-8601 timestamp of when the event happened.",
                      },
                      {
                        name: "user_id",
                        type: "string",
                        desc: "Required. The id of the user the event belongs to.",
                      },
                      {
                        name: "properties",
                        type: "object",
                        desc: "Optional. Flat map of scalar values attached to the event.",
                      },
                      {
                        name: "Idempotency-Key",
                        type: "header",
                        desc: "Optional. Deduplicates retried requests for 24 hours.",
                      },
                    ]}
                    responseTitle="201 — created"
                    code={`{
  "id": "evt_01J3FQ2KX",
  "name": "signup_completed",
  "occurred_at": "2026-07-28T09:14:22Z",
  "received_at": "2026-07-28T09:14:22.417Z",
  "user_id": "user_8f41"
}`}
                  />

                  <EndpointCard
                    method="PATCH"
                    path="/v1/audiences/{id}"
                    description="Update an audience definition — rename it, swap its filters, or pause it. Audiences re-evaluate asynchronously; member_count on the response is the value before the change."
                    params={[
                      { name: "id", type: "path", desc: "The audience id, e.g. aud_02KD9L." },
                      { name: "name", type: "string", desc: "Optional. New display name." },
                      {
                        name: "filters",
                        type: "object",
                        desc: "Optional. Replacement filter tree (events within N days + property conditions).",
                      },
                      {
                        name: "is_active",
                        type: "boolean",
                        desc: "Optional. Set false to pause membership updates.",
                      },
                    ]}
                    responseTitle="200 — updated audience"
                    code={`{
  "id": "aud_02KD9L",
  "name": "Trial expiring",
  "is_active": true,
  "member_count": 1284,
  "updated_at": "2026-07-29T16:02:00Z"
}`}
                  />

                  <EndpointCard
                    method="GET"
                    path="/v1/audiences/{id}/insights"
                    description="Rolled-up numbers for an audience over a window: total membership, net growth, and the top referrers driving it. Ideal for dashboard tiles."
                    params={[
                      { name: "id", type: "path", desc: "The audience id." },
                      {
                        name: "window",
                        type: "string",
                        desc: "One of 7d, 30d, 90d. Default 30d.",
                      },
                    ]}
                    responseTitle="200 — insight rollup"
                    code={`{
  "audience_id": "aud_02KD9L",
  "window": "30d",
  "total_members": 1284,
  "net_growth": 142,
  "top_referrers": [
    { "source": "organic", "count": 613 },
    { "source": "invite_link", "count": 402 }
  ]
}`}
                  />
                </div>
              </section>

              <section id="error-handling" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Error handling</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Every error — whether a 400 from bad input or a 500 from us — uses the same
                    envelope, so one piece of client code can parse them all. The{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">request_id</code>{" "}
                    is the most useful field on earth when you email support: it lets us look up
                    exactly what happened to your request.
                  </p>
                </div>

                <div className="mt-3 max-w-2xl">
                  <CodeBlock
                    title="error.json — shared shape"
                    code={`{
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded for API key",
    "request_id": "req_01J4H9C7Q",
    "details": { "retry_after_seconds": 31 }
  }
}`}
                  />
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-2.5 font-semibold">Code</th>
                        <th className="px-4 py-2.5 font-semibold">Code (string)</th>
                        <th className="px-4 py-2.5 font-semibold">What it means</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        ["400", "invalid_request", "Malformed JSON, unknown field, or validation failure — check details."],
                        ["401", "missing_api_key", "No X-API-Key header present, or the key was revoked."],
                        ["404", "not_found", "The resource id does not exist, or was deleted."],
                        ["429", "rate_limited", "Over a window quota. Honor Retry-After, then retry with backoff."],
                        ["500", "internal_error", "Our pipeline failed. Retry with backoff; we log every one of these."],
                      ].map(([c, s, m]) => (
                        <tr key={c}>
                          <td className="px-4 py-2.5 font-mono text-xs font-semibold text-slate-900">{c}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-indigo-600">{s}</td>
                          <td className="px-4 py-2.5 text-xs leading-relaxed text-slate-600">{m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Troubleshooting
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-600">
                  <li>
                    A sudden wall of{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">401</code>s
                    almost always means a revoked key is still deployed somewhere — check the key
                    activity log.
                  </li>
                  <li>
                    Bearer tokens fail with{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">401</code>{" "}
                    if your clock skews more than 60 seconds. Sync your servers.
                  </li>
                  <li>
                    When contacting support, paste the{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">request_id</code>{" "}
                    — it shortens the conversation from minutes to seconds.
                  </li>
                </ul>
              </section>

              <section id="webhooks" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Webhooks</h2>
                <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate-600">
                  <p>
                    Webhooks are how Pulse reaches <em>you</em> when something happens: an
                    audience crosses a threshold, a batch import finishes, a data anomaly is
                    detected. You register a URL in the dashboard, and we deliver an event to it
                    within seconds. Each delivery is a POST with a JSON body and a signature header
                    you must verify.
                  </p>
                </div>

                <div className="mt-3 max-w-2xl">
                  <CodeBlock
                    title="payload — audience.crossed_threshold"
                    code={`{
  "event": "audience.crossed_threshold",
  "audience_id": "aud_02KD9L",
  "threshold": 1000,
  "member_count": 1004,
  "occurred_at": "2026-07-29T16:02:00Z"
}`}
                  />
                </div>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Verifying signatures
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Every delivery carries an{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">X-Pulse-Signature</code>{" "}
                  header: the hex HMAC-SHA256 of the raw request body, keyed with your webhook
                  secret. Verify before you trust — anyone can POST to a public URL.
                </p>
                <div className="mt-3 max-w-2xl">
                  <CodeBlock
                    title="verify — pseudo-code"
                    code={`const signature = crypto
  .createHmac("sha256", WEBHOOK_SECRET)
  .update(rawBody)
  .digest("hex");

// compare against the value in X-Pulse-Signature
// with a timing-safe compare, never a plain ===`}
                  />
                </div>

                <h3 className="mt-8 scroll-mt-28 text-lg font-semibold text-slate-900">
                  Delivery guarantees
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-600">
                  <li>At-least-once delivery — your handler must be idempotent.</li>
                  <li>
                    Three retries on failure with exponential backoff: 30 seconds, 2 minutes, 10
                    minutes.
                  </li>
                  <li>
                    Every payload carries an{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">X-Pulse-Event-Id</code>{" "}
                    header so you can dedupe deliveries that arrive twice.
                  </li>
                  <li>
                    Respond with 2xx within 10 seconds. Slower responses count as failures and are
                    retried.
                  </li>
                </ul>
              </section>

              <section id="changelog" className="scroll-mt-28">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Changelog</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  What shipped, when. Breaking changes land only in new versions, and every entry
                  below is backward compatible unless it says otherwise.
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      date: "2026-07-21",
                      version: "v2.4",
                      items: [
                        "insights now accepts the window parameter (7d / 30d / 90d)",
                        "webhook retry backoff changed to 30s, 2m, 10m",
                        "POST /v1/events/bulk is deprecated — use the 5,000-event batch on POST /v1/events instead",
                      ],
                    },
                    {
                      date: "2026-06-30",
                      version: "v2.3",
                      items: [
                        "PATCH /v1/audiences/{id} can now replace the filter tree in one call",
                        "X-Pulse-Signature added to all webhook deliveries",
                        "Idempotency-Key supported on every write endpoint",
                      ],
                    },
                    {
                      date: "2026-06-02",
                      version: "v2.2",
                      items: [
                        "cursor pagination on all list endpoints; page numbers removed",
                        "X-RateLimit-Remaining and X-RateLimit-Reset headers added",
                      ],
                    },
                    {
                      date: "2026-05-12",
                      version: "v2.1",
                      items: [
                        "new endpoint: GET /v1/audiences/{id}/insights",
                        "batch payloads raised to 5,000 events per request",
                      ],
                    },
                    {
                      date: "2026-04-03",
                      version: "v2.0",
                      items: [
                        "the rewrite: events-first data model, X-API-Key authentication, webhooks",
                        "v1 retired on 2026-05-01",
                      ],
                    },
                  ].map((e) => (
                    <div
                      key={e.date}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <code className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-300">
                          {e.version}
                        </code>
                        <span className="font-mono text-xs text-slate-400">{e.date}</span>
                      </div>
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                        {e.items.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Why this scenario works
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
                    Why it fits here
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    Readers jump around a lot
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Long reference pages make readers bounce between sections constantly — checking
                    the auth rules, then the payload shape, then the status codes. A rail answers
                    &quot;where am I?&quot; at a glance and gives one-click jumps to any section
                    without scrolling past thousands of words. It turns a wall of text into a map.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">
                    What this variant exercises
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    Offset, density, and scope
                  </h3>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                    <li>
                      Sticky site header: the activation zone is offset below it via rootMargin,
                      and headings carry <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-700">scroll-mt-28</code> so
                      anchor jumps land clear of it.
                    </li>
                    <li>
                      Tight zone: rootMargin{" "}
                      <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-700">
                        0px 0px -45% 0px
                      </code>{" "}
                      is tighter than the default -55% — snappier switching on a dense page.
                    </li>
                    <li>
                      Scope: only the top-level h2s are watched; the h3 sub-headings inside
                      sections never touch the rail.
                    </li>
                    <li>
                      Click-to-jump: the rail uses real fragment links, so navigation is native and
                      the browser&apos;s smooth scroll does the gliding.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </article>

          <aside className="sticky top-24 h-fit self-start">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              On this page
            </p>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <ScrollSpyNav
                sections={SECTIONS}
                ariaLabel="On this page"
                rootMargin="0px 0px -45% 0px"
              />
            </div>
            <p className="mt-3 rounded-lg bg-slate-50 p-3 font-mono text-[10px] leading-relaxed text-slate-500">
              rootMargin: 0px 0px -45% 0px
              <br />
              tighter zone than the default -55% — snappier switching on a dense page
            </p>
          </aside>
        </div>

        <ScenarioNav
          next={{ href: "/scenarios/field-guide", label: "Field guide article" }}
        />
      </div>
    </main>
  );
}
