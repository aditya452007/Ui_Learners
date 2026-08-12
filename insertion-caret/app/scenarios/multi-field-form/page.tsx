"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "password";
  placeholder: string;
  caretColor: string;
  description: string;
}

const FIELDS: FieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Jane Doe",
    caretColor: "#8b5cf6",
    description: "Violet — standard input, brand accent",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "jane@company.com",
    caretColor: "#22c55e",
    description: "Green — signals validated/safe input",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 123-4567",
    caretColor: "#06b6d4",
    description: "Cyan — numeric/special input feel",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    caretColor: "#f59e0b",
    description: "Amber — caution, sensitive field",
  },
];

function FormField({
  config,
  index,
}: {
  config: FieldConfig;
  index: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = (val: string) => {
    if (!val) {
      setIsValid(null);
      return;
    }
    switch (config.type) {
      case "email":
        setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        break;
      case "tel":
        setIsValid(/^[+\d\s()-]{7,}$/.test(val));
        break;
      default:
        setIsValid(val.length >= 2);
    }
  };

  return (
    <div
      className={`
        group rounded-xl border p-4 transition-all duration-300
        ${isFocused
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/[0.06] bg-white/[0.02]"
        }
      `}
    >
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={config.name}
          className="text-sm font-medium text-white/70"
        >
          {config.label}
        </label>
        <span
          className="text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: config.caretColor }}
        >
          caret: {config.caretColor}
        </span>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          id={config.name}
          name={config.name}
          type={config.type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            validate(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={config.placeholder}
          spellCheck={false}
          className={`
            w-full rounded-lg border bg-white/[0.03] px-4 py-3
            font-mono text-sm text-white/80 placeholder:text-white/20
            transition-all duration-200 focus:outline-none
            ${isFocused ? "border-white/15" : "border-white/[0.06]"}
          `}
          style={{
            caretColor: config.caretColor,
          }}
        />

        {/* Validation indicator */}
        {isValid !== null && (
          <span
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 text-xs
              ${isValid ? "text-green-400" : "text-rose-400"}
            `}
          >
            {isValid ? "✓" : "✗"}
          </span>
        )}
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-white/30">
        {config.description}
      </p>
    </div>
  );
}

export default function MultiFieldFormScenario() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      {/* Nav */}
      <nav className="mb-10 flex items-center gap-3 text-sm">
        <Link
          href="/"
          className="text-white/40 transition-colors hover:text-white/70"
        >
          ← Hub
        </Link>
        <span className="text-white/10">/</span>
        <span className="text-violet-400">Multi-Field Form</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
          Scenario: Multi-Field Form
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-white/50">
          Different fields, different carets. A registration form where each
          input type gets a distinct caret color — showing how caret styling
          can guide the user through a form by signaling field type and
          validation state.
        </p>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0a14] shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/[0.06] bg-white/[0.03] px-6 py-4">
          <h2 className="text-sm font-semibold text-white/80">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Each field uses a different caret color — click through them
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-3 p-6">
          {FIELDS.map((field, i) => (
            <FormField key={field.name} config={field} index={i} />
          ))}
        </div>

        {/* Submit */}
        <div className="border-t border-white/[0.06] px-6 py-4">
          <button
            onClick={() => setSubmitted(true)}
            className="
              w-full rounded-xl bg-violet-600 py-3 text-sm font-medium text-white
              transition-all hover:bg-violet-500 active:scale-[0.98]
            "
          >
            {submitted ? "Account created!" : "Create Account"}
          </button>
          {submitted && (
            <p className="mt-3 text-center text-xs text-green-400">
              ✓ Notice how the caret color changed to match each field&apos;s
              purpose
            </p>
          )}
        </div>
      </div>

      {/* Why it fits */}
      <section className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-400/70">
          Why it fits here
        </h2>
        <p className="text-sm leading-relaxed text-white/50">
          A multi-field form exercises caret customization at scale. Each input
          type gets a color that signals its purpose: violet for standard text,
          green for validated email, cyan for phone numbers, amber for
          sensitive passwords. The user subconsciously registers these cues,
          reducing form errors and improving completion rates.
        </p>
      </section>

      {/* Footer nav */}
      <nav className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-6">
        <Link
          href="/scenarios/chat-composer"
          className="text-sm text-white/40 transition-colors hover:text-white/70"
        >
          ← Chat Composer
        </Link>
        <Link
          href="/"
          className="text-sm text-violet-400 transition-colors hover:text-violet-300"
        >
          Back to Hub →
        </Link>
      </nav>
    </main>
  );
}
