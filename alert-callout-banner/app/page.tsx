"use client";

import { useState } from "react";
import Link from "next/link";
import { Alert, type AlertVariant, type Severity } from "@/components/alert";
import { Admonition } from "@/components/admonition";
import { SiteBanner } from "@/components/site-banner";
import { Card, PageShell, SectionTitle } from "@/components/page-shell";
import { Segmented } from "@/components/segmented";
import { ArrowRightIcon } from "@/components/icons";

const SEVERITIES: readonly Severity[] = ["info", "success", "warning", "error"];
const VARIANTS: readonly AlertVariant[] = ["standard", "outlined", "filled"];

const PARTS = [
  {
    n: 1,
    name: "Accent border",
    token: "border-inline-start",
    see: "The colored line down the leading edge of the box. You don't need to read the message to know what kind of notice it is — one glance at the bar tells you it's a warning. It flips to the right edge in right-to-left layouts, so the same design works in Arabic or Hebrew without any extra work.",
    how: "One CSS declaration — border-inline-start: 4px solid — paints the bar. 'Inline-start' is a logical edge: it means 'the side where reading starts', so in LTR that's the left and in RTL the browser mirrors it to the right by itself. The Alert component pairs this bar with a faint border so the box reads as a single composed surface.",
  },
  {
    n: 2,
    name: "Severity surface",
    token: "variant=\"standard\"",
    see: "The pale tinted background behind the message. The blue info box and the yellow warning box are the same shape — only the tint changes. It makes the notice easy to scan without shouting, and a warning feels different from an error even at a glance.",
    how: "variant is a prop — a setting you hand the component when you use it. The component keeps a lookup table (a plain object) that maps each variant to its CSS classes, like standard → a soft tint. When the prop changes, React renders the box again with the new classes — like swapping the wallpaper in a room without moving the furniture.",
  },
  {
    n: 3,
    name: "Severity indicator",
    token: "severity=\"warning\"",
    see: "The little warning triangle on the left. It confirms the category even if you can't read the text or see the color — the icon and the tint always agree. A green check means good news, a triangle means careful.",
    how: "severity is one prop that picks BOTH the icon and the color from the same lookup table, so they can never disagree (you never get a green triangle with a red tint). The icon is decorative — aria-hidden — because screen readers announce the message text itself, and the text already says what is wrong.",
  },
  {
    n: 4,
    name: "Dismiss control",
    token: "onClose",
    see: "The little X on the right. It lets you make a persistent notice go away when you've dealt with it — and its presence is the difference between an alert you can dismiss and a callout that is permanent. Not every notice gets one: only when hiding the message is safe.",
    how: "onClose is a prop that holds a callback — a function the parent page gives the component. The Alert only renders the X when that prop exists. Clicking it calls the function; the parent sets state (a value the component remembers between clicks) to remove the alert from the screen — like closing a book you've finished reading.",
  },
  {
    n: 5,
    name: "Alert action",
    token: "action",
    see: "One concise follow-up at the end, like 'Review settings'. It tells you exactly what to do next instead of leaving you to guess — one action, one decision. The message explains, the action resolves.",
    how: "action is a slot: a prop where React renders whatever element you hand it — a link or a button — in the trailing position. Because the component gives it a consistent spot and style, every alert in the product offers its action in the same place, which your eye learns to find instantly.",
  },
] as const;

export default function Home() {
  const [severity, setSeverity] = useState<Severity>("warning");
  const [variant, setVariant] = useState<AlertVariant>("standard");
  const [showAction, setShowAction] = useState(true);
  const [showDismiss, setShowDismiss] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [actionNote, setActionNote] = useState<string | null>(null);

  const alertVisible = !dismissed;

  return (
    <div className="min-h-screen">
      <PageShell
        navCurrent="hub"
        kicker="Namethatui · Web · Alert vs. Callout vs. Banner"
        title="Inline Alert vs. Callout vs. Banner"
        intro="The yellow warning box is an inline alert: a notice that sits inside the content flow and stays until it is resolved or dismissed. Authored with the page and unable to close? That is a callout — GitHub writes it as &gt; [!WARNING]. The full-width strip across the very top of a site is a banner. Neither is a toast, which floats above the layout and leaves by itself."
      >
        <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Also called
        </p>
        <p className="-mt-1 text-sm leading-relaxed text-muted">
          inline alert · inline notification · callout · admonition · notice · warning box ·
          announcement banner · notification banner · site alert · status banner
        </p>

        {/* Intro strip */}
        <section className="mt-10">
          <SectionTitle note="One shape, three jobs — the difference is where it sits, whether it closes, and who put it there.">
            Three notices, one family
          </SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="flex flex-col gap-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                Alert
              </p>
              <Alert severity="warning" className="!px-3 !py-2.5 !text-[13px]">
                In the content flow, dismissible.
              </Alert>
              <p className="text-sm leading-relaxed text-muted">
                Appears next to the thing it qualifies, stays until resolved, and may be closed —
                like a reminder attached to a bill.
              </p>
              <Link
                href="/scenarios/account-settings"
                className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-accent-ink underline-offset-4 hover:underline"
              >
                /scenarios/account-settings <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Card>
            <Card className="flex flex-col gap-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                Callout
              </p>
              <Admonition type="WARNING" className="!px-3 !py-2.5 !text-[13px]">
                Authored with the page, static.
              </Admonition>
              <p className="text-sm leading-relaxed text-muted">
                Written into the document like a paragraph — no X, no pop-in. Docs and Markdown
                use it to qualify a sentence as it is read.
              </p>
              <Link
                href="/scenarios/docs-callouts"
                className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-accent-ink underline-offset-4 hover:underline"
              >
                /scenarios/docs-callouts <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Card>
            <Card className="flex flex-col gap-4">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                Banner
              </p>
              <SiteBanner tone="warning" className="rounded-lg !py-2 text-[13px]">
                Full-width, top of every page.
              </SiteBanner>
              <p className="text-sm leading-relaxed text-muted">
                A site-wide announcement that must be seen before anything else — transit
                disruptions, outages, deadlines. Prominent by position.
              </p>
              <Link
                href="/scenarios/site-banner"
                className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-accent-ink underline-offset-4 hover:underline"
              >
                /scenarios/site-banner <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Card>
          </div>
        </section>

        {/* Anatomy diagram */}
        <section className="mt-14">
          <SectionTitle note="Click the controls — the numbered labels chase the selection.">
            Anatomy — every part, named
          </SectionTitle>

          <Card className="p-8 sm:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Segmented
                  value={severity}
                  options={SEVERITIES}
                  onChange={(v) => {
                    setSeverity(v);
                    setDismissed(false);
                  }}
                  ariaLabel="Severity"
                />
                <Segmented
                  value={variant}
                  options={VARIANTS}
                  onChange={(v) => {
                    setVariant(v);
                    setDismissed(false);
                  }}
                  ariaLabel="Variant"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={showAction}
                  onClick={() => setShowAction((v) => !v)}
                  className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                    showAction
                      ? "border-accent/30 bg-accent-soft text-accent-ink"
                      : "border-line text-muted hover:text-ink"
                  }`}
                >
                  action
                </button>
                <button
                  type="button"
                  aria-pressed={showDismiss}
                  onClick={() => setShowDismiss((v) => !v)}
                  className={`rounded-full border px-3 py-1 font-mono text-xs transition ${
                    showDismiss
                      ? "border-accent/30 bg-accent-soft text-accent-ink"
                      : "border-line text-muted hover:text-ink"
                  }`}
                >
                  dismiss
                </button>
              </div>
            </div>

            <p className="mt-4 font-mono text-xs text-faint">
              {`<Alert severity="${severity}" variant="${variant}"`}
              {showAction ? " action" : ""}
              {showDismiss ? " onClose" : ""}
              {` />`}
            </p>

            <div
              className="relative mt-8 rounded-xl p-6 sm:p-10"
              style={{
                backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {alertVisible ? (
                <div className="relative mx-auto max-w-2xl">
                  {showDismiss && (
                    <>
                      <div
                        className="absolute -left-2 top-1/2 z-10 -translate-x-full -translate-y-1/2"
                        aria-hidden="true"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                            1
                          </span>
                          <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                            border-inline-start
                          </span>
                        </span>
                      </div>
                      <div
                        className="absolute left-0 top-1/2 h-px w-2 -translate-x-full bg-line-strong"
                        aria-hidden="true"
                      />
                    </>
                  )}

                  <div
                    className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full"
                    aria-hidden="true"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                        2
                      </span>
                      <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                        {`variant="${variant}"`}
                      </span>
                    </span>
                  </div>
                  <div
                    className="absolute bottom-full left-1/2 h-2 w-px -translate-x-1/2 bg-line-strong"
                    aria-hidden="true"
                  />

                  <div
                    className="absolute -top-2 left-3 z-10 -translate-y-full"
                    aria-hidden="true"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                        3
                      </span>
                      <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                        {`severity="${severity}"`}
                      </span>
                    </span>
                  </div>
                  <div
                    className="absolute bottom-full left-3 h-2 w-px bg-line-strong"
                    aria-hidden="true"
                  />

                  {showDismiss && (
                    <>
                      <div
                        className="absolute -right-2 top-1/2 z-10 translate-x-full -translate-y-1/2"
                        aria-hidden="true"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                            4
                          </span>
                          <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                            onClose
                          </span>
                        </span>
                      </div>
                      <div
                        className="absolute right-0 top-1/2 h-px w-2 translate-x-full bg-line-strong"
                        aria-hidden="true"
                      />
                    </>
                  )}

                  {showAction && (
                    <>
                      <div
                        className="absolute -bottom-2 right-4 z-10 translate-y-full"
                        aria-hidden="true"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                            5
                          </span>
                          <span className="whitespace-nowrap rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                            action
                          </span>
                        </span>
                      </div>
                      <div
                        className="absolute right-4 top-full h-2 w-px bg-line-strong"
                        aria-hidden="true"
                      />
                    </>
                  )}

                  <Alert
                    severity={severity}
                    variant={variant}
                    title="Payment method expiring"
                    onClose={
                      showDismiss
                        ? () => {
                            setDismissed(true);
                            setActionNote(null);
                          }
                        : undefined
                    }
                    action={
                      showAction ? (
                        <button
                          type="button"
                          onClick={() => setActionNote("The action slot received a click.")}
                        >
                          Review settings
                        </button>
                      ) : undefined
                    }
                    className="shadow-md"
                  >
                    Your card ends in 4821 and expires Aug 31. Review it before the renewal charge.
                  </Alert>
                </div>
              ) : (
                <div className="flex justify-center py-10">
                  <button
                    type="button"
                    onClick={() => setDismissed(false)}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-line-strong"
                  >
                    Alert dismissed — restore it
                  </button>
                </div>
              )}
            </div>

            {actionNote != null && (
              <p className="mt-4 text-center font-mono text-xs text-accent-ink">{actionNote}</p>
            )}
          </Card>
        </section>

        {/* Layered explanations */}
        <section className="mt-14">
          <SectionTitle note="Every named part, explained twice: for the person using the product, and for the person building it.">
            The five parts, in plain words
          </SectionTitle>
          <div className="overflow-hidden rounded-2xl border border-line bg-line">
            {PARTS.map((part, i) => (
              <div
                key={part.n}
                className={`grid md:grid-cols-2 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <div className="bg-surface p-5 sm:p-6">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                    What you see
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">
                      {part.n}
                    </span>
                    {part.name}
                    <code className="font-mono text-[10px] font-normal text-faint">{part.token}</code>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{part.see}</p>
                </div>
                <div className="border-t border-line bg-surface p-5 sm:p-6 md:border-l md:border-t-0">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent">
                    How it works
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{part.how}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live region card */}
        <section className="mt-14">
          <Card>
            <SectionTitle note="The trap worth knowing: role=&quot;banner&quot; is NOT the role for an announcement banner.">
              Live regions — when the message appears, not when it exists
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-paper/60 p-4">
                <p className="font-mono text-xs font-semibold text-ink">role=&quot;alert&quot;</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Assertive live region. Only for urgent messages inserted dynamically — screen
                  readers interrupt whatever they are saying.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-paper/60 p-4">
                <p className="font-mono text-xs font-semibold text-ink">role=&quot;status&quot;</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Polite live region. For advisory updates that must not interrupt — the reader
                  announces them at a pause.
                </p>
              </div>
              <div className="rounded-xl border border-line bg-paper/60 p-4">
                <p className="font-mono text-xs font-semibold text-ink">(no role)</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Static content present on page load needs no live region — a docs callout, or a
                  site alert that ships with the page.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              And the header landmark? <code className="font-mono text-xs">role=&quot;banner&quot;</code> is
              reserved for the site header — the masthead. The announcement strip across the top is
              plain markup; it must not steal the landmark role.
            </p>
          </Card>
        </section>

        <p className="mt-12 flex items-center gap-2 text-sm text-muted">
          Next scenario — the inline alert in a real settings screen:
          <Link
            href="/scenarios/account-settings"
            className="inline-flex items-center gap-1.5 font-semibold text-accent-ink underline-offset-4 hover:underline"
          >
            Billing &amp; plan settings <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
