"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Shared TokenField — a web approximation of
   AppKit NSTokenField + NSTokenFieldDelegate.
   ───────────────────────────────────────────── */

export type Token = {
  id: string;
  /** Display string drawn inside the capsule. */
  label: string;
  /** Secondary line (e.g. an email address). Hidden inside the pill, shown in completions. */
  sub?: string;
  /** When true the capsule renders in the invalid/error style. */
  invalid?: boolean;
  /** Free-form extra data (e.g. a role). Rendered as a small badge when present. */
  badge?: string;
};

export type Suggestion = {
  label: string;
  sub?: string;
};

export type TokenFieldProps = {
  initialTokens?: Token[];
  suggestions?: Suggestion[];
  placeholder?: string;
  /** Show the completion popup while typing. Mirrors token-completion behavior. */
  completionsEnabled?: boolean;
  /** Characters that finish the current word and mint a token. */
  separators?: string[];
  /** Allow values with no suggestion match (free-form tags). */
  allowCustom?: boolean;
  /** Reject a candidate value (returns false → invalid styling + shake). */
  validate?: (value: string) => boolean;
  /** Normalize before storing (e.g. lowercase + strip spaces for tags). */
  normalize?: (value: string) => string;
  maxTokens?: number;
  /** Visual capsule shape — mirrors NSTokenField.TokenStyle. */
  tokenStyle?: "rounded" | "default" | "none";
  size?: "md" | "sm";
  ariaLabel?: string;
  onChange?: (tokens: Token[]) => void;
  /** Optional per-token tint key (used by the tagging scenario). */
  tintFor?: (token: Token) => string;
};

let counter = 0;
function mintId() {
  counter += 1;
  return `tok-${Date.now().toString(36)}-${counter}`;
}

function Avatar({ label }: { label: string }) {
  const initials = label
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"
    >
      {initials || "•"}
    </span>
  );
}

export default function TokenField({
  initialTokens = [],
  suggestions = [],
  placeholder = "Type and press Enter…",
  completionsEnabled = true,
  separators = [",", ";"],
  allowCustom = true,
  validate,
  normalize,
  maxTokens,
  tokenStyle = "rounded",
  size = "md",
  ariaLabel = "Token field",
  onChange,
  tintFor,
}: TokenFieldProps) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [value, setValue] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const emit = (next: Token[]) => {
    setTokens(next);
    onChange?.(next);
  };

  const query = value.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!completionsEnabled || query.length === 0) return [];
    const taken = new Set(tokens.map((t) => t.label.toLowerCase()));
    return suggestions
      .filter(
        (s) =>
          !taken.has(s.label.toLowerCase()) &&
          (s.label.toLowerCase().includes(query) ||
            (s.sub ?? "").toLowerCase().includes(query))
      )
      .slice(0, 6);
  }, [completionsEnabled, query, suggestions, tokens, value]);

  useEffect(() => {
    setActiveIndex(0);
    setOpen(completionsEnabled && value.trim().length > 0 && matches.length > 0 && focused);
  }, [value, matches.length, focused, completionsEnabled]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  const commitValue = (raw: string, sub?: string) => {
    const cleaned = raw.trim().replace(/[,;]+$/, "").trim();
    if (!cleaned) return;
    if (maxTokens !== undefined && tokens.length >= maxTokens) {
      setNotice(`Limit reached — at most ${maxTokens} tokens.`);
      return;
    }
    const normalized = normalize ? normalize(cleaned) : cleaned;
    if (tokens.some((t) => t.label.toLowerCase() === normalized.toLowerCase())) {
      setNotice(`“${normalized}” is already here — duplicates are ignored.`);
      setValue("");
      return;
    }
    const ok = validate ? validate(normalized) : true;
    if (!ok && !allowCustom) {
      setNotice(`“${normalized}” isn't recognized — pick a suggestion.`);
      return;
    }
    const token: Token = {
      id: mintId(),
      label: normalized,
      sub,
      invalid: !ok,
    };
    emit([...tokens, token]);
    setValue("");
    setSelectedId(null);
    if (!ok) {
      setShakeId(token.id);
      setTimeout(() => setShakeId(null), 350);
    }
    inputRef.current?.focus();
  };

  const removeToken = (id: string) => {
    emit(tokens.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
    inputRef.current?.focus();
  };

  const editToken = (id: string) => {
    const t = tokens.find((x) => x.id === id);
    if (!t) return;
    emit(tokens.filter((x) => x.id !== id));
    setValue(t.label);
    setSelectedId(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  /** Split pasted/typed text on separator characters and mint one token per piece. */
  const commitMany = (text: string) => {
    const parts = text.split(/[,;\n]+/).map((p) => p.trim()).filter(Boolean);
    if (parts.length <= 1) return false;
    let added = 0;
    for (const part of parts) {
      if (maxTokens !== undefined && tokens.length + added >= maxTokens) break;
      const normalized = normalize ? normalize(part) : part;
      if (!normalized) continue;
      if ([...tokens].some((t) => t.label.toLowerCase() === normalized.toLowerCase())) continue;
      const ok = validate ? validate(normalized) : true;
      if (!ok && !allowCustom) continue;
      tokens.push({ id: mintId(), label: normalized, invalid: !ok });
      added += 1;
    }
    if (added > 0) emit([...tokens]);
    setValue("");
    return true;
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && matches[activeIndex]) {
        const m = matches[activeIndex];
        commitValue(m.label, m.sub);
        setOpen(false);
      } else {
        commitValue(value);
      }
      return;
    }
    if (e.key === "Tab" && open && matches.length > 0 && value.trim()) {
      e.preventDefault();
      const m = matches[activeIndex] ?? matches[0];
      commitValue(m.label, m.sub);
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % matches.length);
      return;
    }
    if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + matches.length) % matches.length);
      return;
    }
    if (e.key === "Escape") {
      if (open) setOpen(false);
      else setSelectedId(null);
      return;
    }
    if ((e.key === "Backspace" || e.key === "Delete") && value === "") {
      e.preventDefault();
      if (selectedId) {
        removeToken(selectedId);
      } else if (tokens.length > 0) {
        // First press selects the last pill (native highlight), second press deletes it.
        setSelectedId(tokens[tokens.length - 1].id);
      }
      return;
    }
    if (e.key === "ArrowLeft" && value === "" && e.currentTarget.selectionStart === 0) {
      e.preventDefault();
      if (!selectedId && tokens.length > 0) setSelectedId(tokens[tokens.length - 1].id);
      else if (selectedId) {
        const idx = tokens.findIndex((t) => t.id === selectedId);
        if (idx > 0) setSelectedId(tokens[idx - 1].id);
      }
      return;
    }
    if (e.key === "ArrowRight" && value === "" && selectedId) {
      e.preventDefault();
      const idx = tokens.findIndex((t) => t.id === selectedId);
      if (idx === tokens.length - 1) {
        setSelectedId(null);
        inputRef.current?.focus();
      } else {
        setSelectedId(tokens[idx + 1].id);
      }
      return;
    }
    if (separators.includes(e.key)) {
      e.preventDefault();
      commitValue(value);
    }
  };

  const radius =
    tokenStyle === "rounded" ? "rounded-full" : tokenStyle === "default" ? "rounded-md" : "rounded-[3px]";
  const pad = size === "sm" ? "py-0.5 pl-1.5 pr-1 text-[12.5px]" : "py-1 pl-2 pr-1.5 text-[13.5px]";

  return (
    <div ref={boxRef} className="relative">
      <div
        role="group"
        aria-label={ariaLabel}
        onClick={() => inputRef.current?.focus()}
        className={`flex min-h-[52px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border bg-white px-2.5 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-colors ${
          focused ? "border-blue-500 ring-2 ring-blue-100" : "border-stone-300 hover:border-stone-400"
        }`}
      >
        {tokens.length === 0 && value === "" && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13.5px] text-stone-400">
            {placeholder}
          </span>
        )}
        <ul aria-label="Tokens" className="flex flex-wrap items-center gap-1.5">
          {tokens.map((t) => {
            const selected = t.id === selectedId;
            const tint = tintFor?.(t);
            return (
              <li key={t.id} className="token-pop">
                <span
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={`Token ${t.label}${t.badge ? `, ${t.badge}` : ""}. Press Delete to remove, Enter to edit.`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(selected ? null : t.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    editToken(t.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Delete" || e.key === "Backspace") {
                      e.preventDefault();
                      removeToken(t.id);
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      if (selected) editToken(t.id);
                      else setSelectedId(t.id);
                    } else if (e.key === "Escape") {
                      setSelectedId(null);
                      inputRef.current?.focus();
                    }
                  }}
                  className={`group inline-flex max-w-[220px] cursor-default items-center gap-1.5 border font-medium outline-none transition-all ${radius} ${pad} ${
                    shakeId === t.id ? "token-shake" : ""
                  } ${
                    t.invalid
                      ? selected
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-red-300 bg-red-50 text-red-800"
                      : selected
                        ? "border-blue-700 bg-blue-600 text-white shadow-sm"
                        : tint ?? "border-stone-300 bg-stone-100 text-stone-800 hover:border-stone-400"
                  } ${selected ? "ring-2 ring-blue-200" : "focus-visible:ring-2 focus-visible:ring-blue-300"}`}
                >
                  {!t.invalid && !t.badge && <Avatar label={t.label} />}
                  <span className="truncate leading-5">{t.label}</span>
                  {t.badge && (
                    <span
                      className={`rounded-full px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-wide ${
                        selected ? "bg-white/25 text-white" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                  {t.invalid && (
                    <span aria-hidden="true" className={`text-xs font-bold ${selected ? "text-white" : "text-red-500"}`}>
                      !
                    </span>
                  )}
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={`Remove ${t.label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeToken(t.id);
                    }}
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[11px] leading-none transition-colors ${
                      selected || t.invalid
                        ? "hover:bg-black/15"
                        : "text-stone-400 hover:bg-stone-300/70 hover:text-stone-700"
                    } ${selected ? "text-white" : ""}`}
                  >
                    ×
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            // Tokenizing separator typed mid-string → mint immediately.
            if (separators.some((s) => v.includes(s))) {
              const parts = v.split(/[,;]+/);
              const head = parts.slice(0, -1).join(" ");
              if (head.trim()) {
                commitMany(head);
                setValue(parts[parts.length - 1]);
              } else {
                setValue(parts[parts.length - 1]);
              }
              return;
            }
            setValue(v);
            setSelectedId(null);
          }}
          onKeyDown={onInputKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            // Commit half-typed text on blur, like NSTokenField does.
            setTimeout(() => {
              setOpen(false);
              if (value.trim()) commitValue(value);
            }, 120);
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[,;\n]/.test(text)) {
              e.preventDefault();
              commitMany(text);
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Type a value"
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-[13.5px] text-stone-900 outline-none"
        />
      </div>

      {open && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5">
          <p className="border-b border-stone-100 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Suggestions — ↑↓ + Enter
          </p>
          <ul id={listId} role="listbox" aria-label="Completions" className="max-h-56 overflow-auto py-1">
            {matches.map((m, i) => (
              <li key={`${m.label}-${i}`} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commitValue(m.label, m.sub);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    i === activeIndex ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <Avatar label={m.label} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-medium text-stone-900">{m.label}</span>
                    {m.sub && <span className="block truncate text-xs text-stone-500">{m.sub}</span>}
                  </span>
                  {i === activeIndex && (
                    <kbd className="ml-auto rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10.5px] text-stone-500">
                      ↵
                    </kbd>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div aria-live="polite" className="mt-1.5 min-h-[20px] text-xs text-stone-500">
        {notice ?? (
          <>
            {tokens.length} token{tokens.length === 1 ? "" : "s"}
            {maxTokens !== undefined ? ` · max ${maxTokens}` : ""} · separators: {separators.join(" ")} + Enter
          </>
        )}
      </div>
    </div>
  );
}
