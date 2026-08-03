import type { CSSProperties, ReactNode } from "react";

export type ParallaxSpeed = "far" | "mid" | "near";

const SPEED_CLASS: Record<ParallaxSpeed, string> = {
  far: "parallax-layer--far",
  mid: "parallax-layer--mid",
  near: "parallax-layer--near",
};

export function ParallaxLayer({
  speed,
  className = "",
  style,
  children,
}: {
  speed: ParallaxSpeed;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`parallax-layer ${SPEED_CLASS[speed]} ${className}`}
    >
      {children}
    </div>
  );
}

export function ParallaxScene({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={`parallax-scene ${className}`}>{children}</section>;
}
