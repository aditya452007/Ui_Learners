"use client";

import { useState } from "react";
import type { Person } from "../data";

export type AvatarGroupProps = {
  members: Person[];
  /** how many circles are shown before collapsing into +N */
  max?: number;
  /** circle diameter in px */
  size?: number;
  /** negative overlap in px (e.g. -12 pulls circles together) */
  overlap?: number;
  /** surface color painted as the separation ring */
  ringColor?: string;
  /** false = first avatar on top (default), true = last on top */
  reverseStack?: boolean;
  /** total people represented (defaults to members.length) */
  total?: number;
  /** show hover tooltips with names */
  tooltips?: boolean;
  /** highlight hooks for the anatomy diagram */
  spotlight?: "stack" | "ring" | "fallback" | "overflow" | null;
  /** called when the +N overflow circle is clicked */
  onOverflowClick?: () => void;
  /** label for accessibility */
  label?: string;
};

/**
 * AvatarGroup — a row of Avatar circles pulled over each other with a
 * negative margin, each wearing a ring in the surface color.
 */
export function AvatarGroup({
  members,
  max = 5,
  size = 44,
  overlap = -12,
  ringColor = "#ffffff",
  reverseStack = false,
  total,
  tooltips = true,
  spotlight = null,
  onOverflowClick,
  label = "Group members",
}: AvatarGroupProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const resolvedTotal = total ?? members.length;
  const visible = members.slice(0, Math.max(0, max));
  const hiddenCount = Math.max(0, resolvedTotal - visible.length);
  const fontSize = Math.max(10, Math.round(size * 0.32));

  return (
    <div
      role="group"
      aria-label={`${label}: ${visible.map((m) => m.name).join(", ")}${hiddenCount > 0 ? ` and ${hiddenCount} more` : ""}`}
      className="avatar-stack"
    >
      {visible.map((person, i) => {
        const showFallback = !person.src || failed[person.id];
        const zIndex = reverseStack ? i + 1 : visible.length - i;
        const isFallbackDemo = person.id === "priya" || showFallback;
        const spotlightThis =
          (spotlight === "fallback" && isFallbackDemo && i === 2) ||
          (spotlight === "ring" && i === 1) ||
          (spotlight === "stack" && (i === 1 || i === 2));
        return (
          <span
            key={person.id}
            title={tooltips ? undefined : person.name}
            style={{
              width: size,
              height: size,
              marginInlineStart: i === 0 ? 0 : overlap,
              zIndex,
              border: `2px solid ${ringColor}`,
              background: showFallback ? person.tint : "#fff",
              color: person.ink,
              fontSize,
            }}
            className={`avatar-circle hoverable ${spotlightThis ? "part-spotlight" : ""}`}
          >
            {showFallback ? (
              <span aria-hidden>{person.initials}</span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.src}
                alt={person.name}
                width={size}
                height={size}
                loading="lazy"
                onError={() =>
                  setFailed((f) => ({ ...f, [person.id]: true }))
                }
              />
            )}
            {tooltips && (
              <span className="avatar-tip" role="tooltip">
                <span className="font-semibold">{person.name}</span>
                {person.role ? (
                  <span className="opacity-70"> · {person.role}</span>
                ) : null}
              </span>
            )}
            {person.presence === "live" && (
              <span
                aria-label={`${person.name} is online`}
                className="presence-live absolute rounded-full"
                style={{
                  width: Math.max(10, size * 0.28),
                  height: Math.max(10, size * 0.28),
                  right: -1,
                  bottom: -1,
                  background: "#16a34a",
                  border: `2px solid ${ringColor}`,
                }}
              />
            )}
          </span>
        );
      })}
      {hiddenCount > 0 && (
        <OverflowAvatar
          count={hiddenCount}
          size={size}
          overlap={visible.length === 0 ? 0 : overlap}
          ringColor={ringColor}
          zIndex={reverseStack ? visible.length + 1 : 0}
          spotlight={spotlight === "overflow"}
          onClick={onOverflowClick}
        />
      )}
    </div>
  );
}

function OverflowAvatar({
  count,
  size,
  overlap,
  ringColor,
  zIndex,
  spotlight,
  onClick,
}: {
  count: number;
  size: number;
  overlap: number;
  ringColor: string;
  zIndex: number;
  spotlight: boolean;
  onClick?: () => void;
}) {
  const label = `+${count}`;
  const overflowTitle = `${count} more people`;
  const core = (
    <>
      <span aria-hidden className="font-semibold">
        {label}
      </span>
      <span className="avatar-tip" role="tooltip">
        {overflowTitle} — click to see who
      </span>
    </>
  );
  const style = {
    width: size,
    height: size,
    marginInlineStart: overlap,
    zIndex,
    border: `2px solid ${ringColor}`,
    background: "#1c1917",
    color: "#fafaf9",
    fontSize: Math.max(10, Math.round(size * 0.3)),
  } as const;
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Show ${count} more people`}
        style={style}
        className={`avatar-circle ${spotlight ? "part-spotlight" : ""}`}
      >
        {core}
      </button>
    );
  }
  return (
    <span
      aria-label={overflowTitle}
      role="img"
      style={style}
      className={`avatar-circle ${spotlight ? "part-spotlight" : ""}`}
    >
      {core}
    </span>
  );
}
