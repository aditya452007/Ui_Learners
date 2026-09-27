import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easing (Timing Function) — NameThatUi Lab",
  description:
    "Learn easing curves by seeing, feeling, comparing and measuring them. Interactive cubic-bezier lab with synced demos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
