import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Bubble — NameThatUi Learning Lab",
  description:
    "Learn the chat bubble UI pattern: message bubbles, tails, status, timestamps and typing indicators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-sm font-bold text-white">
                Cb
              </span>
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                NameThatUi <span className="font-normal text-slate-500">/ Chat Bubble</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
              <Link
                href="/"
                className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Hub
              </Link>
              <Link
                href="/scenarios/support-chat"
                className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Support
              </Link>
              <Link
                href="/scenarios/team-channel"
                className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Team
              </Link>
              <Link
                href="/scenarios/order-tracking"
                className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Orders
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-slate-500">
            Chat Bubble learning lab — one concept, one mini-app. Built with Next.js + Tailwind, no
            component libraries.
          </div>
        </footer>
      </body>
    </html>
  );
}
