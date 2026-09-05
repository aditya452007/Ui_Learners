"use client";

import Link from "next/link";
import { useState } from "react";
import { DemoNav } from "@/components/nav";
import { NativeModal, SurfaceHeader } from "@/components/overlay";

const WORKSPACE = "acme-marketing";

export default function DeleteConfirmationPage() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [log, setLog] = useState<string[]>([
    "settings loaded — no dialog open, page fully interactive.",
  ]);
  const [deleted, setDeleted] = useState(false);

  const matches = typed.trim() === WORKSPACE;

  function push(msg: string) {
    setLog((l) => [...l.slice(-4), msg]);
  }

  function handleClose(reason: string) {
    setOpen(false);
    setTyped("");
    const label =
      reason === "escape"
        ? "Escape key"
        : reason === "scrim"
          ? "scrim click"
          : reason === "close-button"
            ? "× / Cancel"
            : reason;
    push(`dialog closed via ${label} — focus returned to “Delete workspace”.`);
  }

  function confirm() {
    setOpen(false);
    setTyped("");
    setDeleted(true);
    push("workspace deleted via Delete button — confirmed with typed name.");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Scenario 1 · Centered modal
        </p>
        <DemoNav current="/scenarios/delete-confirmation" />
      </div>

      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Workspace settings — delete confirmation
        </h1>
        <p className="max-w-2xl leading-relaxed text-text-muted">
          A SaaS settings screen where one destructive choice deserves a fully
          blocking moment. The native{" "}
          <code className="rounded bg-surface-alt px-1 font-mono text-[13px]">{"<dialog>"}</code>{" "}
          goes up with{" "}
          <code className="rounded bg-surface-alt px-1 font-mono text-[13px]">showModal()</code>:
          top layer, inert background,{" "}
          <code className="rounded bg-surface-alt px-1 font-mono text-[13px]">::backdrop</code>{" "}
          scrim, and Escape handling from the browser.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Settings page */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-accent-light text-xl font-bold text-accent">
              A
            </span>
            <div>
              <h2 className="text-lg font-semibold">acme-marketing</h2>
              <p className="text-sm text-text-muted">Pro plan · 14 members · 6 projects</p>
            </div>
            <span className="ml-auto rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              Active
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { t: "General", d: "Name, icon, default timezone." },
              { t: "Members", d: "Invite, roles, SSO enforcement." },
              { t: "Billing", d: "Pro plan, renews Oct 1 · $240/yr." },
            ].map((row) => (
              <div
                key={row.t}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{row.t}</p>
                  <p className="text-[13px] text-text-muted">{row.d}</p>
                </div>
                <button
                  type="button"
                  className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-foreground"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-danger/30 bg-danger/[0.04] p-5">
            <h3 className="text-sm font-semibold text-danger">Danger zone</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
              Deleting removes all 6 projects and revokes access for 14 members
              immediately. This cannot be undone.
            </p>
            <button
              type="button"
              disabled={deleted}
              onClick={() => {
                setOpen(true);
                push("dialog opened with showModal() — page inert, focus moved to the input.");
              }}
              className="mt-3 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleted ? "Workspace deleted" : "Delete workspace…"}
            </button>
          </div>

          {deleted && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-success/30 bg-success/[0.06] px-4 py-3 text-sm text-success"
            >
              Workspace deleted (demo). Reload the page to run it again — in a
              real app you would redirect to the workspace picker here.
            </div>
          )}
        </div>

        {/* Why + log */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold">Why a modal fits here</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
              One short, consequential, irreversible decision. The user gains a
              forced pause: the page goes inert so nothing else can be clicked
              mid-delete, and type-to-confirm turns a slip into a deliberate
              act. Fewer catastrophic errors, zero navigation away from
              settings.
            </p>
            <p className="mt-3 rounded-lg bg-surface-alt px-3 py-2 font-mono text-[11px] leading-relaxed text-text-muted">
              {"<dialog>"} · showModal() → top layer + inert + ::backdrop + Esc
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold">Event log</h2>
            <ul className="mt-2 space-y-1.5">
              {log.map((entry, i) => (
                <li
                  key={`${i}-${entry}`}
                  className="rounded-lg bg-surface-alt px-3 py-2 font-mono text-[11px] leading-relaxed text-text-muted"
                >
                  {entry}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-text-faint">
              Try every exit: × button, Cancel, Escape, and clicking the dark
              surround. Focus always lands back on “Delete workspace”.
            </p>
          </div>
        </aside>
      </div>

      <NativeModal open={open} onClose={handleClose} describedBy="delete-desc">
        <SurfaceHeader
          title="Delete “acme-marketing”?"
          description="This permanently removes 6 projects and 14 memberships."
          onClose={() => handleClose("close-button")}
        />
        <p id="delete-desc" className="mt-4 text-sm leading-relaxed text-text-muted">
          To confirm, type the workspace name{" "}
          <code className="rounded bg-surface-alt px-1 font-mono text-xs">acme-marketing</code>{" "}
          below. The Delete button stays disabled until it matches — like a
          safety catch on a trigger.
        </p>
        <label className="mt-4 block text-xs font-semibold text-text-muted">
          Workspace name
          <input
            data-autofocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="acme-marketing"
            autoComplete="off"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground placeholder:text-text-faint focus:border-danger focus:ring-2 focus:ring-danger/25 focus:outline-none"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleClose("close-button")}
            className="rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!matches}
            onClick={confirm}
            className="rounded-lg bg-danger px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete workspace
          </button>
        </div>
      </NativeModal>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          ← Back to hub
        </Link>
        <Link
          href="/scenarios/inventory-editor"
          className="text-sm font-medium text-accent hover:underline"
        >
          Next: inventory drawer →
        </Link>
      </div>
    </main>
  );
}
