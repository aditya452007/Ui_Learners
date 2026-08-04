"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { PageShell, Card, SectionTitle } from "@/components/page-shell";
import { Alert } from "@/components/alert";

const SECTION_LINKS = [
  { id: "plan", label: "Plan" },
  { id: "payment", label: "Payment" },
  { id: "notifications", label: "Notifications" },
  { id: "data", label: "Data & privacy" },
] as const;

type SectionId = (typeof SECTION_LINKS)[number]["id"];

function PrimaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}

function GhostButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink transition hover:border-line-strong hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    />
  );
}

function ConfigCaption({ code, note }: { code: string; note: string }) {
  return (
    <p className="mt-2 text-xs leading-relaxed text-muted">
      <span className="font-mono text-[11px] text-faint">{code}</span>
      <span> — {note}</span>
    </p>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          checked ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function AccountSettingsScenario() {
  const [activeSection, setActiveSection] = useState<SectionId>("plan");
  const [paymentVisible, setPaymentVisible] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [cardUpdated, setCardUpdated] = useState(false);
  const [exportBlocked, setExportBlocked] = useState(false);
  const [exportStarted, setExportStarted] = useState(false);
  const [storageAlerts, setStorageAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const resetDemo = () => {
    setActiveSection("plan");
    setPaymentVisible(true);
    setReviewOpen(false);
    setCardUpdated(false);
    setExportBlocked(false);
    setExportStarted(false);
    setStorageAlerts(true);
    setWeeklyDigest(true);
  };

  return (
    <PageShell
      navCurrent="settings"
      kicker="Scenario 1 · The inline alert in the content flow"
      title="Billing & plan settings"
      intro="Orbit is a cloud-storage product. This is its billing screen — four inline alerts, four different configurations, each placed where a real product would put it: in the content flow, next to the field it concerns."
    >
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Settings sections">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-faint">
              Account settings
            </p>
            <ul className="mt-3 space-y-1">
              {SECTION_LINKS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    aria-current={activeSection === section.id ? "true" : undefined}
                    className={`block rounded-lg px-3 py-1.5 font-mono text-xs transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      activeSection === section.id
                        ? "bg-accent-soft font-medium text-accent-ink"
                        : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Every alert on this page uses a different severity, variant and live-region
              combination — the exact configuration is captioned under each one.
            </p>
            <GhostButton onClick={resetDemo}>Reset demo</GhostButton>
          </div>

          <div className="mt-8 space-y-8">
            <section id="plan" className="scroll-mt-24">
              <Card>
                <SectionTitle note="The plan summary is where a failed renewal or a quota warning would surface — an inline alert lands right below the numbers it concerns.">
                  Plan
                </SectionTitle>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">Orbit Pro</p>
                    <p className="mt-0.5 text-xs text-muted">
                      2 TB storage · renews Aug 31 · $12.99 / month
                    </p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium text-accent-ink">
                    PRO
                  </span>
                </div>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs font-medium text-muted">Storage used</p>
                    <p className="font-mono text-xs text-faint">1.24 TB / 2 TB · 62%</p>
                  </div>
                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-line"
                    aria-hidden="true"
                  >
                    <div className="h-full w-[62%] rounded-full bg-accent" />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                  <PrimaryButton>Change plan</PrimaryButton>
                  <GhostButton>Cancel plan</GhostButton>
                </div>
              </Card>
            </section>

            <section id="payment" className="scroll-mt-24">
              <Card>
                <SectionTitle note="The warning alert sits between the payment summary and the form — the user sees the problem next to the card it concerns, with a single next action.">
                  Payment
                </SectionTitle>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-faint">
                      Payment method
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {cardUpdated
                        ? "Visa •••• 7331 · expires 07/30"
                        : "Visa •••• 4821 · expires 08/26"}
                    </p>
                  </div>
                  <p className="text-xs text-muted">Invoices go to billing@example.com</p>
                </div>

                {paymentVisible ? (
                  <div className="mt-5">
                    <Alert
                      severity="warning"
                      variant="standard"
                      liveRegion="none"
                      title="Payment method expiring"
                      closeLabel="Dismiss payment reminder"
                      onClose={() => setPaymentVisible(false)}
                      action={
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => setReviewOpen((open) => !open)}
                        >
                          {reviewOpen ? "Close" : "Review payment"}
                        </button>
                      }
                    >
                      Your card Visa •••• 4821 expires at the end of August. Orbit keeps backing
                      up your files either way, but updating now avoids a failed charge on Aug 31.
                    </Alert>
                    <ConfigCaption
                      code={'<Alert severity="warning" variant="standard" liveRegion="none" action onClose />'}
                      note="Silent on load — the alert is already on screen when the page opens, so there is nothing new to announce. Dismissing it swaps in a polite status alert."
                    />

                    {reviewOpen && (
                      <div className="mt-4 rounded-xl border border-line bg-paper p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-faint">
                          Replace payment method
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-medium text-muted">
                              Card number
                            </span>
                            <input
                              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
                              defaultValue="4242 4242 4242 4821"
                              inputMode="numeric"
                            />
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                              <span className="mb-1 block text-xs font-medium text-muted">
                                Expiry
                              </span>
                              <input
                                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
                                defaultValue="07/30"
                                inputMode="numeric"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-1 block text-xs font-medium text-muted">
                                CVC
                              </span>
                              <input
                                className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
                                defaultValue="•••"
                                inputMode="numeric"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <PrimaryButton
                            onClick={() => {
                              setCardUpdated(true);
                              setPaymentVisible(false);
                              setReviewOpen(false);
                            }}
                          >
                            Update card
                          </PrimaryButton>
                          <GhostButton onClick={() => setReviewOpen(false)}>
                            Cancel
                          </GhostButton>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-5">
                    <Alert
                      severity="success"
                      liveRegion="status"
                      title={cardUpdated ? "Card updated" : "Reminder hidden"}
                    >
                      {cardUpdated
                        ? "Visa •••• 7331 is now on file and will be charged on Aug 31."
                        : "Payment reminder hidden — we'll remind you again in 7 days."}
                    </Alert>
                    <ConfigCaption
                      code={'<Alert severity="success" liveRegion="status" />'}
                      note="role=status is polite: the message is announced once the screen reader is idle — it confirms the outcome without interrupting anything."
                    />
                  </div>
                )}
              </Card>
            </section>

            <section id="notifications" className="scroll-mt-24">
              <Card>
                <SectionTitle note="A static advisory: it explains policy before the user changes a setting, so it needs no close button, no action and no live region.">
                  Notifications
                </SectionTitle>
                <div className="divide-y divide-line">
                  <Toggle
                    label="Storage usage alerts"
                    description="Email me when I reach 90% of my 2 TB plan."
                    checked={storageAlerts}
                    onChange={setStorageAlerts}
                  />
                  <Toggle
                    label="Weekly digest"
                    description="A short summary of activity in my account, every Monday."
                    checked={weeklyDigest}
                    onChange={setWeeklyDigest}
                  />
                </div>
                <div className="mt-5">
                  <Alert severity="info" liveRegion="none" title="Email frequency">
                    Orbit sends at most one digest per week and pings you only about things that
                    need action — a failed payment, a drive at 90%. You can mute any of it from
                    this screen.
                  </Alert>
                  <ConfigCaption
                    code={'<Alert severity="info" variant="standard" liveRegion="none" />'}
                    note="No live region on purpose: the alert is part of the static content from the moment the page loads — announcing static text would be noise, not signal."
                  />
                </div>
              </Card>
            </section>

            <section id="data" className="scroll-mt-24">
              <Card>
                <SectionTitle note="Both alerts here are rendered only after the click — and that is exactly when a live region should speak: dynamic content entering the page.">
                  Data & privacy
                </SectionTitle>
                <p className="text-sm leading-relaxed text-muted">
                  Download everything Orbit stores about you: files, version history, shared
                  links and activity logs. Archives are kept for 30 days.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <PrimaryButton
                    disabled={exportBlocked}
                    onClick={() => setExportBlocked(true)}
                  >
                    Export all data
                  </PrimaryButton>
                  <p className="text-xs text-muted">
                    {exportBlocked
                      ? "One export at a time — the button re-enables once the archive is emailed."
                      : "Usually delivered within minutes."}
                  </p>
                </div>
                {exportBlocked && (
                  <div className="mt-5">
                    <Alert
                      severity="error"
                      variant="filled"
                      liveRegion="alert"
                      title="Export already in progress"
                    >
                      A full export has been running for the last 2 minutes. You&apos;ll get an email
                      with a download link the moment it&apos;s ready.
                    </Alert>
                    <ConfigCaption
                      code={'<Alert severity="error" variant="filled" liveRegion="alert" />'}
                      note="role=alert is assertive: it interrupts the screen reader immediately — right for 'stop, something urgent needs your attention'."
                    />
                  </div>
                )}
                {exportStarted ? (
                  <div className="mt-5">
                    <Alert
                      severity="success"
                      variant="outlined"
                      liveRegion="status"
                      title="Export started"
                    >
                      Your export is being prepared — you&apos;ll get an email when it&apos;s ready.
                    </Alert>
                    <ConfigCaption
                      code={'<Alert severity="success" variant="outlined" liveRegion="status" />'}
                      note="role=status is polite: announced only when the screen reader is idle, never cutting off something the user is already hearing."
                    />
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-line-strong bg-paper p-4">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        Generate a fresh archive?
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">
                        The running export was started a while ago — start a new one if you need
                        current data.
                      </p>
                    </div>
                    <GhostButton onClick={() => setExportStarted(true)}>
                      Start export
                    </GhostButton>
                  </div>
                )}
              </Card>
            </section>

            <Card>
              <SectionTitle>Why the inline alert fits here</SectionTitle>
              <p className="text-sm leading-relaxed text-muted">
                In settings, errors and warnings arrive mid-task — a card expiring, an export
                colliding with one already running. The inline alert keeps context: the message
                sits in the content flow, next to the field it concerns, with a single next
                action. It disappears only when resolved or dismissed, and the dismiss control
                matters because settings are revisited — a polite status alert confirms the
                outcome without re-alarming.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
