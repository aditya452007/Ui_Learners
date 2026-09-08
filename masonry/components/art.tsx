import { PALETTES, type Brick } from "@/lib/bricks";

/* Generative cover art: six flat geometric scenes in a tasteful palette.
   Pure SVG, no network — and every tile reserves its aspect ratio, so the
   wall never jumps while content loads. */

function Scene({ brick }: { brick: Brick }) {
  const p = PALETTES[brick.palette % PALETTES.length];
  const v = brick.scene % 6;

  if (v === 0)
    return (
      <g>
        <rect x="40" y="150" width="100" height="250" rx="50" fill={p.deep} />
        <rect x="160" y="100" width="100" height="300" rx="50" fill={p.soft} />
        <rect x="280" y="180" width="80" height="220" rx="40" fill={p.ink} opacity="0.85" />
        <circle cx="210" cy="80" r="26" fill={p.deep} opacity="0.55" />
      </g>
    );
  if (v === 1)
    return (
      <g>
        <circle cx="200" cy="170" r="95" fill={p.deep} />
        <circle cx="200" cy="170" r="95" fill={p.ink} opacity="0.12" />
        <rect x="0" y="270" width="400" height="130" fill={p.soft} />
        <rect x="0" y="300" width="400" height="10" fill={p.ink} opacity="0.25" />
        <rect x="0" y="330" width="400" height="10" fill={p.ink} opacity="0.18" />
        <rect x="0" y="360" width="400" height="10" fill={p.ink} opacity="0.12" />
      </g>
    );
  if (v === 2)
    return (
      <g>
        <path d="M0 250 Q 100 190 200 240 T 400 230 V 400 H 0 Z" fill={p.soft} />
        <path d="M0 300 Q 110 250 220 295 T 400 285 V 400 H 0 Z" fill={p.deep} />
        <path d="M0 350 Q 120 315 230 350 T 400 340 V 400 H 0 Z" fill={p.ink} opacity="0.8" />
        <circle cx="320" cy="90" r="34" fill={p.deep} opacity="0.7" />
      </g>
    );
  if (v === 3)
    return (
      <g>
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={60 + c * 56}
              cy={60 + r * 56}
              r={r === 1 && c === 4 ? 26 : 7}
              fill={r === 1 && c === 4 ? p.deep : p.ink}
              opacity={r === 1 && c === 4 ? 1 : 0.28}
            />
          )),
        )}
        <rect x="52" y="318" width="120" height="14" rx="7" fill={p.deep} opacity="0.65" />
      </g>
    );
  if (v === 4)
    return (
      <g>
        <circle cx="110" cy="105" r="30" fill={p.deep} opacity="0.8" />
        <path d="M-20 330 L 140 130 L 300 330 Z" fill={p.soft} />
        <path d="M140 130 L 200 200 L 110 215 Z" fill="#ffffff" opacity="0.75" />
        <path d="M170 330 L 300 170 L 430 330 Z" fill={p.deep} />
        <rect x="0" y="330" width="400" height="70" fill={p.ink} opacity="0.85" />
      </g>
    );
  return (
    <g>
      <path d="M0 90 Q 100 60 200 90 T 400 90" stroke={p.deep} strokeWidth="26" fill="none" opacity="0.85" />
      <path d="M0 170 Q 100 140 200 170 T 400 170" stroke={p.ink} strokeWidth="26" fill="none" opacity="0.3" />
      <path d="M0 250 Q 100 220 200 250 T 400 250" stroke={p.deep} strokeWidth="26" fill="none" opacity="0.55" />
      <path d="M0 330 Q 100 300 200 330 T 400 330" stroke={p.ink} strokeWidth="26" fill="none" opacity="0.2" />
    </g>
  );
}

export default function BrickArt({
  brick,
  rounded = "rounded-xl",
}: {
  brick: Brick;
  rounded?: string;
}) {
  const p = PALETTES[brick.palette % PALETTES.length];
  return (
    <div
      aria-hidden
      className={`w-full overflow-hidden ${rounded}`}
      /* aspect-ratio reserves the exact box before anything paints —
         this is the "no jump while loading" trick from the prompt. */
      style={{ aspectRatio: `${brick.w} / ${brick.h}`, background: p.bg }}
    >
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        className="block h-full w-full"
      >
        <rect width="400" height="400" fill={p.bg} />
        <Scene brick={brick} />
      </svg>
    </div>
  );
}
