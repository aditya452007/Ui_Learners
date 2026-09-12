import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sticky vs. Fixed Positioning — NameThatUI Lab",
  description:
    "A live anatomy of position: sticky (top threshold + scroll container) versus position: fixed (viewport anchor), with three real-world scenarios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-[#fafaf9] text-stone-900">
        {children}
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-stone-500">
            <p>
              NameThatUI lab · Sticky vs. Fixed Positioning ·{" "}
              <span className="font-mono">position: sticky</span> +{" "}
              <span className="font-mono">top</span> vs{" "}
              <span className="font-mono">position: fixed</span>
            </p>
            <p className="font-mono text-[11px] text-stone-400">
              sticky-fixed/ · Next.js 16 + Tailwind v4
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
