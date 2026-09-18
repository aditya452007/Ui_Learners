import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drag & Drop — grip, ghost, insertion line, drop target",
  description:
    "Learn drag and drop: drag handle, selection resize handles, drop indicator insertion line, drop-target highlight, drag preview ghost. Live anatomy plus three working scenarios.",
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
