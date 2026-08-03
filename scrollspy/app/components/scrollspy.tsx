"use client";

import { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";

export interface ScrollSection {
  id: string;
  label: string;
}

/**
 * useScrollSpy — the engine of the whole component.
 *
 * It watches the section targets (real headings with id values) and returns the id
 * of the section currently inside the "activation zone". Exactly one id comes back,
 * and the caller paints it onto its nav link with aria-current="location".
 *
 * Options:
 *  - rootMargin: shifts the activation zone. A sticky header hides the top strip of
 *    the screen, so the zone must start below it: "0px 0px -55% 0px" makes a section
 *    current once it crosses into the upper 45% of the viewport.
 *  - root: pass a scrollable element to watch an inner scroll container instead of
 *    the whole window (used by the dashboard scenario and the anatomy diagram).
 *  - enabled: set false to drive the value manually instead of from the observer.
 */
export function useScrollSpy(
  sections: ScrollSection[],
  options: { rootMargin?: string; root?: Element | null; enabled?: boolean } = {}
): string {
  const { rootMargin = "0px 0px -55% 0px", root = null, enabled = true } = options;
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const rootRef = useRef<Element | null>(null);

  useEffect(() => {
    rootRef.current = root;
  }, [root]);

  useEffect(() => {
    if (!enabled || sections.length === 0) return;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((best, e) =>
          e.boundingClientRect.top < best.boundingClientRect.top ? e : best
        );
        setActive(topmost.target.id);
      },
      { root: rootRef.current, rootMargin, threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections, rootMargin, enabled, root]);

  return active;
}

interface ScrollSpyNavProps {
  sections: ScrollSection[];
  ariaLabel?: string;
  rootMargin?: string;
  root?: Element | null;
  activeId?: string;
  onActiveChange?: (id: string) => void;
  orientation?: "vertical" | "horizontal";
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  barClassName?: string;
}

/**
 * ScrollSpyNav — the On-this-page rail, ready to drop into any page.
 *
 * The rail is a labeled <nav> of fragment links (href="#section-id"). One link at a
 * time carries aria-current="location" and gets the accent bar. The bar is a single
 * absolutely-positioned element that slides to whichever link is current — measured
 * from the DOM and translated with a CSS transform, which stays smooth at 60fps.
 */
export function ScrollSpyNav({
  sections,
  ariaLabel = "On this page",
  rootMargin,
  root,
  activeId,
  onActiveChange,
  orientation = "vertical",
  className = "",
  itemClassName = "",
  activeItemClassName = "",
  barClassName = "",
}: ScrollSpyNavProps) {
  const internalActive = useScrollSpy(sections, {
    rootMargin,
    root,
    enabled: activeId === undefined,
  });
  const active = activeId ?? internalActive;

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pos, setPos] = useState({ x: 0, y: 0, w: 3, h: 0 });

  const measure = useCallback(() => {
    const nav = navRef.current;
    const item = itemRefs.current.get(active);
    if (!nav || !item) return;
    const nr = nav.getBoundingClientRect();
    const ir = item.getBoundingClientRect();
    if (orientation === "vertical") {
      setPos({ x: 0, y: ir.top - nr.top, w: 3, h: ir.height });
    } else {
      setPos({ x: ir.left - nr.left, y: nr.height, w: ir.width, h: 3 });
    }
  }, [active, orientation]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  const baseItem =
    "block rounded-lg px-3 py-2 text-sm transition-colors duration-200 " + itemClassName;
  const baseActive =
    "bg-indigo-50/70 font-semibold text-indigo-700 " + activeItemClassName;
  const baseIdle = "text-slate-500 hover:bg-slate-100 hover:text-slate-900";

  return (
    <nav ref={navRef} aria-label={ariaLabel} data-part="rail" className={`relative ${className}`}>
      <span
        data-part="bar"
        aria-hidden="true"
        className={`pointer-events-none absolute z-10 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/40 transition-transform duration-300 ease-out ${barClassName}`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          width: pos.w,
          height: pos.h,
        }}
      />
      <ul className={`relative ${orientation === "vertical" ? "space-y-1" : "flex flex-wrap gap-1"}`}>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              ref={(el) => {
                if (el) itemRefs.current.set(s.id, el);
                else itemRefs.current.delete(s.id);
              }}
              aria-current={s.id === active ? "location" : undefined}
              data-part="link"
              onClick={() => onActiveChange?.(s.id)}
              className={`${baseItem} ${s.id === active ? baseActive : baseIdle}`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
