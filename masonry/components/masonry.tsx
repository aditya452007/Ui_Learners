"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { splitBalanced, splitSequence } from "@/lib/bricks";

export type Engine = "columns" | "native" | "js";
export type JsOrder = "balanced" | "sequence";

/** True when the browser understands native Grid Lanes masonry. */
export function useNativeMasonry(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setSupported(
        typeof CSS !== "undefined" &&
          typeof CSS.supports === "function" &&
          CSS.supports("grid-template-rows", "masonry"),
      );
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

export const ENGINE_LABEL: Record<Engine, string> = {
  columns: "CSS columns",
  native: "Native grid lanes",
  js: "JS shortest-column",
};

/* One generic wall, three engines.
   - columns: multi-column fallback (items flow DOWN each column)
   - native:  grid lanes where supported, columns fallback otherwise
   - js:      React splits items into per-column stacks               */
export default function Masonry<T>({
  items,
  cols,
  gap = 16,
  engine,
  jsOrder = "balanced",
  size,
  renderItem,
  keyOf,
  animateNew = false,
}: {
  items: T[];
  cols: number;
  gap?: number;
  engine: Engine;
  jsOrder?: JsOrder;
  size?: (item: T) => number;
  renderItem: (item: T, index: number) => ReactNode;
  keyOf: (item: T) => string;
  animateNew?: boolean;
}) {
  const vars = { "--m-cols": cols, "--m-gap": `${gap}px` } as CSSProperties;

  if (engine === "js") {
    return (
      <JsWall
        items={items}
        cols={cols}
        gap={gap}
        order={jsOrder}
        size={size ?? (() => 1)}
        renderItem={renderItem}
        keyOf={keyOf}
        animateNew={animateNew}
      />
    );
  }

  return (
    <div className={engine === "native" ? "masonry-native" : "masonry-columns"} style={vars}>
      {items.map((item, i) => (
        <div
          key={keyOf(item)}
          className={`m-item ${animateNew ? "brick-in" : ""}`}
          style={animateNew ? { animationDelay: `${Math.min(i, 8) * 40}ms` } : undefined}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

function JsWall<T>({
  items,
  cols,
  gap,
  order,
  size,
  renderItem,
  keyOf,
  animateNew,
}: {
  items: T[];
  cols: number;
  gap: number;
  order: JsOrder;
  size: (item: T) => number;
  renderItem: (item: T, index: number) => ReactNode;
  keyOf: (item: T) => string;
  animateNew: boolean;
}) {
  const stacks = useMemo(
    () =>
      order === "balanced"
        ? splitBalanced(items, cols, size)
        : splitSequence(items, cols),
    [items, cols, order, size],
  );
  // DOM index per item, so order badges always show true document order
  const indexOf = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((it, i) => m.set(keyOf(it), i));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className="flex items-start" style={{ gap }}>
      {stacks.map((stack, c) => (
        <div
          key={c}
          className="masonry-jscol min-w-0 flex-1"
          style={{ "--m-gap": `${gap}px` } as CSSProperties}
          aria-label={`Column ${c + 1}`}
        >
          {stack.map((item) => (
            <div key={keyOf(item)} className={`m-item ${animateNew ? "brick-in" : ""}`}>
              {renderItem(item, indexOf.get(keyOf(item)) ?? 0)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
