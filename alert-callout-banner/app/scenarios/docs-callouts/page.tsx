"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, PageShell, SectionTitle } from "@/components/page-shell";
import { Admonition, ADMONITION_MARKDOWN, type AdmonitionType } from "@/components/admonition";
import { Segmented } from "@/components/segmented";

type ViewMode = "rendered" | "markdown source";
type DirMode = "ltr" | "rtl";

const CHIP_TONES: Record<AdmonitionType, string> = {
  NOTE: "bg-sky-100 text-sky-900",
  TIP: "bg-emerald-100 text-emerald-900",
  IMPORTANT: "bg-violet-100 text-violet-900",
  WARNING: "bg-amber-100 text-amber-900",
  CAUTION: "bg-red-100 text-red-900",
};

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  );
}

function TypeChip({ type }: { type: AdmonitionType }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide ${CHIP_TONES[type]}`}
    >
      {type}
    </span>
  );
}

function MarkdownSource({ type }: { type: AdmonitionType }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <TypeChip type={type} />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          markdown source
        </span>
      </div>
      <pre className="overflow-x-auto bg-ink p-4 font-mono text-xs leading-relaxed text-muted">
        <code>{ADMONITION_MARKDOWN[type]}</code>
      </pre>
    </div>
  );
}

function CalloutSlot({
  mode,
  type,
  title,
  children,
}: {
  mode: ViewMode;
  type: AdmonitionType;
  title: string;
  children: ReactNode;
}) {
  if (mode === "markdown source") {
    return <MarkdownSource type={type} />;
  }
  return (
    <Admonition type={type} title={title} className="my-6">
      {children}
    </Admonition>
  );
}

function CodeBlock({ filename, children }: { filename: string; children: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-line-strong bg-ink shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/25 px-4 py-2">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="ml-1.5 font-mono text-[11px] text-stone-300">{filename}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-paper">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function ArticleHeading({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 mb-3 text-lg font-semibold tracking-tight text-ink sm:text-xl">{children}</h2>;
}

function ArticleBody({ mode }: { mode: ViewMode }) {
  return (
    <>
      <p>
        Every request to the Helios API must say who is making it. This guide covers the token-based
        flow end to end: how to obtain an access token, how to attach it to every request, and how to
        keep an integration running when tokens expire and rate limits close in.
      </p>
      <p>
        The short version: exchange your API key for an access token, send that token with each
        request, and refresh it before it expires. Each section below builds on the one before it.
      </p>

      <ArticleHeading>How it works</ArticleHeading>
      <p>
        Helios uses a two-step handshake. Your integration holds an API key — a long-lived secret
        issued in the dashboard — and uses it once to obtain an access token, the short-lived
        credential that actually authorizes each request. Access tokens are valid for 60 minutes,
        which keeps the damage contained if one ever leaks.
      </p>
      <CalloutSlot mode={mode} type="IMPORTANT" title="Authorization header">
        Every request must carry your access token in the <InlineCode>Authorization</InlineCode>{" "}
        header, formatted as <InlineCode>Authorization: Bearer {"<token>"}</InlineCode>. Omit it,
        mistype it, or send an expired token, and Helios answers with{" "}
        <InlineCode>401 Unauthorized</InlineCode> — no request is ever honored without it.
      </CalloutSlot>

      <ArticleHeading>Get a token</ArticleHeading>
      <p>
        Call the <InlineCode>/oauth/token</InlineCode> endpoint once with your API key. The response
        returns the access token, its expiry, and a refresh token you will use later to mint new
        ones without any user involvement.
      </p>
      <CodeBlock filename="examples/get-token.sh">
        {`curl -X POST https://api.helios.dev/v2/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{"api_key": "hk_live_abc123"}'`}
      </CodeBlock>

      <ArticleHeading>Refresh tokens</ArticleHeading>
      <p>
        Access tokens expire after 60 minutes. Instead of asking your users to authenticate again,
        exchange the refresh token for a fresh pair: call <InlineCode>/oauth/token</InlineCode> with{" "}
        <InlineCode>grant_type=refresh_token</InlineCode> and you are back in business in one silent
        round trip.
      </p>
      <CalloutSlot mode={mode} type="TIP" title="Retry with backoff">
        If a call fails with <InlineCode>429</InlineCode> or a <InlineCode>5xx</InlineCode>, wait
        before trying again — start at one second and double the delay on each attempt, up to a
        30-second ceiling. A short, deliberate pause is the single most effective habit for keeping
        a struggling integration from failing harder.
      </CalloutSlot>

      <ArticleHeading>Rate limits</ArticleHeading>
      <p>
        Each API key may make 500 requests per minute. The{" "}
        <InlineCode>X-RateLimit-Limit</InlineCode>, <InlineCode>X-RateLimit-Remaining</InlineCode>{" "}
        and <InlineCode>X-RateLimit-Reset</InlineCode> response headers tell you exactly where you
        stand, so you can throttle your own traffic before the API throttles it for you.
      </p>
      <CalloutSlot mode={mode} type="WARNING" title="Rate limits">
        Hitting the ceiling returns <InlineCode>429 Too Many Requests</InlineCode> — and rejected
        requests still count against the sliding window, so hammering only digs the hole deeper.
        Wait for the <InlineCode>X-RateLimit-Reset</InlineCode> header, then resume gently. Repeated
        violations can suspend a key permanently.
      </CalloutSlot>

      <ArticleHeading>List your keys</ArticleHeading>
      <p>
        The <InlineCode>/keys</InlineCode> endpoint returns every API key on your account. Results
        are paginated: request up to 100 keys per page with <InlineCode>page_size</InlineCode>, and
        walk the pages by following the <InlineCode>next_link</InlineCode> field in each response
        until it disappears.
      </p>
      <CalloutSlot mode={mode} type="NOTE" title="Pagination">
        Treat <InlineCode>next_link</InlineCode> as authoritative. Page numbers shift the moment
        another key is created or revoked mid-pagination, but <InlineCode>next_link</InlineCode>{" "}
        always points at the exact next batch — follow it and you will neither skip keys nor fetch
        the same one twice.
      </CalloutSlot>

      <ArticleHeading>Delete a key</ArticleHeading>
      <p>
        Revoking a key is the fastest way to stop a compromised credential. In the dashboard, open
        the key and choose Delete, or call <InlineCode>DELETE /keys/:id</InlineCode> directly.
      </p>
      <CalloutSlot mode={mode} type="CAUTION" title="Deleting API keys">
        Deletion is immediate and permanent — there is no undo. The key stops working the moment
        you confirm, and any integration still using it fails with <InlineCode>401</InlineCode>{" "}
        until it is rotated. Ship the replacement key first, and delete the old one only after
        production traffic has moved over.
      </CalloutSlot>

      <p>
        That is the whole model. Attach the header, refresh before expiry, and back off when the
        API asks you to, and Helios is generous — the failures this guide warns about are mostly
        the ones integrations arrange for themselves.
      </p>
    </>
  );
}

export default function DocsCalloutsPage() {
  const [view, setView] = useState<ViewMode>("rendered");
  const [dir, setDir] = useState<DirMode>("ltr");

  return (
    <PageShell
      navCurrent="docs"
      kicker="Scenario 2 · The callout in documentation"
      title="Authentication guide"
    >
      <Card className="mb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
              View
            </p>
            <Segmented
              value={view}
              options={["rendered", "markdown source"] as const}
              onChange={setView}
              ariaLabel="Article view"
            />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {view === "rendered"
                ? "What the reader sees: every callout rendered as a typed, tinted box sitting in the prose where the author placed it."
                : "What the author writes: each box is a one-line blockquote directive — `> [!TYPE]` — that the docs tool turns into the styled box above."}
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
              Direction
            </p>
            <Segmented
              value={dir}
              options={["ltr", "rtl"] as const}
              onChange={setDir}
              ariaLabel="Article text direction"
            />
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {dir === "ltr"
                ? "Left to right, like English: the callout’s colored bar hugs the left edge — the leading edge where reading starts."
                : "Right to left, like Arabic or Hebrew: the bar moved to the right edge all by itself. The accent is declared with border-inline-start — a logical, direction-aware property — so it mirrors automatically. Same code, mirrored layout."}
            </p>
          </div>
        </div>
      </Card>

      <div dir={dir} className="max-w-3xl text-[15px] leading-relaxed text-ink">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-faint"
        >
          <Link
            href="/"
            className="transition hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            docs
          </Link>
          <span aria-hidden="true">/</span>
          <span>API reference</span>
          <span aria-hidden="true">/</span>
          <span className="text-muted">Authentication</span>
        </nav>
        <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <span>Helios API reference</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-faint" />
          <span>v2.1</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-faint" />
          <span>6 min read</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-faint" />
          <span>Updated 2 Aug 2026</span>
        </p>
        <div className="mt-6 space-y-4">
          <ArticleBody mode={view} />
        </div>
      </div>

      <Card className="mt-10 max-w-3xl">
        <SectionTitle note="What the callout does for someone reading the reference — and what it deliberately does not do.">
          Why the callout fits documentation
        </SectionTitle>
        <p className="text-sm leading-relaxed text-muted">
          A docs callout qualifies a paragraph at the exact moment you read it. It is authored with
          the page and lives inside the reading flow — it never pops in, never closes, and never
          interrupts — so it needs no live region, no dismiss button, and no timer. The colored
          leading bar makes the type scannable at a glance: a quick skim down the margin reveals
          where the warnings hide before a single word is read.
        </p>
        <p className="mt-4 rounded-xl border border-line bg-paper px-4 py-3 font-mono text-xs leading-relaxed text-ink">
          A callout you can’t close is a callout — the moment it gets an X and an onClose, it
          becomes an alert.
        </p>
        <Admonition type="NOTE" title="No role, on purpose" className="mt-5">
          <InlineCode>{"role=\"alert\""}</InlineCode> would announce this text the moment the page loads —
          that is why static docs callouts carry no role. A live region exists to announce change,
          and a paragraph that is always there is not a change; it is just text.
        </Admonition>
      </Card>
    </PageShell>
  );
}
