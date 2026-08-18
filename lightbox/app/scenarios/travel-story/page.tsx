"use client";

import { useState } from "react";
import Lightbox from "../../components/Lightbox";

const storyImages = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    alt: "Dawn over the Dolomites",
    caption: "Dolomites, Italy — 5:47 AM. We started the hike before sunrise.",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    alt: "Mountain trail",
    caption: "The trail to Rifugio Lagazuoi — steep, narrow, worth every step.",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    alt: "Morning fog",
    caption: "Fog rolled in at 3,200m. We couldn't see ten meters ahead.",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    alt: "Forest path",
    caption: "The descent through the Fanes forest — golden light, total silence.",
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80",
    alt: "Alpine meadow",
    caption: "Wildflowers in the Fanes-Sennes-Braies park. Late July is peak season.",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    alt: "Lake at sunset",
    caption: "Lago di Braies at golden hour. The water was perfectly still.",
  },
];

export default function TravelStory() {
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
              Travel Photo Story
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
              href="/scenarios/ecommerce-gallery"
              className="hover:text-text-primary transition-colors"
            >
              E-commerce
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-mono text-accent mb-3 tracking-wide uppercase">
            Scenario 03 — Travel Blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            Three Days in the Dolomites
          </h1>
          <p className="text-text-secondary max-w-xl leading-relaxed">
            A photo essay where images are woven into the story. Each inline
            image opens a lightbox with a caption — location, time, and a note
            from the trail. The lightbox here serves as a "lean in" moment: the
            reader is already engaged with the story and wants to see more.
          </p>
        </div>

        {/* Story text with inline images */}
        <article className="space-y-10">
          <div>
            <p className="text-text-primary text-base leading-relaxed mb-5">
              We left the trailhead at 4:30 AM, headlamps cutting through fog.
              The Dolomites don't do gentle mornings — within an hour, the sun
              was painting the peaks in colors that don't have names.
            </p>
            <button
              onClick={() => openLightbox(0)}
              className="w-full group relative aspect-[16/10] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyImages[0].src}
                alt={storyImages[0].alt}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-white/90 text-text-primary text-xs font-medium backdrop-blur-sm">
                  Click to enlarge
                </span>
              </div>
            </button>
          </div>

          <div>
            <p className="text-text-primary text-base leading-relaxed mb-5">
              The trail to Rifugio Lagazuoi is not for the faint-hearted. It
              hugs the cliff face, exposed on one side, with a thousand-meter
              drop to the valley floor. But the reward at the top — a mountain
              hut with hot soup and a 360° panorama — makes every nerve worth it.
            </p>
            <button
              onClick={() => openLightbox(1)}
              className="w-full group relative aspect-[16/10] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyImages[1].src}
                alt={storyImages[1].alt}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-white/90 text-text-primary text-xs font-medium backdrop-blur-sm">
                  Click to enlarge
                </span>
              </div>
            </button>
          </div>

          <div>
            <p className="text-text-primary text-base leading-relaxed mb-5">
              By afternoon, the clouds rolled in without warning. At 3,200
              meters, fog is a living thing — it swallows trails, erases
              landmarks, and turns a familiar path into something alien. We
              navigated by GPS and instinct.
            </p>
            <button
              onClick={() => openLightbox(2)}
              className="w-full group relative aspect-[16/10] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyImages[2].src}
                alt={storyImages[2].alt}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-white/90 text-text-primary text-xs font-medium backdrop-blur-sm">
                  Click to enlarge
                </span>
              </div>
            </button>
          </div>

          <div>
            <p className="text-text-primary text-base leading-relaxed mb-5">
              The descent was the opposite of the ascent — through ancient
              forests where the only sound was our boots on pine needles.
              Golden light filtered through the canopy, and for a few hours,
              the world felt small and quiet.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openLightbox(3)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={storyImages[3].src}
                  alt={storyImages[3].alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
              <button
                onClick={() => openLightbox(4)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={storyImages[4].src}
                  alt={storyImages[4].alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-text-primary text-base leading-relaxed mb-5">
              We ended the day at Lago di Braies. The water was so still it
              doubled the mountains. No wind, no ripples, no sound. Just the
              kind of silence that makes you hold your breath without realizing
              it.
            </p>
            <button
              onClick={() => openLightbox(5)}
              className="w-full group relative aspect-[16/10] rounded-xl overflow-hidden border border-border hover:border-accent transition-colors cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyImages[5].src}
                alt={storyImages[5].alt}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-white/90 text-text-primary text-xs font-medium backdrop-blur-sm">
                  Click to enlarge
                </span>
              </div>
            </button>
          </div>
        </article>

        <div className="mt-12 bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold text-text-primary text-sm mb-2">
            Why it fits here
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            In a photo essay, the lightbox is a "lean in" gesture. The reader
            is already absorbed in the story — clicking an image deepens the
            connection without breaking the flow. Captions in the lightbox
            add context (location, time, emotion) that inline images can't
            carry without cluttering the narrative. The story stays clean;
            the detail is one click away.
          </p>
        </div>
      </main>

      {lightboxOpen && (
        <Lightbox
          images={storyImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
