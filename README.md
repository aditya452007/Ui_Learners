# NameThatUi — Learning Lab

Hands-on study of every component from [namethatui.com](https://namethatui.com/).
Each entry in the checklist below is its own standalone **Next.js 16 + TypeScript + Tailwind CSS v4** mini-app
in a folder of its own. The point is to **build each component and use it for real** — not just read about it.

## How a session works

1. Paste the namethatui prompt + description for a component.
2. The agent figures out *where the component belongs* — the products and situations it serves — and
   builds it as a multi-page showcase inside its own folder.
3. **Every mini-app ships two kinds of pages:**
   - **The learning hub** (`/`) — a live anatomy diagram: the real component with numbered callout
     labels and leader lines pointing at every named part. Every part gets a two-layer explanation:
     *What you see* (plain words for the person using the product) and *How it works* (simple
     technical terms, assuming no React knowledge).
   - **Three scenario pages** (`/scenarios/<name>/`) — the component used *for real* in three
     different products: a booking flow, a search filter, a settings screen… Each page is a live,
     working variant (different mode / configuration / edge handling), so you see not just what the
     component looks like but how and where it's used properly.
4. Run it, play with it, click the parts, break it.
5. Tick it off the checklist below.

## Checklist (76 components — 44 web, 32 macOS)

### Web (44)

- [x] Parallax Scrolling — `parallax/` (2026-07-31)
- [x] Date Picker — `date-picker/` (2026-07-31)
- [ ] Pagination — `pagination/`
- [ ] Sign-in Form — `sign-in-form/`
- [x] Carousel — `carousel/` (2026-08-05)
- [ ] Site Header vs. Navigation Bar — `header-navbar/`
- [ ] Card — `card/`
- [x] Resize Handle (Size Grip) — `resize-handle/` (2026-08-13)
- [ ] Hamburger Menu (Nav Drawer) — `hamburger-menu/`
- [ ] Bento Grid — `bento-grid/`
- [ ] Masonry Layout (Pinterest Grid) — `masonry/`
- [ ] Easing (Timing Function) — `easing/`
- [ ] Spring Animation — `spring/`
- [ ] Text Scramble (Decode Effect) — `text-scramble/`
- [x] Lightbox — `lightbox/` (2026-08-18)
- [ ] Marquee — `marquee/`
- [ ] Truncation (Ellipsis & Line Clamp) — `truncation/`
- [ ] Drag & Drop — `drag-and-drop/`
- [x] Divider vs. Separator vs. Rule — `divider/` (2026-08-19)
- [ ] Progress Ring vs. Spinner vs. Progress Bar — `progress-indicators/`
- [ ] The Three Dots (Overflow Menu) — `three-dots/`
- [x] Toast (Snackbar) — `toast/` (2026-08-21)
- [ ] Modal Dialog vs. Drawer vs. Sheet — `dialog-drawer-sheet/`
- [ ] Popover vs. Dropdown Menu vs. Tooltip — `popover-dropdown-tooltip/`
- [ ] Scrim (Backdrop / Overlay) — `scrim/`
- [ ] Skeleton vs. Spinner — `skeleton-spinner/`
- [ ] Combobox (Autocomplete / Typeahead) — `combobox/`
- [ ] Command Palette — `command-palette/`
- [ ] Accordion (Disclosure) — `accordion/`
- [ ] Tabs — `tabs/`
- [ ] Badge vs. Chip vs. Pill vs. Tag — `badge-chip-pill/`
- [ ] Breadcrumbs — `breadcrumbs/`
- [ ] Sticky vs. Fixed Positioning — `sticky-fixed/`
- [ ] Focus Ring (`:focus-visible`) — `focus-ring/`
- [ ] Empty State — `empty-state/`
- [ ] Hover Card — `hover-card/`
- [ ] Switch vs. Checkbox vs. Radio — `switch-checkbox-radio/`
- [ ] Toggle Group (Segmented Control) — `toggle-group/`
- [x] Steps — `steps/` (2026-08-01)
- [ ] Avatar Group — `avatar-group/`
- [ ] Multi-select — `multi-select/`
- [x] Scrollspy — `scrollspy/` (2026-08-03)
- [x] Inline Alert vs. Callout vs. Banner — `alert-callout-banner/` (2026-08-04)
- [ ] *(one more web entry pending catalog refresh on namethatui.com)*

### macOS (32) — native Apple UI, learned as web approximations

- [x] Insertion Caret — `insertion-caret/` (2026-08-12)
- [x] Pointer (Cursor) — `pointer/` (2026-08-14)
- [ ] Alert — `alert/`
- [ ] Slider — `slider/`
- [ ] Color Well — `color-well/`
- [ ] Mac Window — `window/`
- [x] Split View — `split-view/` (2026-08-20)
- [ ] Scroll View (Scroller) — `scroll-view/`
- [ ] Search Field — `search-field/`
- [ ] Save Panel — `save-panel/`
- [ ] Token Field — `token-field/`
- [ ] Combo Button — `combo-button/`
- [ ] Level Indicator — `level-indicator/`
- [ ] Column View (Browser) — `column-view/`
- [ ] Outline View — `outline-view/`
- [ ] Menu Bar — `menu-bar/`
- [x] Context Menu — `context-menu/` (2026-08-22)
- [ ] Disclosure Triangle — `disclosure-triangle/`
- [ ] Dock Badge — `dock-badge/`
- [ ] Focus Ring — `focus-ring-macos/`
- [ ] Inspector — `inspector/`
- [ ] Panel (Floating Window / HUD) — `panel/`
- [ ] Popover — `popover-macos/`
- [ ] Pop-Up vs. Pull-Down vs. Combo Box — `popup-pulldown-combo/`
- [ ] Segmented Control — `segmented-control/`
- [ ] Sheet — `sheet/`
- [ ] Sidebar (Source List) — `sidebar/`
- [ ] Stepper — `stepper/`
- [ ] Toolbar (Unified Title Bar) — `toolbar/`
- [ ] Traffic Lights — `traffic-lights/`
- [ ] Visual Effect Material (Vibrancy) — `vibrancy/`
- [x] Menu Bar Extra (Status Item) — `menu-bar-extra/` (2026-08-23)

---

**Progress:** 14 / 76 · Updated: 2026-08-22
