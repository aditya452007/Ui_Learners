"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useScrollSpy, type ScrollSection } from "../../components/scrollspy";
import { ScenarioNav } from "../../components/scenario-nav";

const SECTIONS: ScrollSection[] = [
  { id: "trailhead", label: "Trailhead" },
  { id: "light", label: "The Light" },
  { id: "pace", label: "The Pace" },
  { id: "pack", label: "The Pack" },
  { id: "weather", label: "Weather" },
  { id: "home", label: "Home" },
];

function SectionTitle({ num, children }: { num: string; children: ReactNode }) {
  return (
    <h2 className="scroll-mt-32">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
        {num}
      </span>
      <span className="mt-2 block text-3xl font-bold tracking-tight text-slate-900">
        {children}
      </span>
    </h2>
  );
}

function Plate({
  plate,
  caption,
  gradient,
}: {
  plate: string;
  caption: string;
  gradient: string;
}) {
  return (
    <figure className="my-10">
      <div
        className={`flex h-60 items-center justify-center rounded-2xl border border-slate-200/70 shadow-sm ${gradient}`}
      >
        <span className="rounded-full bg-white/75 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 backdrop-blur-sm">
          {plate}
        </span>
      </div>
      <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-slate-400">
        {caption}
      </figcaption>
    </figure>
  );
}

function PullQuote({ children, attribution }: { children: ReactNode; attribution: string }) {
  return (
    <blockquote className="my-12 border-l-4 border-indigo-400 pl-6">
      <p className="text-xl font-medium italic leading-relaxed text-slate-800">{children}</p>
      <footer className="mt-3 font-mono text-[11px] uppercase tracking-widest text-slate-400">
        {attribution}
      </footer>
    </blockquote>
  );
}

export default function FieldGuidePage() {
  const active = useScrollSpy(SECTIONS, { rootMargin: "0px 0px -60% 0px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Back to top">
            <span className="grid size-8 place-items-center rounded-lg bg-slate-900 font-serif text-base font-bold italic text-white">
              S
            </span>
            <span className="hidden text-[15px] font-bold tracking-tight text-slate-900 sm:block">
              Sidereal
            </span>
          </a>
          <nav
            aria-label="On this page"
            className="ml-auto flex items-center gap-1.5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SECTIONS.map((s) => {
              const isActive = s.id === active;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                  }`}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>
        </div>
        <div aria-hidden="true" className="h-[2px] w-full bg-slate-200/60">
          <div className="h-full bg-indigo-600" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-2xl px-6 pt-16 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
            Scenario 2 of 3 — long-form
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            The Field Guide to Autumn Walks
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
            A magazine-length essay on walking the low country in October — and on the quiet
            mechanics of reading something all the way to the end.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-widest text-slate-400">
            <span className="font-semibold text-slate-600">Margot Ellery</span>
            <span aria-hidden="true">·</span>
            <span>12 min read</span>
            <span aria-hidden="true">·</span>
            <span>12 October 2026</span>
          </div>
        </div>

        <article className="mx-auto max-w-2xl px-6">
          <p className="mt-12 text-lg leading-[1.9] text-slate-700 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.5rem] first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-indigo-950">
            Every long essay is a kind of walk. You begin at a threshold, follow a thread through
            territory that is partly familiar and partly not, and only at the far end do you turn
            around and see the shape of what you crossed. What follows is about autumn walks, and
            about the quiet mechanics of reading something start to finish — which, it turns out,
            are the same art. The trailhead, if you need one, is the row of pills pinned to the top
            of the screen: a promise about the shape of the journey, the way a trailhead marker is.
          </p>

          <section id="trailhead" className="mt-16">
            <SectionTitle num="01 —">The Trailhead</SectionTitle>
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-slate-700">
              <p>
                The walk starts before the boot touches the path. It starts with the decision, made
                over breakfast coffee, to leave the valley of the schedule and let the day be shaped
                by terrain instead of timetables. There is a particular satisfaction in a deliberate
                beginning: lacing boots, filling a flask, closing the door behind you with the
                intention not to open it again until the afternoon is spent.
              </p>
              <p>
                Autumn is the season that asks to be walked. The summer heat is gone, the winter mud
                has not yet arrived, and the landscape is doing its most theatrical work — fields
                turning from green to gold to rust, hedgerows heavy with sloes, woodsmoke hanging in
                the air from a chimney you cannot see. Every walker knows the feeling of rounding a
                corner in late October and finding the world rearranged since Tuesday.
              </p>
              <Plate
                plate="Plate I"
                caption="Fog lifts from the valley at first light"
                gradient="bg-gradient-to-br from-amber-200 via-orange-100 to-emerald-100"
              />
              <p>
                Choose a route the way you choose a reading list: too short and you feel cheated,
                too long and you never finish. A good autumn walk lasts about the length of a good
                book — three hours, maybe four — with a stopping point that makes sense to no one
                but you. The map is not a set of instructions; it is a menu.
              </p>
              <p>
                And the trailhead of this essay is that small row of pills overhead. A well-built
                contents list is a promise about the shape of the journey before the journey begins,
                which is precisely what a marker post at the edge of a field does: it tells you the
                way is real, and that someone has been this way before.
              </p>
            </div>
          </section>

          <section id="light" className="mt-16 border-t border-slate-200 pt-12">
            <SectionTitle num="02 —">Reading the Light</SectionTitle>
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-slate-700">
              <p>
                In October the sun never climbs very high, so everything is lit sideways. The low
                angle gives the light a long journey through the atmosphere, which strips out the
                blue and leaves a warm, honeyed cast that photographers spend whole careers chasing.
                It is why autumn evenings look like brass, and why a walk that begins at four can
                end in a completely different color of day.
              </p>
              <p>
                The low light is also why the leaves seem painted. Colours that summer bleaches flat
                at noon catch fire at four in the afternoon: a hillside of beech turns from dull
                bronze to lit copper while you stand and watch it happen. Walking is the only way to
                stay inside that window — you cannot photograph it from a car, only pass through it
                at walking pace, on foot, the way it was meant to be watched.
              </p>
              <p>
                Regular walkers develop what photographers call chasing the light: you notice that
                the good part of the afternoon is a moving window, and you plan the route so the
                long descents face west. Reading has the same geometry. The hours of genuine
                attention are also a moving window, and a long piece of writing is best entered when
                the light of the day — and of the reader — is on your side.
              </p>
              <Plate
                plate="Plate II"
                caption="Low sun through the birches, 16:40"
                gradient="bg-gradient-to-br from-sky-200 via-indigo-100 to-slate-200"
              />
              <p>
                What you are really learning, out on the ridge, is how to look. The eye slows down
                to the pace of the foot, and details that the commuting brain filters out — the
                pattern of frost on a gate, the silhouette of a heron holding perfectly still — come
                back into view. Attention, it turns out, is a muscle, and walking is the most
                forgiving gym.
              </p>
            </div>
          </section>

          <PullQuote attribution="From the walker's notebook, no. 12">
            The best walks, like the best essays, are the ones you can feel the shape of before you
            finish them.
          </PullQuote>

          <section id="pace" className="mt-16 border-t border-slate-200 pt-12">
            <SectionTitle num="03 —">Picking the Pace</SectionTitle>
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-slate-700">
              <p>
                The great temptation of a walk is to treat it as a commute — to set the pace of the
                car and then be surprised when the body complains an hour in. The whole trick of a
                long walk is the opposite of efficiency: it is the discovery that you can go much
                further slowly than you ever could quickly, and that the slow version leaves you
                with something at the end besides exhaustion.
              </p>
              <p>
                Pace is a negotiation between the body and the terrain, and the terrain wins the
                opening rounds. Uphill you shrink your stride and let the legs set the rhythm;
                downhill you lengthen it and let gravity do the work. The only rule that matters is
                to stay a little breathless and never out of breath — the walker's version of the
                reader's rule to stay a little curious and never lost.
              </p>
              <p>
                It helps to set small, quiet milestones: the stone bridge, the leaning oak, the
                bench at the third mile. A long walk is best taken in chapters, and so is a long
                read — the walker's chapter mark is the bench, the reader's is the section break.
                Notice how the pills above light up as you pass each one; that is the same rhythm,
                spelled out for the eye.
              </p>
              <Plate
                plate="Plate III"
                caption="The long descent, mile four"
                gradient="bg-gradient-to-br from-lime-200 via-amber-100 to-orange-200"
              />
            </div>
          </section>

          <section id="pack" className="mt-16 border-t border-slate-200 pt-12">
            <SectionTitle num="04 —">What to Pack</SectionTitle>
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-slate-700">
              <p>
                The pack is a small argument about what you trust. Pack too much and you spend the
                day carrying your anxieties; pack too little and you spend it rehearsing them. The
                discipline is not minimalism but sufficiency: the pack should feel heavy for the
                first ten minutes and invisible for the next three hours.
              </p>
              <p>
                Layers are the grammar of the walker's dress. A thin base, a fleece, a shell that
                shrugs off drizzle — the walk becomes a series of small adjustments, a jacket on, a
                jacket off, the unspoken choreography of the season. A walker who dresses in one
                warm block is dressed for the coldest ten minutes of the day and uncomfortable for
                all the rest.
              </p>
              <p>
                Two things should never be left behind. A map printed on paper, which does not run
                out of battery at the moment you need it most; and a pencil, because the pencil is
                for the margins — marking the route you actually walked, noting the bench that
                deserves a return visit. Every good long-form piece is written in the same spirit:
                bring the essentials, leave room in the margins for what you discover on the way.
              </p>
              <Plate
                plate="Plate IV"
                caption="The contents of a well-used pack"
                gradient="bg-gradient-to-br from-slate-200 via-stone-100 to-amber-100"
              />
            </div>
          </section>

          <PullQuote attribution="From the walker's notebook, no. 9">
            Packing is the discipline of choosing what you are willing to carry. Reading well is the
            discipline of choosing what you are willing to set down.
          </PullQuote>

          <section id="weather" className="mt-16 border-t border-slate-200 pt-12">
            <SectionTitle num="05 —">Weather Wisdom</SectionTitle>
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-slate-700">
              <p>
                Autumn weather does not break gently. The forecast arrives as a series of small
                warnings — a pressure drop, a shift of wind, a colder edge to the afternoon — and
                the walker who ignores all of them learns, usually once, why the old guides spent so
                much time on the sky.
              </p>
              <p>
                There is a whole vocabulary of clouds worth knowing: the flat grey lid of a stratus
                that will sit on the valley all day; the cauliflower towers of cumulus that mean the
                afternoon will be lively; the high, thin mare's tails that arrive a day ahead of the
                front. Learning to read them is like learning the architecture of a long piece of
                writing — the weather, like a good argument, announces itself early if you know
                where to look.
              </p>
              <p>
                The forecast is a promise with a half-life, so the walker treats it as a starting
                point rather than a verdict. The real instruments are the ones you carry: wet grass
                at dawn, a still pond, the way smoke from a chimney lies flat instead of rising. And
                the final piece of wisdom is the most important: the good walker knows when to turn
                back. Abandoning the plan is not failure; it is the skill that lets you walk for
                decades.
              </p>
              <Plate
                plate="Plate V"
                caption="Weather building on the western ridge"
                gradient="bg-gradient-to-br from-indigo-200 via-slate-200 to-sky-100"
              />
            </div>
          </section>

          <section id="home" className="mt-16 border-t border-slate-200 pt-12">
            <SectionTitle num="06 —">Home Again</SectionTitle>
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-slate-700">
              <p>
                The return is the part of the walk that most accounts leave out, and it is the part
                the body remembers best. The last mile is always the longest — not because the
                distance is greater, but because the reward is closer. The feet remember the way
                home by themselves, which is a small marvel worth noticing on the first occasion
                that it happens to you.
              </p>
              <p>
                Coming home is what the walk was pointing at all along: hot water, a kitchen lit
                warm against the dusk, the debrief with whoever kept the house. The kettle, the
                half-slice of cake, the boots set by the door to dry. It is the paragraph every long
                piece of writing owes its reader — the landing, the exhale, the proof that the
                journey had a point.
              </p>
              <Plate
                plate="Plate VI"
                caption="The kitchen window, lit against the dusk"
                gradient="bg-gradient-to-br from-rose-200 via-amber-100 to-slate-100"
              />
              <p>
                You will forget most of what you saw, and you will not forget the feeling of having
                seen it — the way a whole afternoon can be held in the hand like a stone from the
                path. A good walk, like a good piece of long-form writing, ends only by pointing
                forward: already you are choosing next Saturday's route, and the pills at the top of
                the screen are waiting for the next essay to begin.
              </p>
            </div>
          </section>
        </article>
      </main>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <section className="mt-24 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-600">
              Why it fits here
            </p>
            <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
              Read forward, never sideways
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              An article is read top to bottom, with no reason to hop sideways — a side rail would
              fence the text in for nothing. A horizontal contents list mounted in the sticky header
              keeps the reading context on every screen without stealing a single column of the
              story, and because the pills advance as you scroll, they quietly double as a progress
              signal. The reader never has to look for where they are; the header brings the answer
              to them.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-600">
              What this variant exercises
            </p>
            <h2 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
              Four knobs, one hook
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">orientation</code>
                  {" "}— pills flowing in a row across the viewport's widest axis instead of a vertical rail beside the text.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">presentation</code>
                  {" "}— the raw hook returns only the active id; the pills, hovers, rounded-full chips and indigo accent are all hand-rolled here.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">pairing</code>
                  {" "}— a reading-progress bar (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">scrollTop ÷ (scrollHeight − clientHeight)</code>) rides the same header as the spy.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">offsets</code>
                  {" "}— taller sticky chrome means headings need <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">scroll-mt-32</code> and the activation zone is pushed deeper:{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">"0px 0px -60% 0px"</code>.
                </span>
              </li>
            </ul>
          </div>
        </section>

        <ScenarioNav
          prev={{ href: "/scenarios/api-docs", label: "API documentation" }}
          next={{ href: "/scenarios/campaign-dashboard", label: "Campaign dashboard" }}
        />
      </div>
    </div>
  );
}
