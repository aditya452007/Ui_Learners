import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Level Indicator — NSLevelIndicator as a web pattern",
  description:
    "Learn the macOS level indicator: filled level, warning and critical thresholds, rating symbols. A live anatomy diagram plus three working scenarios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#fafaf9] text-stone-900">
        {children}
      </body>
    </html>
  );
}
