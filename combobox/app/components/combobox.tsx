"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type ComboOption = {
  id: string;
  label: string;
  sub?: string;
  badge?: string;
  avatar?: string;
  avatarColor?: string;
  disabled?: boolean;
  disabledReason?: string;
};

type Props = {
  label: string;
  placeholder?: string;
  options: ComboOption[];
  value: ComboOption | null;
  onSelect: (opt: ComboOption | null) => void;
  allowCustom?: boolean;
  customLabel?: (text: string) => string;
  onCustom?: (text: string) => void;
  emptyText?: string;
  size?: "md" | "sm";
  /** anatomy highlight: 1=input 2=listbox 3=active 4=checkmark */
  highlight?: number | null;
  /** keep the popup open on mount for the anatomy diagram */
  defaultOpen?: boolean;
  hint?: string;
  onOpenChange?: (open: boolean) => void;
  onActiveChange?: (id: string | null) => void;
};

export default function Combobox({
  label,
  placeholder = "Type to search…",
  options,
  value,
  onSelect,
  allowCustom = false,
  customLabel,
  onCustom,
  emptyText = "No matches. Try a different spelling.",
  size = "md",
  highlight = null,
  defaultOpen = false,
  hint,
  onOpenChange,
  onActiveChange,
}: Props) {
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  const listId = `combo-list-${base}`;
  const labelId = `combo-label-${base}`;
  const [inputValue, setInputValue] = useState(value?.label ?? "");
  const [open, setOpen] = useState(defaultOpen);
  const [activeId, setActiveId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // keep input text in sync when a selection lands from outside
  useEffect(() => {
    setInputValue(value?.label ?? "");
  }, [value?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sub && o.sub.toLowerCase().includes(q)) ||
        (o.badge && o.badge.toLowerCase().includes(q))
    );
  }, [inputValue, options]);

  const enabled = useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);

  // reset active option whenever the list changes
  useEffect(() => {
    if (!open) {
      setActiveId(null);
      return;
    }
    if (enabled.length === 0) {
      setActiveId(allowCustom && inputValue.trim() ? "__custom__" : null);
      return;
    }
    // keep current if still visible, else jump to first
    if (!activeId || !enabled.some((o) => o.id === activeId)) {
      setActiveId(enabled[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, open, inputValue]);

  // keep the active row scrolled into view (focus stays in the input)
  useEffect(() => {
    onOpenChange?.(open);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    onActiveChange?.(activeId);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open || !activeId || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-opt="${activeId}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeId, open]);

  function move(dir: 1 | -1) {
    if (!open) {
      setOpen(true);
      if (enabled.length > 0) setActiveId(enabled[0].id);
      return;
    }
    const pool = allowCustom && inputValue.trim() ? [...enabled.map((o) => o.id), "__custom__"] : enabled.map((o) => o.id);
    if (pool.length === 0) return;
    const i = pool.indexOf(activeId ?? "");
    const next = i === -1 ? (dir === 1 ? 0 : pool.length - 1) : (i + dir + pool.length) % pool.length;
    setActiveId(pool[next]);
  }

  function commit(id: string | null) {
    if (id === "__custom__") {
      const text = inputValue.trim();
      if (!text) return;
      onCustom?.(text);
      setOpen(false);
      setActiveId(null);
      inputRef.current?.focus();
      return;
    }
    const opt = options.find((o) => o.id === id) ?? null;
    if (opt?.disabled) return;
    onSelect(opt);
    if (opt) setInputValue(opt.label);
    setOpen(false);
    setActiveId(null);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      if (!open) {
        // strict mode: Enter with closed popup does nothing unless custom
        if (allowCustom && inputValue.trim() && (!value || value.label !== inputValue.trim())) {
          e.preventDefault();
          commit("__custom__");
        }
        return;
      }
      e.preventDefault();
      if (activeId) commit(activeId);
      else if (allowCustom && inputValue.trim()) commit("__custom__");
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveId(null);
    }
  }

  const showCustomRow =
    allowCustom &&
    inputValue.trim() &&
    !filtered.some((o) => o.label.toLowerCase() === inputValue.trim().toLowerCase());

  const isMd = size === "md";

  return (
    <div ref={wrapRef} className="w-full">
      <label id={labelId} className={`mb-1.5 block font-semibold text-stone-900 ${isMd ? "text-sm" : "text-[13px]"}`}>
        {label}
      </label>
      <div
        className={`relative rounded-xl border bg-white transition-shadow ${
          highlight === 1
            ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2"
            : open
              ? "border-indigo-400 shadow-[0_0_0_3px_#eef2ff]"
              : "border-stone-300 shadow-sm hover:border-stone-400"
        }`}
      >
        <div className="flex items-center gap-2 pl-3 pr-2">
          <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 shrink-0 text-stone-400" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <circle cx={7} cy={7} r={4.3} />
            <path d="M10.2 10.2 13 13" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={activeId ? `${listId}-${activeId}` : undefined}
            aria-autocomplete="list"
            aria-labelledby={labelId}
            value={inputValue}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={(e) => {
              // stay open when focus moves into the listbox (mouse click path)
              if (wrapRef.current?.contains(e.relatedTarget as Node)) return;
              // small delay so a click on an option still lands
              setTimeout(() => setOpen(false), 120);
            }}
            onKeyDown={onKeyDown}
            className={`flex-1 bg-transparent font-medium text-stone-900 placeholder:font-normal placeholder:text-stone-400 focus:outline-none ${
              isMd ? "py-3 text-[15px]" : "py-2 text-sm"
            }`}
          />
          {inputValue && (
            <button
              type="button"
              aria-label="Clear selection"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setInputValue("");
                onSelect(null);
                setOpen(true);
                inputRef.current?.focus();
              }}
              className="grid size-6 shrink-0 place-items-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            aria-label={open ? "Close suggestions" : "Open suggestions"}
            aria-expanded={open}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setOpen((v) => !v);
              inputRef.current?.focus();
            }}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-stone-500 transition hover:bg-stone-100"
          >
            <svg viewBox="0 0 12 12" className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="M2.5 4.5 6 8l3.5-3.5" />
            </svg>
          </button>
        </div>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className={`animate-pop-in absolute inset-x-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-xl border bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] no-scrollbar ${
              highlight === 2 ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2" : "border-stone-200"
            }`}
          >
            {filtered.length === 0 && !showCustomRow ? (
              <li className="px-3 py-6 text-center">
                <p className="text-sm font-medium text-stone-800">No matches for “{inputValue.trim()}”</p>
                <p className="mt-1 text-[13px] text-stone-500">{emptyText}</p>
              </li>
            ) : (
              <>
                {filtered.map((opt) => {
                  const isActive = activeId === opt.id;
                  const isSelected = value?.id === opt.id;
                  return (
                    <li
                      key={opt.id}
                      id={`${listId}-${opt.id}`}
                      role="option"
                      data-opt={opt.id}
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled || undefined}
                      onMouseEnter={() => !opt.disabled && setActiveId(opt.id)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => !opt.disabled && commit(opt.id)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left transition ${
                        opt.disabled
                          ? "cursor-not-allowed opacity-45"
                          : isActive
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-stone-800 hover:bg-stone-100"
                      } ${highlight === 3 && isActive ? "ring-2 ring-amber-400 ring-offset-1" : ""} ${isMd ? "py-2" : "py-1.5"}`}
                    >
                      {opt.avatar ? (
                        <span
                          aria-hidden
                          className={`grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                            isActive ? "bg-white/20 text-white" : "text-white"
                          }`}
                          style={!isActive ? { background: opt.avatarColor ?? "#57534e" } : undefined}
                        >
                          {opt.avatar}
                        </span>
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate font-medium leading-tight ${isMd ? "text-sm" : "text-[13px]"}`}>{opt.label}</span>
                        {opt.sub && (
                          <span className={`block truncate text-xs ${isActive ? "text-white/75" : "text-stone-500"}`}>
                            {opt.sub}
                            {opt.disabled && opt.disabledReason ? ` · ${opt.disabledReason}` : ""}
                          </span>
                        )}
                      </span>
                      {opt.badge && (
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                            isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <svg
                          viewBox="0 0 14 14"
                          aria-label="Selected"
                          className={`h-4 w-4 shrink-0 ${highlight === 4 ? "rounded ring-2 ring-amber-400 ring-offset-1" : ""} ${
                            isActive ? "text-white" : "text-indigo-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 7.5 5.5 10.5 11.5 3.5" />
                        </svg>
                      )}
                    </li>
                  );
                })}
                {showCustomRow && (
                  <li
                    id={`${listId}-__custom__`}
                    role="option"
                    data-opt="__custom__"
                    aria-selected={false}
                    onMouseEnter={() => setActiveId("__custom__")}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit("__custom__")}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border-t border-dashed border-stone-200 px-2.5 py-2 text-left transition ${
                      activeId === "__custom__" ? "bg-indigo-600 text-white" : "text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    <span className={`grid size-6 place-items-center rounded-full text-sm font-bold ${activeId === "__custom__" ? "bg-white/20" : "bg-indigo-100 text-indigo-700"}`}>+</span>
                    <span className="text-sm">
                      {customLabel ? customLabel(inputValue.trim()) : `Add “${inputValue.trim()}”`}
                    </span>
                  </li>
                )}
              </>
            )}
          </ul>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{hint}</p>}
    </div>
  );
}
