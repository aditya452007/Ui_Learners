"use client";

import { useState } from "react";
import Lightbox from "../../components/Lightbox";

const productImages = [
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
    alt: "Red sneaker side view",
    caption: "Nike Air Max 90 — Classic Red/White",
  },
  {
    src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80",
    alt: "White sneaker front view",
    caption: "Clean white upper with visible air unit",
  },
  {
    src: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
    alt: "Sneaker sole detail",
    caption: "Waffle-pattern outsole for traction",
  },
  {
    src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
    alt: "Sneaker on foot",
    caption: "On-foot look — true to size",
  },
];

const sizeOptions = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];

export default function EcommerceGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedThumb, setSelectedThumb] = useState(0);

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
              E-commerce Gallery
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="/" className="hover:text-text-primary transition-colors">
              Hub
            </a>
            <a
              href="/scenarios/portfolio-gallery"
              className="hover:text-text-primary transition-colors"
            >
              Portfolio
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
            Scenario 02 — E-commerce Product Page
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            Nike Air Max 90
          </h1>
          <p className="text-text-secondary max-w-2xl leading-relaxed">
            A product detail page with a main image, thumbnail strip, and a
            lightbox for close-up inspection. The lightbox opens from both the
            main image and any thumbnail — different entry points, same viewer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product images */}
          <div>
            {/* Main image */}
            <button
              onClick={() => openLightbox(selectedThumb)}
              className="w-full aspect-square rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer mb-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImages[selectedThumb].src}
                alt={productImages[selectedThumb].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    selectedThumb === i
                      ? "border-accent"
                      : "border-border hover:border-text-tertiary"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Zoom hint */}
            <button
              onClick={() => openLightbox(selectedThumb)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-text-secondary text-sm hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="7" cy="7" r="5" />
                <line x1="11" y1="11" x2="14" y2="14" />
                <line x1="5" y1="7" x2="9" y2="7" />
                <line x1="7" y1="5" x2="7" y2="9" />
              </svg>
              Click to zoom
            </button>
          </div>

          {/* Product details */}
          <div>
            <p className="text-sm font-mono text-accent mb-2 tracking-wide uppercase">
              Nike Originals
            </p>
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              Air Max 90
            </h2>
            <p className="text-xl font-semibold text-text-primary mb-4">
              $130
            </p>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              The icon that started it all. Clean lines, visible Air cushioning,
              and a waffle outsole that&apos;s been turning heads since 1990.
              Premium leather and textile upper.
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-text-primary mb-3">
                Select Size
              </p>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                      selectedSize === size
                        ? "border-accent bg-accent-light text-accent"
                        : "border-border text-text-secondary hover:border-text-tertiary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              className="w-full py-3.5 rounded-xl bg-text-primary text-white font-semibold text-sm hover:bg-text-primary/90 transition-colors cursor-pointer mb-3"
            >
              Add to Cart
            </button>
            <p className="text-center text-text-tertiary text-xs">
              Free shipping on orders over $100
            </p>
          </div>
        </div>

        <div className="mt-12 bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold text-text-primary text-sm mb-2">
            Why it fits here
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Online shoppers can't touch the product. A lightbox fills that gap by
            letting them zoom into stitching, texture, and color details without
            leaving the product page. The thumbnail strip shows angle variety at a
            glance; the lightbox provides the depth. It reduces return rates because
            buyers know exactly what they're getting.
          </p>
        </div>
      </main>

      {lightboxOpen && (
        <Lightbox
          images={productImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
