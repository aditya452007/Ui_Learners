/* Shared brick data for the masonry learning lab.
   Every brick keeps its own height via a reserved aspect ratio (w/h),
   so the wall never jumps while "images" load. */

export type Palette = {
  name: string;
  bg: string;
  soft: string;
  deep: string;
  ink: string;
};

export const PALETTES: Palette[] = [
  { name: "Clay", bg: "#f7efe3", soft: "#e9d6bd", deep: "#9a3412", ink: "#292524" },
  { name: "Sage", bg: "#edf2e7", soft: "#d7e2c9", deep: "#3f6212", ink: "#1a2e05" },
  { name: "Mist", bg: "#eaf0f4", soft: "#cfdee9", deep: "#0c4a6e", ink: "#082f49" },
  { name: "Blush", bg: "#f9ecec", soft: "#efd0d3", deep: "#9f1239", ink: "#4c0519" },
  { name: "Sand", bg: "#f5f0e1", soft: "#e6dabd", deep: "#92400e", ink: "#451a03" },
  { name: "Stone", bg: "#efeeeb", soft: "#dbd7cd", deep: "#57534e", ink: "#1c1917" },
  { name: "Teal", bg: "#e6f0ee", soft: "#c6e0da", deep: "#0f766e", ink: "#042f2e" },
  { name: "Ochre", bg: "#faf3df", soft: "#efe0b8", deep: "#b45309", ink: "#451a03" },
];

export type Brick = {
  id: string;
  title: string;
  tag: string;
  /** reserved aspect ratio, width over height */
  w: number;
  h: number;
  palette: number;
  scene: number;
  blurb?: string;
  meta?: string;
  price?: string;
  rating?: string;
  badge?: string;
};

/* Estimated rendered height in "units" for a fixed column width of 100.
   Caption blocks (title / text / price rows) add a constant, which is how
   the JS engine can balance columns before anything is measured. */
export function units(b: Brick, caption = 0): number {
  return (b.h / b.w) * 100 + caption;
}

/** Greedy shortest-column packing: each item joins the currently shortest column. */
export function splitBalanced<T>(items: T[], cols: number, size: (item: T) => number): T[][] {
  const stacks: T[][] = Array.from({ length: cols }, () => []);
  const heights = new Array<number>(cols).fill(0);
  for (const item of items) {
    let target = 0;
    for (let c = 1; c < cols; c++) if (heights[c] < heights[target]) target = c;
    stacks[target].push(item);
    heights[target] += size(item);
  }
  return stacks;
}

/** Round-robin split (what react-masonry-css does): preserves left-to-right
    reading order row by row, but columns can end up uneven. */
export function splitSequence<T>(items: T[], cols: number): T[][] {
  const stacks: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => stacks[i % cols].push(item));
  return stacks;
}

/** Which column would a new brick join? Returns index + resulting heights. */
export function shortestColumn(heights: number[]): number {
  let target = 0;
  for (let c = 1; c < heights.length; c++) if (heights[c] < heights[target]) target = c;
  return target;
}

/* ── Hub wall: 12 bricks, deliberately mixed heights ── */
export const HUB_BRICKS: Brick[] = [
  { id: "h1", title: "Morning arches", tag: "Interior", w: 4, h: 5, palette: 0, scene: 0 },
  { id: "h2", title: "Low tide study", tag: "Seascape", w: 4, h: 3, palette: 2, scene: 5 },
  { id: "h3", title: "Dune lines", tag: "Desert", w: 4, h: 6, palette: 4, scene: 2 },
  { id: "h4", title: "Studio grid", tag: "Abstract", w: 4, h: 4, palette: 5, scene: 3 },
  { id: "h5", title: "Citrus sun", tag: "Print", w: 4, h: 3, palette: 7, scene: 1 },
  { id: "h6", title: "North peak", tag: "Alpine", w: 4, h: 5, palette: 6, scene: 4 },
  { id: "h7", title: "Rose diagram", tag: "Abstract", w: 4, h: 4, palette: 3, scene: 3 },
  { id: "h8", title: "Salt flats", tag: "Desert", w: 4, h: 3, palette: 1, scene: 2 },
  { id: "h9", title: "Harbour mist", tag: "Seascape", w: 4, h: 6, palette: 2, scene: 5 },
  { id: "h10", title: "Kiln room", tag: "Interior", w: 4, h: 4, palette: 0, scene: 0 },
  { id: "h11", title: "Orchard rows", tag: "Print", w: 4, h: 5, palette: 1, scene: 1 },
  { id: "h12", title: "Basalt steps", tag: "Alpine", w: 4, h: 3, palette: 5, scene: 4 },
];

export const EXTRA_BRICKS: Brick[] = [
  { id: "x1", title: "Paper moon", tag: "Print", w: 4, h: 4, palette: 3, scene: 1 },
  { id: "x2", title: "Reed beds", tag: "Seascape", w: 4, h: 6, palette: 6, scene: 2 },
  { id: "x3", title: "Courtyard", tag: "Interior", w: 4, h: 3, palette: 7, scene: 0 },
  { id: "x4", title: "Gravel garden", tag: "Abstract", w: 4, h: 5, palette: 5, scene: 3 },
];

/* ── Scenario 1: inspiration board (image-only bricks) ── */
export const BOARD_ITEMS: Brick[] = [
  { id: "b1", title: "Limewash living room", tag: "Interior", w: 3, h: 4, palette: 0, scene: 0 },
  { id: "b2", title: "Fog over the pier", tag: "Seascape", w: 3, h: 2, palette: 2, scene: 5 },
  { id: "b3", title: "Erg Admer dunes", tag: "Desert", w: 3, h: 4, palette: 4, scene: 2 },
  { id: "b4", title: "Poster wall, studio B", tag: "Abstract", w: 3, h: 3, palette: 5, scene: 3 },
  { id: "b5", title: "Blood-orange sunrise", tag: "Print", w: 3, h: 2, palette: 7, scene: 1 },
  { id: "b6", title: "Refuge hut, 2,400 m", tag: "Alpine", w: 3, h: 4, palette: 6, scene: 4 },
  { id: "b7", title: "Herb garden plan", tag: "Garden", w: 3, h: 3, palette: 1, scene: 3 },
  { id: "b8", title: "Rosehip palette", tag: "Abstract", w: 3, h: 2, palette: 3, scene: 1 },
  { id: "b9", title: "Night ferry", tag: "Seascape", w: 3, h: 4, palette: 2, scene: 5 },
  { id: "b10", title: "Reading corner", tag: "Interior", w: 3, h: 3, palette: 0, scene: 0 },
  { id: "b11", title: "Olive terraces", tag: "Garden", w: 3, h: 4, palette: 1, scene: 2 },
  { id: "b12", title: "Granite cirque", tag: "Alpine", w: 3, h: 2, palette: 5, scene: 4 },
  { id: "b13", title: "Market awnings", tag: "Print", w: 3, h: 3, palette: 7, scene: 0 },
  { id: "b14", title: "Salt pan geometry", tag: "Desert", w: 3, h: 4, palette: 4, scene: 3 },
  { id: "b15", title: "Camellia study", tag: "Garden", w: 3, h: 2, palette: 3, scene: 2 },
];

/* ── Scenario 2: recipe magazine (mixed text heights) ── */
export const RECIPES: Brick[] = [
  {
    id: "r1", title: "15-minute miso soup", tag: "Weeknight", w: 4, h: 3, palette: 6, scene: 1,
    blurb: "Dashi, white miso, silken tofu. Dinner before the rice finishes.",
    meta: "15 min · Easy",
  },
  {
    id: "r2", title: "Slow Sunday ragù", tag: "Project", w: 4, h: 4, palette: 0, scene: 2,
    blurb: "Four hours, one pot, zero regrets. The sauce that makes the house smell like someone loves you. Brown the meat hard, deglaze with milk before wine, and let time do the rest.",
    meta: "4 hr · Worth it",
  },
  {
    id: "r3", title: "Charred citrus salad", tag: "No-cook", w: 4, h: 5, palette: 7, scene: 1,
    blurb: "Blood orange, fennel, olives.",
    meta: "10 min · No-cook",
  },
  {
    id: "r4", title: "Overnight focaccia", tag: "Baking", w: 4, h: 3, palette: 4, scene: 0,
    blurb: "Mix tonight, dimple tomorrow. The no-knead crumb that ruined store-bought bread for our whole test kitchen — crisp olive-oil base, open airy middle.",
    meta: "18 hr · Mostly waiting",
  },
  {
    id: "r5", title: "Green goddess bowls", tag: "Weeknight", w: 4, h: 4, palette: 1, scene: 3,
    blurb: "Herby tahini dressing over grains and whatever is wilting in the drawer. A formula, not a recipe.",
    meta: "25 min · Flexible",
  },
  {
    id: "r6", title: "Basque cheesecake", tag: "Baking", w: 4, h: 3, palette: 3, scene: 4,
    blurb: "Burnt on purpose. Jiggly in the middle, caramel-bitter on top.",
    meta: "1 hr · Show-off",
  },
  {
    id: "r7", title: "Grandma's lentil soup", tag: "Project", w: 4, h: 5, palette: 5, scene: 2,
    blurb: "Red lentils, cumin, lemon. This is the one readers email about. It scales to a crowd, freezes beautifully, and the crispy onions on top are non-negotiable — make double, they vanish off the tray.",
    meta: "50 min · Freezer hero",
  },
  {
    id: "r8", title: "Smashed cucumber", tag: "No-cook", w: 4, h: 3, palette: 6, scene: 5,
    blurb: "Smash, salt, dress with black vinegar and chilli crisp.",
    meta: "10 min · Side",
  },
  {
    id: "r9", title: "Brown-butter banana bread", tag: "Baking", w: 4, h: 4, palette: 0, scene: 4,
    blurb: "The three black bananas on your counter finally have a destiny. Brown butter + dark sugar = toffee edges.",
    meta: "1 hr 10 · Classic",
  },
];

/* ── Scenario 3: maker shop (product cards) ── */
export const PRODUCTS: Brick[] = [
  { id: "p1", title: "Stoneware pour-over set", tag: "Ceramics", w: 4, h: 4, palette: 5, scene: 0, price: "$68", rating: "4.9 (312)", badge: "Bestseller" },
  { id: "p2", title: "Oak phone stand", tag: "Wood", w: 4, h: 3, palette: 4, scene: 3, price: "$34", rating: "4.7 (98)" },
  { id: "p3", title: "Hand-loomed throw", tag: "Textile", w: 4, h: 5, palette: 3, scene: 2, price: "$120", rating: "5.0 (61)", badge: "Small batch" },
  { id: "p4", title: "Brass desk lamp", tag: "Metal", w: 4, h: 3, palette: 7, scene: 1, price: "$145", rating: "4.8 (204)" },
  { id: "p5", title: "Speckled espresso cups, pair", tag: "Ceramics", w: 4, h: 4, palette: 0, scene: 4, price: "$42", rating: "4.9 (187)" },
  { id: "p6", title: "Walnut serving board", tag: "Wood", w: 4, h: 3, palette: 1, scene: 0, price: "$56", rating: "4.6 (73)", badge: "Back in stock" },
  { id: "p7", title: "Indigo cushion cover", tag: "Textile", w: 4, h: 4, palette: 2, scene: 5, price: "$38", rating: "4.8 (140)" },
  { id: "p8", title: "Copper bud vase", tag: "Metal", w: 4, h: 5, palette: 6, scene: 1, price: "$48", rating: "4.7 (52)" },
  { id: "p9", title: "Rye bread box", tag: "Wood", w: 4, h: 3, palette: 4, scene: 4, price: "$74", rating: "4.9 (88)" },
  { id: "p10", title: "Matte ramen bowl", tag: "Ceramics", w: 4, h: 4, palette: 5, scene: 2, price: "$36", rating: "4.8 (265)" },
  { id: "p11", title: "Linen apron, forest", tag: "Textile", w: 4, h: 5, palette: 1, scene: 3, price: "$64", rating: "4.9 (119)", badge: "New" },
  { id: "p12", title: "Steel pour-over dripper", tag: "Metal", w: 4, h: 3, palette: 5, scene: 1, price: "$52", rating: "4.5 (64)" },
];

export const MORE_PRODUCTS: Brick[] = [
  { id: "p13", title: "Ash soap dish", tag: "Wood", w: 4, h: 3, palette: 7, scene: 3, price: "$18", rating: "4.6 (41)" },
  { id: "p14", title: "Celadon tea cup", tag: "Ceramics", w: 4, h: 4, palette: 6, scene: 4, price: "$28", rating: "4.9 (77)" },
  { id: "p15", title: "Wool dryer balls, set of 3", tag: "Textile", w: 4, h: 3, palette: 3, scene: 5, price: "$22", rating: "4.7 (203)" },
  { id: "p16", title: "Pewter picture frame", tag: "Metal", w: 4, h: 5, palette: 2, scene: 0, price: "$58", rating: "4.8 (35)", badge: "New" },
];
