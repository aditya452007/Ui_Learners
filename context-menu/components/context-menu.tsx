"use client";

import { useEffect, useRef, useState } from "react";

type Separator = { type: "separator" };
type ActionItem = {
  label: string;
  keyEq?: string;
  danger?: boolean;
  disabled?: boolean;
  submenu?: MenuItem[];
  icon?: React.ReactNode;
};
export type MenuItem = Separator | ActionItem;

export function ContextMenu({
  items,
  pos,
  open,
  onClose,
  onAction,
}: {
  items: MenuItem[];
  pos: { x: number; y: number } | null;
  open: boolean;
  onClose: () => void;
  onAction: (label: string) => void;
}) {
  const [hl, setHl] = useState<number>(-1);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [adjusted, setAdjusted] = useState<{ x: number; y: number } | null>(null);

  // reset hl when items change / open
  useEffect(() => {
    if (open) {
      const first = items.findIndex((i) => !("type" in i && i.type === "separator") && !(i as { disabled?: boolean }).disabled);
      setHl(first);
      setOpenSub(null);
    }
  }, [open, items]);

  // viewport clamp
  useEffect(() => {
    if (!pos || !open || !ref.current) {
      setAdjusted(pos);
      return;
    }
    const r = ref.current.getBoundingClientRect();
    let x = pos.x;
    let y = pos.y;
    const pad = 8;
    if (x + r.width > window.innerWidth - pad) x = Math.max(pad, window.innerWidth - r.width - pad);
    if (y + r.height > window.innerHeight - pad) y = Math.max(pad, window.innerHeight - r.height - pad);
    if (x < pad) x = pad;
    if (y < pad) y = pad;
    setAdjusted({ x, y });
  }, [pos, open, items]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let n = hl;
        for (let i = 0; i < items.length; i++) {
          n = (n + 1) % items.length;
          const it = items[n];
          if (!isSeparator(it) && !(it as ActionItem).disabled) break;
        }
        setHl(n);
        const it = items[n];
        const asAction = isSeparator(it) ? null : (it as ActionItem);
        setOpenSub(asAction?.submenu ? n : null);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        let n = hl;
        for (let i = 0; i < items.length; i++) {
          n = (n - 1 + items.length) % items.length;
          const it = items[n];
          if (!isSeparator(it) && !(it as ActionItem).disabled) break;
        }
        setHl(n);
        const it = items[n];
        const asAction = isSeparator(it) ? null : (it as ActionItem);
        setOpenSub(asAction?.submenu ? n : null);
      }
      if (e.key === "ArrowRight") {
        const it = items[hl] as { submenu?: MenuItem[] };
        if (it?.submenu) setOpenSub(hl);
      }
      if (e.key === "ArrowLeft") setOpenSub(null);
      if (e.key === "Enter") {
        const it = items[hl] as { label?: string; submenu?: MenuItem[]; disabled?: boolean };
        if (it && !it.submenu && !it.disabled) onAction(it.label!);
      }
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, hl, items, onClose, onAction]);

  if (!open || !pos || !adjusted) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className="animate-menu-in fixed z-50 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white/95 shadow-[0_16px_40px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-xl"
      style={{ left: adjusted.x, top: adjusted.y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="p-1.5">
        {items.map((it, idx) => {
          if (isSeparator(it)) return <div key={idx} role="separator" className="mx-1.5 my-1 h-px bg-zinc-200" />;
          const item = it as ActionItem;
          const hasSub = !!item.submenu && item.submenu.length > 0;
          const isHl = hl === idx;
          const isOpen = openSub === idx;
          return (
            <div
              key={item.label + idx}
              role="menuitem"
              aria-haspopup={hasSub ? "menu" : undefined}
              aria-expanded={hasSub ? isOpen : undefined}
              aria-disabled={item.disabled}
              onMouseEnter={() => {
                if (item.disabled) return;
                setHl(idx);
                setOpenSub(hasSub ? idx : null);
              }}
              onClick={() => {
                if (item.disabled || hasSub) return;
                onAction(item.label);
              }}
              className={`relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm ${
                item.disabled
                  ? "cursor-default opacity-40"
                  : isHl
                    ? "bg-accent text-white"
                    : item.danger
                      ? "text-danger hover:bg-red-50"
                      : "text-foreground hover:bg-zinc-100"
              }`}
            >
              {item.icon ? (
                <span className={`shrink-0 ${isHl && !item.disabled ? "text-white" : item.danger ? "text-red-500" : "text-zinc-500"}`}>{item.icon}</span>
              ) : null}
              <span className={`flex-1 text-[13px] font-medium leading-none ${isHl && !item.disabled ? "text-white" : ""}`}>{item.label}</span>
              {item.keyEq && <span className={`ml-auto font-mono text-xs ${isHl && !item.disabled ? "text-white/80" : "text-zinc-400"}`}>{item.keyEq}</span>}
              {hasSub && (
                <svg viewBox="0 0 16 16" className={`h-3 w-3 shrink-0 ${isHl && !item.disabled ? "text-white/80" : "text-zinc-400"}`} fill="none" stroke="currentColor" strokeWidth={1.7}>
                  <path d="M6 3.2 10 8 6 12.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {hasSub && isOpen && (
                <div
                  role="menu"
                  className="animate-submenu-in absolute left-full top-0 ml-1.5 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white/95 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl"
                  onMouseLeave={(e) => e.stopPropagation()}
                >
                  {item.submenu!.map((s, si) => {
                    if (isSeparator(s)) return <div key={si} role="separator" className="mx-1.5 my-1 h-px bg-zinc-200" />;
                    const sub = s as ActionItem;
                    return (
                      <div
                        key={sub.label + si}
                        role="menuitem"
                        aria-disabled={sub.disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sub.disabled) return;
                          onAction(sub.label);
                        }}
                        className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm ${sub.disabled ? "opacity-40" : "hover:bg-zinc-100"} ${sub.danger ? "text-danger" : "text-foreground"}`}
                      >
                        {sub.icon ? <span className="shrink-0 text-zinc-500">{sub.icon}</span> : null}
                        <span className="flex-1 text-[13px] font-medium">{sub.label}</span>
                        {sub.keyEq && <span className="ml-auto font-mono text-xs text-zinc-400">{sub.keyEq}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isSeparator(v: MenuItem): v is Separator {
  return typeof v === "object" && v !== null && "type" in (v as Record<string, unknown>) && (v as { type: string }).type === "separator";
}

export function useContextMenu() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };
  const close = () => setOpen(false);
  return { pos, open, handleContextMenu, close, setPos, setOpen };
}
