import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slider — NSSlider as a web pattern",
  description:
    "Learn the macOS slider: knob, track, filled track and tick marks. A live anatomy diagram plus three working scenarios.",
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
