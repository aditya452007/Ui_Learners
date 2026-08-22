"use client";

import { useState } from "react";
import { useToasts, ToastViewport } from "@/components/toast";
import { ScenarioNav } from "@/components/scenario-nav";

type FileRow = {
  id: string;
  name: string;
  size: string;
  modified: string;
  badge: string;
  badgeClass: string;
};

const INITIAL_FILES: FileRow[] = [
  {
    id: "f1",
    name: "brand-guidelines-v3.pdf",
    size: "4.2 MB",
    modified: "Aug 14, 2026",
    badge: "PDF",
    badgeClass: "bg-red-100 text-red-700",
  },
  {
    id: "f2",
    name: "kickoff-deck.pptx",
    size: "11.8 MB",
    modified: "Aug 12, 2026",
    badge: "PPTX",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  {
    id: "f3",
    name: "budget-2026.xlsx",
    size: "864 KB",
    modified: "Aug 11, 2026",
    badge: "XLSX",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "f4",
    name: "team-photo.jpg",
    size: "3.1 MB",
    modified: "Aug 9, 2026",
    badge: "JPG",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    id: "f5",
    name: "contract-draft.docx",
    size: "212 KB",
    modified: "Aug 7, 2026",
    badge: "DOCX",
    badgeClass: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "f6",
    name: "logo-assets.zip",
    size: "24.6 MB",
    modified: "Aug 2, 2026",
    badge: "ZIP",
    badgeClass: "bg-amber-100 text-amber-700",
  },
];

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function FileManagerUndoPage() {
  const { toasts, push, dismiss } = useToasts();
  // The full list is the source of truth; a row is only hidden while its
  // undo window is open. Undo clears the id; expiry leaves it deleted.
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<string>>(new Set());
  const files = INITIAL_FILES.filter((f) => !deletedIds.has(f.id));

  function handleDelete(file: FileRow) {
    setDeletedIds((prev) => new Set(prev).add(file.id));
    push({
      title: `"${file.name}" moved to trash`,
      description: "You can undo this for the next few seconds.",
      status: "info",
      duration: 7000,
      action: {
        label: "Undo",
        onClick: () =>
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(file.id);
            return next;
          }),
      },
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <ScenarioNav current="file-manager-undo" />

        <header className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
            Scenario · File manager
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Delete with an Undo safety net
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
            Delete a file below. The row disappears instantly (optimistic UI)
            and a toast appears in the corner with an{" "}
            <span className="font-semibold text-foreground">Undo</span> action.
            Undo within 7 seconds and the file returns to its original spot;
            let the toast expire and the deletion stands.
          </p>
        </header>

        {/* File list */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-base font-semibold">Acme Cloud — My files</h2>
              <p className="mt-0.5 text-xs text-text-faint">
                {files.length} {files.length === 1 ? "item" : "items"}
              </p>
            </div>
            <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
              Synced just now
            </span>
          </div>

          <div className="grid grid-cols-[1fr_7rem_9rem_3rem] items-center gap-4 border-b border-border bg-surface-alt px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-faint">
            <span>Name</span>
            <span className="text-right">Size</span>
            <span className="text-right">Modified</span>
            <span className="sr-only">Actions</span>
          </div>

          <ul>
            {files.map((file) => (
              <li
                key={file.id}
                className="group grid grid-cols-[1fr_7rem_9rem_3rem] items-center gap-4 border-b border-border px-6 py-3.5 transition-colors last:border-b-0 hover:bg-surface-alt"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`inline-flex w-12 shrink-0 justify-center rounded-md px-1.5 py-1 font-mono text-[10px] font-bold tracking-wide ${file.badgeClass}`}
                  >
                    {file.badge}
                  </span>
                  <span className="truncate text-sm font-medium">
                    {file.name}
                  </span>
                </div>
                <span className="text-right font-mono text-xs text-text-muted">
                  {file.size}
                </span>
                <span className="text-right text-xs text-text-muted">
                  {file.modified}
                </span>
                <div className="flex justify-end">
                  <button
                    type="button"
                    aria-label={`Delete ${file.name}`}
                    onClick={() => handleDelete(file)}
                    className="rounded-lg p-2 text-text-faint transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
            {files.length === 0 && (
              <li className="px-6 py-12 text-center text-sm text-text-faint">
                Everything is in the trash — undo before the toasts expire.
              </li>
            )}
          </ul>
        </section>

        {/* Why a toast here */}
        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-sm font-semibold">Why a toast here?</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            A confirmation modal for every delete would be torture at scale —
            you&apos;d click through dozens a day and start approving them on
            reflex. Instead the app acts first and offers one safe reversal in
            the corner; the 7-second window matches how long you stay in
            context before moving on.
          </p>
        </section>

        {/* Spec strip */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[
            'role="status"',
            "ToastAction=Undo",
            "duration=7000",
            "optimistic delete",
          ].map((chip) => (
            <code
              key={chip}
              className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted"
            >
              {chip}
            </code>
          ))}
        </div>
      </main>

      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
