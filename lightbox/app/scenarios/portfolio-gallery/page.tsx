"use client";

import { useState } from "react";
import Lightbox from "../../components/Lightbox";

const portfolioImages = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    alt: "Mountain sunrise",
    caption: "Dolomites at dawn — Sony A7IV, 24mm f/8",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    alt: "Glacier valley",
    caption: "Glacier valley — Leica Q2, 28mm f/11",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Foggy forest",
    caption: "Morning mist, Black Forest — Hasselblad X2D",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    alt: "Sunlit canopy",
    caption: "Light through ancient oaks — Canon R5, 35mm f/5.6",
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80",
    alt: "Green meadow",
    caption: "Alpine meadow in summer — Nikon Z8, 50mm f/8",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    alt: "Lake reflection",
    caption: "Still water at Lago di Braies — Sony A7RV",
  },
];

export default function PortfolioGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
                <circle cx="5.5" cy="5.5" r="1.5" />
                <path d="M1.5 11l3.5-3.5 2.5 2.5 3-3L14.5 12" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary tracking-tight">
              Portfolio Gallery
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="/" className="hover:text-text-primary transition-colors">
              Hub
            </a>
            <a
              href="/scenarios/ecommerce-gallery"
              className="hover:text-text-primary transition-colors"
            >
              E-commerce
            </a>
            <a
              href="/scenarios/travel-story"
              className="hover:text-text-primary transition-colors"
            >
              Travel Story
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-mono text-accent mb-3 tracking-wide uppercase">
            Scenario 01 — Photographer Portfolio
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            Elena Vasquez Photography
          </h1>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            A landscape photographer's portfolio. Six images in a responsive grid —
            click any one to open the lightbox. Arrow keys and on-screen buttons both work.
            This is the most common lightbox pattern: a gallery of unrelated images the
            user browses freely.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {portfolioImages.map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium truncate">
                  {img.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold text-text-primary text-sm mb-2">
            Why it fits here
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Photographers need clients to see full-resolution work without leaving
            the site. A lightbox lets users browse at their own pace, inspect detail,
            and close when satisfied — no page reloads, no new tabs, no friction.
            The keyboard navigation (arrow keys) is especially important for power
            users who review many images quickly.
          </p>
        </div>
      </main>

      {lightboxOpen && (
        <Lightbox
          images={portfolioImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
