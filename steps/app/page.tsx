import Link from "next/link";
import { Anatomy } from "./components/anatomy";
import { CheckIcon } from "./components/icons";

function PartCard({
  num,
  title,
  caption,
  visual,
}: {
  num: string;
  title: string;
  caption: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <div className="my-4 flex items-center justify-center">{visual}</div>
      <p className="mt-auto text-xs leading-relaxed text-slate-500">{caption}</p>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{kicker}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </div>
  );
}

function Explain({
  num,
  name,
  code,
  see,
  work,
}: {
  num: string;
  name: string;
  code: string;
  see: string;
  work: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
          {num}
        </span>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
          {code}
        </code>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-indigo-50/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
            What you see
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{see}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200/70">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            How it works
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{work}</p>
        </div>
      </div>
    </div>
  );
}

function WildCard({
  href,
  kicker,
  title,
  text,
}: {
  href: string;
  kicker: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">{kicker}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
      <p className="mt-3 text-xs font-semibold text-indigo-600 group-hover:underline">
        Open the demo →
      </p>
    </Link>
  );
}

const miniCircle = (cls: string, children: React.ReactNode) => (
  <span
    className={`grid size-7 shrink-0 place-items-center rounded-full ${cls}`}
  >
    {children}
  </span>
);

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Steps</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Also called:{" "}
          <span className="font-medium text-slate-700">
            stepper, wizard progress indicator, step indicator, step-by-step indicator, multi-step
            progress, step bar
          </span>
          . A row of numbered circles — one per stage of a multi-step process — joined by lines.
          The stage you are on carries{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-700">
            aria-current=&quot;step&quot;
          </code>
          , finished stages swap their number for a checkmark, and stages ahead stay muted.
        </p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <PartCard
          num="1"
          title="The list — <ol> of stages"
          caption="Stages are an ordered list, not equal pages — 1, 2, 3 is real sequence, and screen readers announce “step 2 of 4”."
          visual={
            <div className="flex items-center gap-1">
              {miniCircle("bg-slate-900 text-[10px] font-bold text-white", "1")}
              <span className="h-0.5 w-6 bg-indigo-500" />
              {miniCircle("bg-indigo-600 text-[10px] font-bold text-white", "2")}
              <span className="h-0.5 w-6 bg-slate-200" />
              {miniCircle(
                "bg-slate-100 text-[10px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200",
                "3"
              )}
            </div>
          }
        />
        <PartCard
          num="2"
          title="Steps.Indicator — the numbered circle"
          caption="One compact circle per stage holding the stage number (Material UI calls it StepIcon)."
          visual={
            <div className="flex items-center gap-2">
              {miniCircle("bg-indigo-600 text-white", <CheckIcon className="h-3.5 w-3.5" />)}
              {miniCircle(
                "bg-white text-[11px] font-bold text-indigo-600 ring-2 ring-indigo-600",
                "2"
              )}
              {miniCircle(
                "bg-slate-100 text-[11px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200",
                "3"
              )}
            </div>
          }
        />
        <PartCard
          num="3"
          title="StepConnector — the line between"
          caption="Joins adjacent stages (Steps.Separator); tinted through completed ones, muted ahead of the current stage."
          visual={
            <div className="flex items-center">
              {miniCircle("bg-indigo-600 text-[10px] font-bold text-white", "1")}
              <span className="mx-1 h-1 w-12 rounded-full bg-indigo-500" />
              {miniCircle(
                "bg-white text-[10px] font-bold text-indigo-600 ring-2 ring-indigo-600",
                "2"
              )}
              <span className="mx-1 h-1 w-12 rounded-full bg-slate-200" />
              {miniCircle(
                "bg-slate-100 text-[10px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200",
                "3"
              )}
            </div>
          }
        />
      </section>

      <section className="mt-14">
        <SectionHeading
          kicker="Anatomy"
          title="Every part, named"
          note="This is a real, working Steps — you arrive on Payment (step 2), so all three states are on screen at once."
        />
        <div className="mt-6">
          <Anatomy />
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          kicker="Explained"
          title="Every part, for two readers"
          note="One line for the person using a product, one for the person building it — no React knowledge assumed."
        />
        <div className="mt-6 grid gap-4">
          <Explain
            num="1"
            name="Step indicator"
            code="Steps.Indicator · StepIcon"
            see="A small numbered circle for every stage. It answers “how many parts are there, and which one is which” in a glance — the number is the position, the colour is the state."
            work="Each stage is one item in the items array (the list of labels you pass in), and the circle is a <span> inside an <li>. The number is just index + 1 — where the stage sits in that array. Its colours come from three statuses — complete, current, upcoming — that the component works out for you."
          />
          <Explain
            num="2"
            name="Step connector"
            code="StepConnector · Steps.Separator"
            see="The thin line joining the circles. Behind you it is tinted in, ahead it stays grey, so your eye can trace “done → doing → to do” without reading a word."
            work="A <span> stretched between two circles. It asks the circle to its left “are you finished?” — if yes it turns indigo, if not it stays muted. It is decoration, so it is hidden from screen readers with aria-hidden."
          />
          <Explain
            num="3"
            name="Completed step"
            code="Steps.Status — complete"
            see="Finished stages swap their number for a checkmark. Your work is banked, and the tinted line behind it confirms the path you have walked."
            work="When the current index is greater than the stage's own index, the circle renders a check icon instead of the number. Nothing is stored per stage — the checkmarks appear and move as a group because they are all derived (computed) from that one number."
          />
          <Explain
            num="4"
            name="Current step"
            code='aria-current="step"'
            see="The one stage you are on now — a ring around the white circle and a bold label. Everything behind is done, everything ahead is waiting."
            work={`One zero-based number marks it: activeStep={2} means the third stage. The stage's <li> carries aria-current="step" — the HTML attribute that tells screen readers “this is the stage you are at”. Compare every index with the number: below → complete, equal → current, above → upcoming.`}
          />
          <Explain
            num="5"
            name="Step label"
            code="StepLabel · Steps.Title"
            see="The short caption under each number — Shipping, Payment. You read a word, not a riddle."
            work="Plain text taken from the items array you hand the component. A label never disappears — only the circle swaps between a number and a checkmark."
          />
          <Explain
            num="6"
            name="The ordered list"
            code="<ol>"
            see="The frame that makes stages a sequence instead of three lonely circles. It is why “step 1 of 4” means something to you and to a screen reader."
            work="WAI's pattern builds the indicator as an <ol> because stages have real order — that is what separates Steps from tabs (peer views, aria-selected), breadcrumbs (a hierarchy) and pagination (equal, addressable pages). Assistive tech announces position and count straight from the list."
          />
          <Explain
            num="7"
            name="One index drives all"
            code="activeStep={2} · current={2}"
            see="Nothing is configured per circle. Change one number and the whole strip repaints — done behind, doing now, waiting ahead. It cannot fall out of sync."
            work="A single statusOf function compares every index with the one zero-based number and returns complete, current or upcoming. When the number changes, React re-renders (draws the screen again) and every circle and connector recomputes from it."
          />
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          kicker="In the wild"
          title="Three places Steps belongs"
          note="Each scenario is a live, working variant — a different mode, a different rule, a different edge case."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <WildCard
            href="/scenarios/checkout-flow"
            kicker="Scenario 1 — checkout"
            title="Store checkout"
            text="The scene from the prompt: horizontal steps, clickable completed circles, and the full arc to every circle a checkmark once the order is placed."
          />
          <WildCard
            href="/scenarios/onboarding-wizard"
            kicker="Scenario 2 — onboarding"
            title="Account setup wizard"
            text="A vertical wizard where Continue stays disabled until the current step's form is valid, and your data survives going back."
          />
          <WildCard
            href="/scenarios/document-verification"
            kicker="Scenario 3 — verification"
            title="ID verification"
            text={`A bank-style flow where the upload step can fail: the circle turns red (status="error") and you retry without restarting the application.`}
          />
        </div>
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-400">
        Careful with the word <span className="font-medium text-slate-500">stepper</span> — on
        macOS a Stepper (NSStepper) is the tiny pair of up/down arrows that changes one number,
        nothing to do with wizards. Steps is also not pagination (equal pages of one collection),
        not breadcrumbs (where you sit in a hierarchy), not tabs (peer views that use
        aria-selected) and not a progress bar (a percentage with no named stages). Anatomy names
        follow Material UI (StepIcon, StepLabel, StepConnector, activeStep) and Ant Design
        (current, status) — the same one-index idea in every library.
      </footer>
    </main>
  );
}
