type IconProps = { className?: string };

const svgProps = (className?: string) => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const ChevronLeft = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronDown = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CalendarIcon = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

export const HouseIcon = ({ className }: IconProps) => (
  <svg {...svgProps(className)}>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
