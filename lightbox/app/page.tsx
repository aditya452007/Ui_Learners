"use client";

import { useState } from "react";
import Lightbox from "./components/Lightbox";

const demoImages = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    alt: "Mountain landscape at dawn",
    caption: "Alpine sunrise over the Dolomites",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    alt: "Dramatic mountain vista",
    caption: "Glacier-carved valley in the Alps",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Foggy forest path",
    caption: "Morning mist in the Black Forest",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    alt: "Sunlit forest canopy",
    caption: "Light filtering through ancient oaks",
  },
];

const anatomyParts = [
  {
    id: "scrim",
    label: "Scrim / Backdrop",
    number: 1,
    whatYouSee:
      "The dark layer that covers everything behind the photo. It dims the page so your eyes go straight to the image — like a spotlight on a dark stage.",
    howItWorks:
      "This is the <dialog> element's native ::backdrop pseudo-element. CSS controls how dark it is (here 85% black). Clicking it is a common way to dismiss the lightbox.",
  },
  {
    id: "image",
    label: "Enlarged Image",
    number: 2,
    whatYouSee:
      "The full-size photo, centered and big. This is the reason you clicked — to see detail you couldn't in the thumbnail.",
    howItWorks:
      "An <img> tag inside the dialog. The src attribute swaps when you navigate. max-width and max-height keep it on screen without cropping.",
  },
  {
    id: "close",
    label: "Close Button",
    number: 3,
    whatYouSee:
      "A small × in the corner. Click it to close the viewer and go back to the page — same as pressing Escape.",
    howItWorks:
      "A <button> that calls dialog.close(). The Escape key is handled by the native <dialog> element automatically.",
  },
  {
    id: "prev",
    label: "Previous Arrow",
    number: 4,
    whatYouSee:
      "An arrow on the left side. Click it to go back one photo in the gallery, like flipping pages in a book backward.",
    howItWorks:
      "A <button> that decrements the currentIndex state variable. React re-renders the <img> with the previous image's src.",
  },
  {
    id: "next",
    label: "Next Arrow",
    number: 5,
    whatYouSee:
      "An arrow on the right side. Click it to advance to the next photo — the main way to browse a gallery.",
    howItWorks:
      "A <button> that increments currentIndex. The array wraps around, so after the last image you loop back to the first.",
  },
  {
    id: "counter",
    label: "Image Counter",
    number: 6,
    whatYouSee:
      'A small "3 / 8" near the bottom. It tells you where you are in the gallery so you know how many are left.',
    howItWorks:
      "A <p> element showing currentIndex + 1 and images.length. It updates every time the state changes and React re-renders.",
  },
];

export default function Home() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
                <circle cx="5.5" cy="5.5" r="1.5" />
                <path d="M1.5 11l3.5-3.5 2.5 2.5 3-3L14.5 12" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary tracking-tight">
              Lightbox
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-text-secondary">
            <a
              href="/scenarios/portfolio-gallery"
              className="hover:text-text-primary transition-colors"
            >
              Portfolio
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
        {/* Title Block */}
        <div className="mb-16">
          <p className="text-sm font-mono text-accent mb-3 tracking-wide uppercase">
            Also called: image viewer overlay, photo modal, gallery overlay
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            Lightbox
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Click a thumbnail and the full image opens over a dark scrim —
            prev/next arrows let you page through, Escape or backdrop-click
            dismisses it. Built on the native{" "}
            <code className="font-mono text-sm bg-surface-alt px-1.5 py-0.5 rounded border border-border">
              &lt;dialog&gt;
            </code>{" "}
            element and its{" "}
            <code className="font-mono text-sm bg-surface-alt px-1.5 py-0.5 rounded border border-border">
              ::backdrop
            </code>
            .
          </p>
        </div>

        {/* What am I looking at — intro strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <div className="bg-surface rounded-xl border border-border p-5">
            <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center text-sm font-bold mb-3">
              1
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1">
              Trigger
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              A thumbnail or image you can click. It opens the lightbox and
              tells it which photo to show first.
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-5">
            <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center text-sm font-bold mb-3">
              2
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1">
              Scrim + Dialog
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              The dark overlay that covers the page and the dialog that holds
              the enlarged image. Native browser behavior handles focus and
              dismissal.
            </p>
          </div>
          <div className="bg-surface rounded-xl border border-border p-5">
            <div className="w-8 h-8 rounded-lg bg-accent-light text-accent flex items-center justify-center text-sm font-bold mb-3">
              3
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1">
              Navigation
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Prev/next arrows and a counter. Click, swipe, or use arrow keys
              to browse the gallery without closing the viewer.
            </p>
          </div>
        </div>

        {/* Live Anatomy Diagram */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
            Anatomy
          </h2>
          <p className="text-text-secondary mb-8">
            Click any thumbnail to open the live lightbox. The numbered labels
            below match the parts you'll see.
          </p>

          {/* Anatomy grid — live thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {demoImages.map((img, i) => (
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
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/90 text-text-primary text-xs font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </div>
              </button>
            ))}
          </div>

          {/* Numbered callout labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {anatomyParts.map((part) => (
              <div
                key={part.id}
                className="bg-surface rounded-xl border border-border p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {part.number}
                  </span>
                  <h3 className="font-semibold text-text-primary text-sm">
                    {part.label}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1">
                      What you see
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {part.whatYouSee}
                    </p>
                  </div>
                  <div className="border-t border-border-subtle pt-3">
                    <p className="text-[11px] font-mono text-accent uppercase tracking-wider mb-1">
                      How it works
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {part.howItWorks}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works — code concept */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6 tracking-tight">
            Under the hood
          </h2>
          <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Open with <code className="font-mono text-xs bg-surface-alt px-1 rounded">dialog.showModal()</code>
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  When you click a thumbnail, React calls{" "}
                  <code className="font-mono text-xs bg-surface-alt px-1 rounded">dialog.showModal()</code>{" "}
                  which tells the browser to display the native dialog element with its backdrop. No
                  manual CSS needed — the browser handles focus trapping and the dark overlay.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  State drives the image
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  A <code className="font-mono text-xs bg-surface-alt px-1 rounded">currentIndex</code> state
                  variable tracks which image is shown. When you click prev/next, the index
                  changes, React re-renders, and the &lt;img&gt; src updates to the new URL.
                  Like turning pages — same frame, different content.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm mb-1">
                  Dismiss three ways
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Press <strong>Escape</strong> (handled natively by &lt;dialog&gt;), click the{" "}
                  <strong>close button</strong>, or click the <strong>dark backdrop</strong> — all
                  call <code className="font-mono text-xs bg-surface-alt px-1 rounded">dialog.close()</code>{" "}
                  which removes the modal and returns focus to the page.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scenario links */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
            See it in context
          </h2>
          <p className="text-text-secondary mb-6">
            Three real-world products that use lightboxes differently.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/scenarios/portfolio-gallery"
              className="group block bg-surface rounded-xl border border-border p-6 hover:border-accent transition-colors"
            >
              <p className="text-[11px] font-mono text-accent uppercase tracking-wider mb-2">
                Scenario 01
              </p>
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                Portfolio Gallery
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                A photographer's portfolio — thumbnails in a grid, full lightbox
                with keyboard navigation.
              </p>
            </a>
            <a
              href="/scenarios/ecommerce-gallery"
              className="group block bg-surface rounded-xl border border-border p-6 hover:border-accent transition-colors"
            >
              <p className="text-[11px] font-mono text-accent uppercase tracking-wider mb-2">
                Scenario 02
              </p>
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                E-commerce Product Gallery
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                A product detail page — thumbnail strip below the main image, clicking opens the
                lightbox for closer inspection.
              </p>
            </a>
            <a
              href="/scenarios/travel-story"
              className="group block bg-surface rounded-xl border border-border p-6 hover:border-accent transition-colors"
            >
              <p className="text-[11px] font-mono text-accent uppercase tracking-wider mb-2">
                Scenario 03
              </p>
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                Travel Photo Story
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                A travel blog — inline images that open with captions and location
                metadata.
              </p>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-xs text-text-tertiary font-mono">
          Built for NameThatUi learning lab
        </div>
      </footer>

      {lightboxOpen && (
        <Lightbox
          images={demoImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
