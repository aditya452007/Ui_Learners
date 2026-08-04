import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function InfoCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9.2v4.6" />
      <circle cx="10" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ExclamationCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.4v6.2" />
      <circle cx="10" cy="14.2" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m6.1 10.2 2.6 2.7 5.2-5.8" />
    </svg>
  );
}

export function WarningTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M10 3.2 17.6 16.2H2.4L10 3.2Z" />
      <path d="M10 8.2v4" />
      <circle cx="10" cy="14.6" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ErrorCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m7.1 7.1 5.8 5.8M12.9 7.1l-5.8 5.8" />
    </svg>
  );
}

export function LightbulbIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8.2 2.8a4.4 4.4 0 0 1 3.6 7.9c-.5.4-.8 1-.8 1.6v.4h-4v-.4c0-.6-.3-1.2-.8-1.6a4.4 4.4 0 0 1 2-7.9Z" />
      <path d="M7.2 14.2h4" />
      <path d="M7.4 16.6h4" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

export function MegaphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.8V7.8h2.6l7.2-4.6v13L5.6 11.8H3Z" />
      <path d="M15.5 8.2a2.6 2.6 0 0 1 0 3.6" />
      <path d="M6.4 12.9 7.4 17h2.4l-.8-4" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 10h13m0 0-4.4-4.4M16.5 10l-4.4 4.4" />
    </svg>
  );
}

export function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 4.2A2.2 2.2 0 0 1 5.7 2H16.5v13.6H5.7a2.2 2.2 0 0 0-2.2 2.2V4.2Z" />
      <path d="M3.5 15.8a2.2 2.2 0 0 1 2.2-2.2h10.8" />
      <path d="M7 5.8h6" />
    </svg>
  );
}
