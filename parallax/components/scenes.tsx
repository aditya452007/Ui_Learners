const STARS: Array<{ x: number; y: number; r: number; o: number }> = [
  { x: 4, y: 8, r: 1.6, o: 0.9 },
  { x: 9, y: 22, r: 1.2, o: 0.6 },
  { x: 14, y: 5, r: 1.4, o: 0.8 },
  { x: 18, y: 34, r: 1.1, o: 0.5 },
  { x: 23, y: 12, r: 1.7, o: 0.95 },
  { x: 28, y: 48, r: 1.2, o: 0.55 },
  { x: 32, y: 20, r: 1.3, o: 0.7 },
  { x: 37, y: 7, r: 1.1, o: 0.6 },
  { x: 41, y: 30, r: 1.5, o: 0.85 },
  { x: 46, y: 14, r: 1.2, o: 0.5 },
  { x: 51, y: 42, r: 1.4, o: 0.75 },
  { x: 55, y: 9, r: 1.6, o: 0.9 },
  { x: 60, y: 26, r: 1.1, o: 0.6 },
  { x: 64, y: 4, r: 1.3, o: 0.7 },
  { x: 68, y: 36, r: 1.2, o: 0.55 },
  { x: 73, y: 16, r: 1.5, o: 0.8 },
  { x: 78, y: 44, r: 1.1, o: 0.5 },
  { x: 83, y: 11, r: 1.4, o: 0.75 },
  { x: 88, y: 28, r: 1.2, o: 0.6 },
  { x: 93, y: 6, r: 1.6, o: 0.9 },
  { x: 7, y: 52, r: 1.1, o: 0.5 },
  { x: 12, y: 64, r: 1.3, o: 0.65 },
  { x: 26, y: 58, r: 1.2, o: 0.55 },
  { x: 36, y: 68, r: 1.1, o: 0.5 },
  { x: 44, y: 55, r: 1.4, o: 0.7 },
  { x: 52, y: 62, r: 1.2, o: 0.6 },
  { x: 62, y: 52, r: 1.5, o: 0.8 },
  { x: 70, y: 66, r: 1.1, o: 0.5 },
  { x: 79, y: 56, r: 1.3, o: 0.65 },
  { x: 86, y: 48, r: 1.2, o: 0.6 },
  { x: 92, y: 38, r: 1.1, o: 0.5 },
  { x: 49, y: 2, r: 1.3, o: 0.7 },
  { x: 20, y: 70, r: 1.4, o: 0.7 },
  { x: 57, y: 70, r: 1.2, o: 0.6 },
  { x: 96, y: 20, r: 1.5, o: 0.8 },
  { x: 30, y: 40, r: 1.1, o: 0.5 },
];

export function Sun() {
  return (
    <div className="absolute right-[12%] top-[30%] h-[36vmin] w-[36vmin] rounded-full bg-[radial-gradient(circle,#fde68a_0%,#f59e0b_42%,rgba(245,158,11,0)_70%)]" />
  );
}

export function RidgeBack() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      role="presentation"
    >
      <defs>
        <linearGradient id="ridge-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e2160" />
          <stop offset="1" stopColor="#1a1140" />
        </linearGradient>
      </defs>
      <path
        d="M0 430 L90 370 L180 400 L300 300 L420 350 L520 280 L640 340 L760 260 L880 330 L980 290 L1080 350 L1200 280 L1300 340 L1440 300 L1440 600 L0 600 Z"
        fill="url(#ridge-back)"
      />
    </svg>
  );
}

export function RidgeFront() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      role="presentation"
    >
      <defs>
        <linearGradient id="ridge-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1140" />
          <stop offset="1" stopColor="#0c0724" />
        </linearGradient>
      </defs>
      <path
        d="M0 500 L120 440 L240 480 L360 410 L480 460 L600 420 L720 470 L840 400 L960 450 L1080 430 L1200 470 L1320 420 L1440 460 L1440 600 L0 600 Z"
        fill="url(#ridge-front)"
      />
    </svg>
  );
}

export function ValleyGlow() {
  return (
    <div className="absolute left-[18%] top-[10%] h-[38%] w-[64%] bg-[radial-gradient(ellipse_at_center,rgba(255,244,214,0.4),transparent_65%)]" />
  );
}

export function HillsBack() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      role="presentation"
    >
      <defs>
        <linearGradient id="hills-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123c33" />
          <stop offset="1" stopColor="#0b2923" />
        </linearGradient>
      </defs>
      <path
        d="M0 420 L140 340 L280 390 L420 300 L560 370 L700 320 L840 380 L980 330 L1120 390 L1260 340 L1440 380 L1440 600 L0 600 Z"
        fill="url(#hills-back)"
      />
    </svg>
  );
}

export function HillsFront() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      role="presentation"
    >
      <defs>
        <linearGradient id="hills-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a241f" />
          <stop offset="1" stopColor="#061713" />
        </linearGradient>
      </defs>
      <path
        d="M0 500 L110 450 L230 480 L350 420 L470 470 L600 440 L730 490 L860 430 L980 470 L1100 450 L1220 480 L1340 440 L1440 470 L1440 600 L0 600 Z"
        fill="url(#hills-front)"
      />
    </svg>
  );
}

export function Fog() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,rgba(214,232,224,0)_0%,rgba(214,232,224,0.28)_60%,rgba(226,240,233,0.55)_100%)]" />
  );
}

export function Nebula() {
  return (
    <>
      <div className="absolute left-[8%] top-[18%] h-[46vmin] w-[46vmin] rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.4),transparent_65%)]" />
      <div className="absolute right-[6%] top-[40%] h-[42vmin] w-[42vmin] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.22),transparent_65%)]" />
    </>
  );
}

export function Stars() {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r,
            height: s.r,
            opacity: s.o,
          }}
        />
      ))}
    </>
  );
}

export function Moon() {
  return (
    <div className="absolute right-[14%] top-[10%] h-[16vmin] w-[16vmin] rounded-full bg-[radial-gradient(circle_at_32%_30%,#fffbeb_0%,#fde68a_55%,#fcd34d_100%)] shadow-[0_0_90px_25px_rgba(253,230,138,0.22)]" />
  );
}

export function Clouds() {
  return (
    <>
      <div className="absolute left-[8%] top-[16%] h-4 w-[26vmin] rounded-full bg-white/10 blur-[2px]" />
      <div className="absolute left-[28%] top-[38%] h-3 w-[18vmin] rounded-full bg-white/8 blur-[3px]" />
    </>
  );
}

export function Silhouette() {
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      role="presentation"
    >
      <path
        d="M0 470 L130 420 L260 460 L390 400 L520 450 L650 410 L780 460 L910 420 L1040 460 L1170 430 L1300 460 L1440 430 L1440 600 L0 600 Z"
        fill="#05070f"
      />
    </svg>
  );
}
