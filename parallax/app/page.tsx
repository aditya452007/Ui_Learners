import { ParallaxLayer, ParallaxScene } from "@/components/parallax";
import ScrollHud from "@/components/scroll-hud";
import {
  Clouds,
  Fog,
  HillsBack,
  HillsFront,
  Moon,
  Nebula,
  RidgeBack,
  RidgeFront,
  Silhouette,
  Stars,
  Sun,
  ValleyGlow,
} from "@/components/scenes";

const LAB_COLS = ["18%", "50%", "82%"] as const;

export default function Home() {
  return (
    <main className="relative">
      <div className="scroll-progress" aria-hidden="true" />

      {/* ── Scene 01 · hero: the classic marketing-hero parallax ── */}
      <ParallaxScene className="h-[100svh] bg-[linear-gradient(180deg,#0d0b1e_0%,#2b2353_35%,#5d3a7d_60%,#b45309_82%,#f59e0b_100%)]">
        <ParallaxLayer speed="far">
          <Sun />
          <RidgeBack />
        </ParallaxLayer>
        <ParallaxLayer speed="mid">
          <RidgeFront />
        </ParallaxLayer>

        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-100/80">
            Field notes · the visual dictionary of ui
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-7xl">
            Parallax Scrolling
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            Layers that scroll at different speeds — the background lags, and
            depth appears. Scroll, and watch the ridges fall behind the page.
          </p>
          <p className="mt-12 text-xs font-medium text-white/50">
            ↓ keep scrolling — the far ridge moves slowest
          </p>
        </div>
      </ParallaxScene>

      {/* ── Scene 02 · two planes + fog ── */}
      <ParallaxScene className="h-[90svh] bg-[linear-gradient(180deg,#0c1b17_0%,#12332c_45%,#2a5d4e_75%,#9bbfae_100%)]">
        <ParallaxLayer speed="far">
          <ValleyGlow />
          <HillsBack />
        </ParallaxLayer>
        <ParallaxLayer speed="mid">
          <HillsFront />
          <Fog />
        </ParallaxLayer>

        <div className="relative z-10 mx-auto flex h-full max-w-xl items-center px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-200/90">
              Chapter 01
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              The background layer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              The image behind that <em>lags</em> is the background layer — the
              far plane translating at a fraction of scroll speed. In the
              classic pure-CSS trick that plane is{" "}
              <code className="font-mono text-amber-200">translateZ(-1px)</code>{" "}
              pushed back inside a{" "}
              <code className="font-mono text-amber-200">perspective</code>{" "}
              container and scaled up to fit.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-teal-100/80">
                back hills — far, ±20vh
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-teal-100/80">
                front hills — mid, ±12vh
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-teal-100/80">
                this card — content, 0 — full speed
              </span>
            </div>
          </div>
        </div>
      </ParallaxScene>

      {/* ── Scene 03 · three planes + stars ── */}
      <ParallaxScene className="h-[90svh] bg-[linear-gradient(180deg,#05060f_0%,#0b1026_50%,#1b2140_100%)]">
        <ParallaxLayer speed="far">
          <Nebula />
          <Stars />
        </ParallaxLayer>
        <ParallaxLayer speed="mid">
          <Moon />
          <Clouds />
        </ParallaxLayer>
        <ParallaxLayer speed="near">
          <Silhouette />
        </ParallaxLayer>

        <div className="relative z-10 mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-200/90">
            Chapter 02
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            The foreground layer
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
            This text rides at full scroll speed — the near plane,{" "}
            <code className="font-mono text-amber-200">translateZ(0)</code>.
            The gap between its speed and the stars&apos; speed is what the eye
            reads as depth.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-[11px]">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
              stars — far, ±20vh
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
              moon — mid, ±12vh
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
              ridge — near, ±6vh
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75">
              text — 0
            </span>
          </div>
        </div>
      </ParallaxScene>

      {/* ── THE PARALLAX LAB · three planes, measured ── */}
      <section className="relative h-[240vh] bg-[#07070f] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:10vh_10vh]">
        <div className="sticky top-0 z-20 flex h-16 items-center border-b border-white/10 bg-[#0a0a12]/85 px-6 backdrop-blur">
          <p className="font-mono text-xs tracking-wide text-white/80">
            The Parallax Lab —{" "}
            <span className="text-amber-200">same screen, three speeds</span>.
            Scroll slowly.
          </p>
        </div>

        <p className="absolute left-6 top-[36vh] max-w-xs font-mono text-xs leading-relaxed text-white/45">
          three planes · one start line
          <br />
          the dots below are how far each one travels
        </p>

        {/* START line — the far plane begins here */}
        <div className="absolute inset-x-0 top-[70vh] border-t-2 border-dashed border-white/25">
          <span className="absolute left-6 -top-2.5 bg-[#07070f] px-2 font-mono text-[11px] tracking-widest text-white/70">
            START — the far plane begins here
          </span>
        </div>

        {/* far plane — sinks 60vh */}
        <div
          className="absolute top-[70vh] h-[60vh] w-px border-l-2 border-dotted border-rose-400/50"
          style={{ left: LAB_COLS[0] }}
        />
        <p
          className="absolute top-[60vh] whitespace-nowrap font-mono text-[11px] text-rose-200/90"
          style={{ left: `calc(${LAB_COLS[0]} + 8vmin)` }}
        >
          1 · far plane — background
        </p>
        <div
          className="lab-ball lab-ball--far absolute top-[100vh] flex h-[13vmin] w-[13vmin] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#fda4af_0%,#f43f5e_55%,#9f1239_100%)] font-mono text-2xl font-black text-white shadow-[0_0_60px_10px_rgba(244,63,94,0.35)] ring-2 ring-white/20"
          style={{ left: LAB_COLS[0] }}
        >
          1
        </div>
        <div
          className="absolute top-[130vh] w-28 -translate-x-1/2 border-t-2 border-dashed border-rose-300/60"
          style={{ left: LAB_COLS[0] }}
        >
          <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-rose-200/90">
            END · traveled 60vh · 25% speed
          </span>
        </div>

        {/* mid plane — sinks 36vh */}
        <div
          className="absolute top-[82vh] h-[36vh] w-px border-l-2 border-dotted border-teal-300/50"
          style={{ left: LAB_COLS[1] }}
        />
        <p
          className="absolute top-[72vh] -translate-x-full whitespace-nowrap font-mono text-[11px] text-teal-100/90"
          style={{ left: `calc(${LAB_COLS[1]} - 8vmin)` }}
        >
          2 · mid plane
        </p>
        <div
          className="lab-ball lab-ball--mid absolute top-[100vh] flex h-[13vmin] w-[13vmin] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#99f6e4_0%,#2dd4bf_55%,#0f766e_100%)] font-mono text-2xl font-black text-white shadow-[0_0_60px_10px_rgba(45,212,191,0.35)] ring-2 ring-white/20"
          style={{ left: LAB_COLS[1] }}
        >
          2
        </div>
        <div
          className="absolute top-[118vh] w-28 -translate-x-1/2 border-t-2 border-dashed border-teal-200/60"
          style={{ left: LAB_COLS[1] }}
        >
          <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-teal-100/90">
            END · traveled 36vh · 55% speed
          </span>
        </div>

        {/* near plane — sinks 16vh */}
        <div
          className="absolute top-[92vh] h-[16vh] w-px border-l-2 border-dotted border-indigo-300/50"
          style={{ left: LAB_COLS[2] }}
        />
        <p
          className="absolute top-[82vh] -translate-x-full whitespace-nowrap font-mono text-[11px] text-indigo-200/90"
          style={{ left: `calc(${LAB_COLS[2]} - 8vmin)` }}
        >
          3 · near plane — foreground
        </p>
        <div
          className="lab-ball lab-ball--near absolute top-[100vh] flex h-[13vmin] w-[13vmin] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#c7d2fe_0%,#818cf8_55%,#4338ca_100%)] font-mono text-2xl font-black text-white shadow-[0_0_60px_10px_rgba(129,140,248,0.35)] ring-2 ring-white/20"
          style={{ left: LAB_COLS[2] }}
        >
          3
        </div>
        <div
          className="absolute top-[108vh] w-28 -translate-x-1/2 border-t-2 border-dashed border-indigo-200/60"
          style={{ left: LAB_COLS[2] }}
        >
          <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-indigo-200/90">
            END · traveled 16vh · 80% speed
          </span>
        </div>

        <p className="absolute inset-x-0 top-[188vh] px-6 text-center font-mono text-xs leading-relaxed text-white/50">
          same 80vh of scroll, three different distances.
          <br />
          the far plane lags the page — that lag <em>is</em> the depth.
          <br />
          <span className="text-white/35">
            content always moves at 100% — it is the foreground plane.
          </span>
        </p>
      </section>

      {/* ── Takeaway ── */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          The takeaway
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-bold text-rose-300">
              Background layer
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              The far plane — biggest amplitude (±20vh), slowest on screen
              (25% speed). It lags the page most.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-bold text-teal-300">
              Foreground layer
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Content at full scroll speed, no transform. Comparing rates is
              the whole illusion.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-bold text-indigo-300">The driver</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              <code className="font-mono text-indigo-100">view()</code> for
              scene layers, <code className="font-mono text-indigo-100">scroll(root)</code>{" "}
              for the lab and the top bar. No JavaScript.
            </p>
          </div>
        </div>

        <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs leading-relaxed text-zinc-300">
{`/* the whole effect, in essence */
.parallax-layer {
  inset: -20vh 0;             /* overscan so shifts never leave gaps */
  animation-name: parallax-far;
  animation-timeline: view(); /* declared AFTER the animation longhands */
}
@keyframes parallax-far {
  from { transform: translateY(-20vh); } /* plane entering   */
  to   { transform: translateY(20vh); }  /* plane leaving — it lagged */
}`}
        </pre>

        <ul className="mt-6 space-y-2 text-xs leading-relaxed text-white/65">
          <li>
            <strong className="text-white">Lookalikes:</strong>{" "}
            <code className="font-mono text-white/80">background-attachment: fixed</code>{" "}
            holds the image still while content slides over it — and iOS
            Safari ignores it by design. One element holding still is{" "}
            <code className="font-mono text-white/80">position: sticky</code> —
            a different thing entirely.
          </li>
          <li>
            <strong className="text-white">Vestibular care:</strong> parallax
            is a known motion-sickness trigger. Turn on “reduce motion” in
            your OS — every layer here falls back to an ordinary static
            background.
          </li>
        </ul>

        <p className="mt-10 text-center font-mono text-[11px] text-white/40">
          name that ui · /web/parallax · built by hand, no libraries
        </p>
      </section>

      <ScrollHud />
    </main>
  );
}
