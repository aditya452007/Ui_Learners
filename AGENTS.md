# AGENTS.md — NameThatUi Learning Repository

## ⚡ Execution Rule — Run in Parallel
**Always execute independent operations in parallel.** Use concurrent tool calls for searches, reads, and any operations that don't depend on each other. Batch multiple bash commands in a single message when they're independent. This is mandatory — sequential execution wastes time.

---

Working rules for every session in this repo: how to turn one namethatui prompt into a built, runnable, beautifully explained mini-app.

## Purpose

This repository is a hands-on learning lab for the UI vocabulary of [namethatui.com](https://namethatui.com/).
The goal is NOT to just read about a component — it is to **build it in a real React app, run it, interact
with it, and see how it behaves in the real world**, one component at a time.

The user brings one component per session (usually by pasting the namethatui prompt + description).
Your job: turn that prompt into a working, interactive showcase.

## Learning philosophy — two audiences, one page

Every demo must explain the component to **two different readers**:

1. **The end user** — someone who will *use* a product built with this component. They don't care about
   React; they care about what they see, what they can do, and why it feels good.
2. **The builder** — the learner running this repo. Assume **little or no knowledge of React**: explain
   *how it works, how it happens, what it is* in plain, simple terms. Define every term you use
   (props, state, render, event), and reach for everyday analogies.

Every session ships the same anatomy-diagram style: the component rendered large and live, with
labelled leader lines pointing at every named part, and every part explained in words a
non-developer can follow. Replicate that visual language every session.

## Non-negotiables

- **Learn by doing.** Every component must be fully built and runnable — never a stub, never "just the theory".
  The component is the star; give it a realistic page around it (context, data, controls) so the user can
  *feel* how it opens, moves, animates, and behaves.
- **One concept = one folder = one mini-app.** Each folder is a standalone Next.js app. No shared monorepo
  coupling, no "just import it from another folder". Isolation is the point — it forces real setup every time.
- **Stack:** Next.js 16 (latest) + TypeScript + Tailwind CSS v4 (whatever create-next-app ships), App Router,
  no `src/` dir.
- **No extra dependencies unless truly needed.** Hand-build everything. No component libraries, no state
  managers. Only add a package when the component genuinely needs it (e.g. a math/animation helper).
- **Keep it focused.** The app demonstrates THAT component and nothing else. No navbar/dashboard chrome,
  no marketing fluff — but the component itself gets a full showcase: anatomy, explanations, and scenarios.

## Design quality — premium, always

The demos ARE the lesson, so the page around the component must look as polished as the component
itself. This is a design-vocabulary repo — a bare, default-looking page teaches the wrong lesson.

- **Light mode is the preferred and default theme.** Light-first design: white or soft-neutral surfaces,
  dark text on light, one restrained accent. Dark mode only when a scenario genuinely demands it
  (a product whose identity is dark — not as a stylistic default).
- **Never ship default styling.** No unstyled browser forms, no cramped text on a bare white page,
  no raw `<input>`s or un-styled buttons. Every element on screen is deliberately styled.
- **Use a deliberate visual system:** a consistent spacing scale with generous whitespace, padded
  cards with rounded corners, subtle borders and shadows, one restrained accent color applied with
  intent, soft neutrals, a clear typographic hierarchy (sans for UI, mono for code), and
  micro-transitions on hover/focus.
- **Premium ≠ busy.** One accent, at most two surface tones, real-looking data, believable product
  context. Apply the premium-design skill for every session.
- **The anatomy diagram is typography too:** precise leader lines, numbered pills, no overlaps,
  labels that never collide with the component.
- **Check the result:** run the app and look at it. If anything looks flat, cramped, misaligned or
  default, fix it before reporting back.

---

## Strict Design Standards — Non-Negotiable

The following are **prohibited** and will be rejected:

- **No purple gradients** or any "AI slope" aesthetic — these look unprofessional and cheap
- **No dark-mode-by-default** websites — light mode is mandatory unless the specific product
  identity genuinely requires dark (e.g., a developer tool, a night-mode app)
- **No unprofessional color schemes** — no neon, no clashing brights, no gradient abuse
- **No amateur typography** — use professional font stacks (system fonts or high-quality web fonts),
  proper line heights, consistent scale, clear hierarchy
- **No flat, cramped, or misaligned layouts** — every page must have deliberate spacing scale,
  visual hierarchy, breathing room, and alignment to a baseline grid
- **No "default browser" look** — every form, button, input, card, table must be intentionally styled

**Required for every page:**
- Light mode, professional color palette (one restrained accent, neutral grays/whites)
- Professional typography: clear hierarchy (headings → body → caption), proper contrast ratios
- Deliberate layout: consistent spacing scale (4/8/12/16/24/32px), aligned to grid, generous whitespace
- Visual hierarchy that guides the eye: primary > secondary > tertiary actions clearly differentiated
- Premium feel: subtle shadows, rounded corners, micro-transitions, real content (not lorem ipsum)

## Workflow (per session)

1. **Read the prompt.** The user pastes the namethatui prompt + description for one component
   (e.g. "Parallax Scrolling — Layers that scroll at different speeds — the background lags and depth appears").
2. **Name the folder** in kebab-case matching the topic, e.g. `parallax/`, `date-picker/`, `progress-indicators/`,
   `accordion/`, `badge-chip-pill/`. Keep names short and obvious.
3. **Think where it fits before writing any code.** Ask yourself: *where would a real product use this?
   What user need does it serve?* Then pick **three concrete scenarios** — three different real-world
   products/contexts where the component genuinely fits. The scenarios must differ meaningfully from each
   other (different mode, different context, different configuration — showing *extensibility*, not
   reskins of the same thing).
4. **Scaffold the mini-app** (see [Scaffold commands](#scaffold-commands)).
5. **Build the learning hub** (`/`) — the anatomy diagram + the dual-audience explanations (see below).
6. **Build the three scenario pages** (`/scenarios/<name>/`) — each with a **live, working variant**
   of the component in a realistic context, plus a short "why it fits here" note (see below).
7. **Verify** it actually works: run `npm run build` and fix any errors. If the component is interactive,
   also boot `npm run dev` and confirm the pages serve.
8. **Update the checklist** in `README.md` — tick `[x]` for the component, add the folder name next to it,
   and note the date.
9. **Report back** concisely: what was built, the routes (e.g. `http://localhost:3000/` + the scenario
   routes), the three scenarios chosen and why, and anything interesting observed while using it.

## The learning hub page (`/`)

This is the main event — the page the learner lands on. It must contain:

1. **Name + "also called".** The title and the alternative names from the prompt (e.g. "Also called:
   calendar popup, calendar dropdown, date range picker").
2. **A live anatomy diagram.** The component (or its most interesting state) rendered large, with
   numbered callout pills and leader lines pointing at every named part. Use the exact vocabulary from
   the prompt (e.g. `range_start`, `button_previous`, `today`). Make the diagram **live**: where the
   component is interactive, let the user click/drag and have the labels chase the selection. Keep the
   visual language precise — the right text in the right place teaches more than paragraphs.
3. **Layered explanations for every named part** — two lines per part, side by side:
   - **What you see** — end-user language: what the user of a real product experiences, why it exists,
     what it lets them do.
   - **How it works** — builder language for a React beginner: state, events, rendering, ARIA —
     explained simply, with every term defined and an everyday analogy where it helps.
   These explanations can live directly on the anatomy parts (like callout captions) or in a matching
   list right under the diagram.
4. **A short "what am I looking at" intro strip** — e.g. three mini-cards showing the component's
   structure at a glance (for the date picker: trigger → popover → grid).

### Explaining to a beginner — style rules

- Define every technical term on first use. Props = "settings you hand the component when you use it".
  State = "values the component remembers between clicks". Render = "drawing the screen again".
- Use analogies from everyday life (a light switch for boolean state, a form you fill and submit,
  a book you flip pages in).
- Prefer "when you click X, Y happens because Z" over passive descriptions.
- Explain the *why*: every part exists because a user needs it.
- Keep each explanation to 2–4 sentences. Simple beats exhaustive.

## The three scenario pages (`/scenarios/<name>/`)

Each of the three scenarios becomes its own **route with a live, working variant** of the component.
Goal: the learner sees *where* the component belongs and *how it is used properly* in real products,
not just what it looks like.

Each scenario page must include:

1. **A realistic product context** — believable surrounding content (real-ish data, a plausible product:
   a booking flow, a settings screen, a search filter, a dashboard…).
2. **A working variant of the component**, configured differently per scenario to show **extensibility**:
   different modes, sizes, options, edge handling (e.g. date picker: range mode in a booking flow,
   single date in a form, disabled days + min/max in an admin tool). Do NOT ship three copies of the
   same demo — each scenario must exercise something the others don't.
3. **Why it fits here + what the user gains** — 2–3 sentences: what user need this solves in this
   context and how it improves the experience (faster, fewer errors, clearer feedback…).
4. **A small nav** linking the hub and the three scenarios both ways (hub → scenarios, scenario →
   hub / next scenario).

Scenario folder names are kebab-case describing the context, e.g. `booking-flow/`, `birthday-form/`,
`travel-search/`.

## Scaffold commands

From the repo root, for each new component folder (Windows / PowerShell):

```powershell
npx create-next-app@latest <folder> --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --yes
```

Then, per app:

| Command | Purpose |
| --- | --- |
| `npm run dev` | http://localhost:3000 — interact with the component |
| `npm run build` | must pass before considering the session done |

## Cleaning up — freeing disk space

Dependencies and build output are regenerable; they are the only things safe to delete.

- When the user asks to delete node_modules or free up space, remove the generated folders from
  **every** mini-app folder (steps/, date-picker/, parallax/, … — check them all):
  - `node_modules/` — recreated with `npm install`
  - `.next/` — Next.js build/dev cache, recreated by `npm run dev` / `npm run build`
  - any other build/cache output (`out/`, `.turbo/`, `dist/`)
- Keep every user-authored file: `package.json`, `package-lock.json`, config files
  (`tsconfig.json`, `next.config.*`, `postcss.config.*`), source in `app/`, READMEs, .gitignore.
  Deleting these is never part of a cleanup.
- After deleting, note in the report that the next `npm run dev` / `npm run build` needs an
  `npm install` first.

## Directory conventions

```
C:\Users\Hp\NameThatUi\
├── AGENTS.md              # this file
├── README.md              # usage guide + the 76-component checklist (tick as you learn)
├── .gitignore             # ignores node_modules / .next / build artifacts everywhere
└── <component>/           # e.g. date-picker/ — standalone Next.js app
    └── app/
        ├── page.tsx                  # the learning hub: anatomy + layered explanations
        └── scenarios/
            ├── <scenario-a>/page.tsx # live demo of the component in context #1
            ├── <scenario-b>/page.tsx # live demo of the component in context #2
            └── <scenario-c>/page.tsx # live demo of the component in context #3
```

- Each scaffolded app brings its own `.gitignore` from create-next-app — leave it.
- Don't commit anything unless the user explicitly asks.

## Source material

The full catalog lives at https://namethatui.com/ (as of Jul 2026: **76 components — 44 web, 32 macOS**).
Each entry has a "paste-ready prompt" — the user will paste those prompts here. Web components are the
primary focus (they map directly to React). macOS entries are native Apple UI — treat those sessions as
"build a web approximation of the pattern" (e.g. a Slider, a Stepper, a Popover) and say so. macOS
sessions still get the same three-scenario showcase and layered explanations.