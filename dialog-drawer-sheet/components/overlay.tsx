"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ── Focus management ────────────────────────────────────────────
   When an overlay is modal: move focus inside on open, trap Tab
   inside while open, close on Escape, restore focus to the trigger
   on close, and lock body scroll. Set modal={false} to skip the
   trap + scroll lock (non-modal drawer that keeps the page live). */

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

export function useOverlayBehavior({
  open,
  onClose,
  surfaceRef,
  modal = true,
  closeOnEscape = true,
}: {
  open: boolean;
  onClose: (reason: "escape" | "scrim" | "close-button" | "action") => void;
  surfaceRef: React.RefObject<HTMLElement | null>;
  modal?: boolean;
  closeOnEscape?: boolean;
}) {
  const restoreRef = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;

    if (modal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // Autofocus: first [data-autofocus], else first focusable, else surface
      const t = window.setTimeout(() => {
        const root = surfaceRef.current;
        if (!root) return;
        const auto = root.querySelector<HTMLElement>("[data-autofocus]");
        if (auto) {
          auto.focus();
          return;
        }
        const items = focusables(root);
        if (items.length > 0) items[0].focus();
        else {
          if (!root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");
          root.focus();
        }
      }, 30);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = prevOverflow;
        const restore = restoreRef.current as HTMLElement | null;
        if (restore && typeof restore.focus === "function") restore.focus();
      };
    } else {
      return () => {
        const restore = restoreRef.current as HTMLElement | null;
        if (restore && typeof restore.focus === "function") restore.focus();
      };
    }
  }, [open, modal, surfaceRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onCloseRef.current("escape");
      }
      if (e.key !== "Tab" || !modal) return;
      const root = surfaceRef.current;
      if (!root) return;
      const items = focusables(root);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [modal, closeOnEscape, surfaceRef],
  );

  return { handleKeyDown };
}

/* ── Scrim ── */

export function Scrim({
  onClick,
  label = "Close dialog",
  transparent = false,
}: {
  onClick: () => void;
  label?: string;
  transparent?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`animate-scrim-in absolute inset-0 cursor-default ${
        transparent ? "bg-transparent" : "bg-stone-950/50 backdrop-blur-[2px]"
      }`}
    />
  );
}

/* ── Surface chrome shared bits ── */

export function SurfaceHeader({
  title,
  description,
  onClose,
  closeLabel = "Close",
}: {
  title: string;
  description?: string;
  onClose: () => void;
  closeLabel?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="min-w-0 flex-1">
        <h2 id="overlay-title" className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p id="overlay-desc" className="mt-1 text-sm leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-alt hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
      >
        <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

/* ── Native modal <dialog> wrapper ──
   Uses a real <dialog> element + showModal() so the browser provides
   the top layer, inert background, ::backdrop, and Escape handling.
   We still manage focus return + scroll-friendly centering ourselves. */

export function NativeModal({
  open,
  onClose,
  children,
  labelledBy = "overlay-title",
  describedBy,
  wide = false,
}: {
  open: boolean;
  onClose: (reason: "escape" | "scrim" | "close-button" | "action") => void;
  children: ReactNode;
  labelledBy?: string;
  describedBy?: string;
  wide?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [closing, setClosing] = useState(false);
  const programmaticRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const restoreRef = useRef<Element | null>(null);

  // Open / close the native dialog imperatively
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      restoreRef.current = document.activeElement;
      dlg.showModal();
      const t = window.setTimeout(() => {
        const auto = dlg.querySelector<HTMLElement>("[data-autofocus]");
        if (auto) auto.focus();
        else {
          const first = dlg.querySelector<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
          );
          (first ?? dlg).focus();
        }
      }, 30);
      return () => window.clearTimeout(t);
    }
    if (!open && dlg.open) {
      if (!closing) dlg.close();
    }
  }, [open, closing]);

  // Restore focus to the trigger after close
  useEffect(() => {
    if (!open) {
      const restore = restoreRef.current as HTMLElement | null;
      if (restore && typeof restore.focus === "function") {
        const t = window.setTimeout(() => restore.focus(), 30);
        return () => window.clearTimeout(t);
      }
    }
  }, [open ]);

  function requestClose(reason: "escape" | "scrim" | "close-button" | "action") {
    const dlg = dialogRef.current;
    if (!dlg) {
      onCloseRef.current(reason);
      return;
    }
    programmaticRef.current = true;
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      if (dlg.open) dlg.close();
      // dialog's own onClose fires from dlg.close() — swallow it there
      window.setTimeout(() => {
        programmaticRef.current = false;
        onCloseRef.current(reason);
      }, 0);
    }, 140);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClose={() => {
        // Fired on native Escape too — report it unless we already did
        if (programmaticRef.current) return;
        if (open) onCloseRef.current("escape");
      }}
      onClick={(e) => {
        // Scrim click = click directly on the <dialog> box outside the card
        if (e.target === dialogRef.current) requestClose("scrim");
      }}
      className="overlay-dialog m-auto bg-transparent p-4 backdrop:bg-stone-950/50"
    >
      <div
        role="document"
        className={`${wide ? "w-[min(560px,calc(100vw-2rem))]" : "w-[min(440px,calc(100vw-2rem))]"} rounded-2xl border border-border bg-surface p-6 text-left shadow-2xl shadow-stone-950/25 ${
          closing ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        {children}
      </div>
    </dialog>
  );
}

/* ── Drawer (side slide-over) ── */

export function Drawer({
  open,
  onClose,
  children,
  modal = true,
  side = "right",
  width = "w-[min(420px,calc(100vw-3rem))]",
  labelledBy = "overlay-title",
  describedBy,
}: {
  open: boolean;
  onClose: (reason: "escape" | "scrim" | "close-button" | "action") => void;
  children: ReactNode;
  modal?: boolean;
  side?: "right" | "left";
  width?: string;
  labelledBy?: string;
  describedBy?: string;
}) {
  const surfaceRef = useRef<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);
  const { handleKeyDown } = useOverlayBehavior({
    open,
    onClose,
    surfaceRef,
    modal,
    closeOnEscape: false,
  });

  function requestClose(reason: "escape" | "scrim" | "close-button" | "action") {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose(reason);
    }, 170);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      {modal && <Scrim onClick={() => requestClose("scrim")} />}
      <div
        className={`absolute inset-y-0 flex ${side === "right" ? "right-0" : "left-0"}`}
      >
        <section
          ref={(el) => {
            surfaceRef.current = el;
          }}
          role="dialog"
          aria-modal={modal ? "true" : undefined}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === "Escape") {
              e.stopPropagation();
              requestClose("escape");
            }
          }}
          className={`${width} flex flex-col border-border bg-surface shadow-2xl shadow-stone-950/20 ${
            side === "right" ? "border-l" : "border-r"
          } ${closing ? "animate-drawer-out" : "animate-drawer-in"}`}
        >
          {children}
        </section>
      </div>
      {/* Proxy close reasons for header buttons rendered via children:
          children call onClose directly; wrap escape/scrim here. */}
      <span className="hidden" data-close-proxy={closing} />
    </div>
  );
}

/* ── Bottom sheet ── */

export function Sheet({
  open,
  onClose,
  children,
  modal = true,
  labelledBy = "overlay-title",
  describedBy,
}: {
  open: boolean;
  onClose: (reason: "escape" | "scrim" | "close-button" | "action") => void;
  children: ReactNode;
  modal?: boolean;
  labelledBy?: string;
  describedBy?: string;
}) {
  const surfaceRef = useRef<HTMLElement | null>(null);
  const [closing, setClosing] = useState(false);
  const { handleKeyDown } = useOverlayBehavior({
    open,
    onClose,
    surfaceRef,
    modal,
    closeOnEscape: false,
  });

  function requestClose(reason: "escape" | "scrim" | "close-button" | "action") {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose(reason);
    }, 180);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <Scrim onClick={() => requestClose("scrim")} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-6">
        <section
          ref={(el) => {
            surfaceRef.current = el;
          }}
          role="dialog"
          aria-modal={modal ? "true" : undefined}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          onKeyDown={(e) => {
            handleKeyDown(e);
            if (e.key === "Escape") {
              e.stopPropagation();
              requestClose("escape");
            }
          }}
          className={`pointer-events-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-stone-950/25 ${
            closing ? "animate-sheet-out" : "animate-sheet-in"
          }`}
        >
          <div className="flex justify-center pt-2.5" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-border-strong" />
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
