"use client";

import Link from "next/link";
import { useState } from "react";
import { DemoNav } from "@/components/nav";
import { Drawer, SurfaceHeader } from "@/components/overlay";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
};

const INITIAL: Product[] = [
  { id: "p1", name: "Everyday Canvas Tote", sku: "BAG-0142", price: 32, stock: 184, category: "Bags" },
  { id: "p2", name: "Ceramic Pour-Over Set", sku: "KTN-0091", price: 58, stock: 42, category: "Kitchen" },
  { id: "p3", name: "Wool Runner Socks", sku: "APP-0233", price: 18, stock: 9, category: "Apparel" },
  { id: "p4", name: "Brass Desk Lamp", sku: "HME-0077", price: 120, stock: 27, category: "Home" },
  { id: "p5", name: "Trail Water Bottle", sku: "OUT-0158", price: 26, stock: 0, category: "Outdoor" },
  { id: "p6", name: "Linen Apron", sku: "KTN-0119", price: 44, stock: 63, category: "Kitchen" },
];

const CATEGORIES = ["Bags", "Kitchen", "Apparel", "Home", "Outdoor"];

function stockBadge(stock: number) {
  if (stock === 0)
    return <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-semibold text-danger">Out of stock</span>;
  if (stock < 15)
    return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">Low · {stock}</span>;
  return <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">{stock} in stock</span>;
}

export default function InventoryEditorPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Product | null>(null);
  const [modal, setModal] = useState(true);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const editing = products.find((p) => p.id === editingId) ?? null;
  const open = editingId !== null && draft !== null;

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({ ...p });
    setSavedNote(null);
  }

  function close(reason: string) {
    setEditingId(null);
    setDraft(null);
    if (reason === "action" && draft) {
      setProducts((ps) => ps.map((p) => (p.id === draft.id ? draft : p)));
      setSavedNote(`“${draft.name}” saved — $${draft.price} · ${draft.stock} in stock.`);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Scenario 2 · Side drawer
        </p>
        <DemoNav current="/scenarios/inventory-editor" />
      </div>

      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Stockroom — edit in a drawer
        </h1>
        <p className="max-w-2xl leading-relaxed text-text-muted">
          A store admin fixing prices and stock. The drawer slides from the
          right so the product table stays visible at the edge — editing with
          the context still in sight. Toggle off “modal” to dock the same panel
          beside a live, clickable table.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          role="switch"
          aria-checked={modal}
          onClick={() => setModal((m) => !m)}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition ${
            modal
              ? "border-accent/30 bg-accent-light text-accent"
              : "border-border text-text-muted hover:text-foreground"
          }`}
        >
          <span
            aria-hidden="true"
            className={`relative h-4 w-7 rounded-full transition-colors ${modal ? "bg-accent" : "bg-border-strong"}`}
          >
            <span
              className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${modal ? "left-3.5" : "left-0.5"}`}
            />
          </span>
          {modal ? "modal drawer · scrim + focus trap" : "non-modal drawer · table stays live"}
        </button>
        {savedNote && (
          <p role="status" className="font-mono text-xs text-success">
            {savedNote}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Products · {products.length}</h2>
          <span className="font-mono text-[11px] text-text-faint">
            {modal ? "drawer opens modal — list dimmed" : "drawer opens docked — list clickable"}
          </span>
        </div>
        <ul className="divide-y divide-border">
          {products.map((p) => (
            <li
              key={p.id}
              className={`flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors ${
                editingId === p.id ? "bg-accent-light/50" : "hover:bg-surface-alt/60"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-alt font-mono text-xs font-bold text-text-muted ring-1 ring-border">
                {p.sku.slice(0, 3)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="font-mono text-[11px] text-text-faint">
                  {p.sku} · {p.category}
                </p>
              </div>
              <span className="hidden font-mono text-sm sm:block">${p.price}</span>
              {stockBadge(p.stock)}
              <button
                type="button"
                onClick={() => startEdit(p)}
                aria-haspopup="dialog"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold">Why a drawer fits here</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
            Editing one row of many: the user gains orientation — the table,
            the SKU, the neighboring stock levels stay visible while the form
            is open. A centered modal would hide the very context being fixed.
            Saving updates the row in place and returns focus to its Edit
            button, so auditing down the list is one keypress per row.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold">Modal vs. non-modal, live</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
            With the switch on, the drawer adds a scrim and traps Tab — the
            table is visible but inert. With it off, the same panel docks with
            no scrim and the table stays clickable: compare SKUs mid-edit, then
            tab back. Same shape, different manners.
          </p>
          <p className="mt-3 rounded-lg bg-surface-alt px-3 py-2 font-mono text-[11px] leading-relaxed text-text-muted">
            {modal
              ? '<aside role="dialog" aria-modal="true"> · fixed right + scrim + trap'
              : '<aside role="dialog"> · fixed right, no scrim, page live'}
          </p>
        </div>
      </div>

      <Drawer
        open={open}
        onClose={(r) => close(r)}
        modal={modal}
        describedBy="inventory-desc"
      >
        {draft && (
          <div className="flex h-full flex-col p-6">
            <SurfaceHeader
              title={editing?.name ?? "Edit product"}
              description={editing ? `${editing.sku} · editing in context` : undefined}
              onClose={() => close("close-button")}
            />
            <p id="inventory-desc" className="mt-3 text-[13px] leading-relaxed text-text-muted">
              {modal
                ? "Modal drawer — Esc, ×, or the scrim backs out; Tab stays inside."
                : "Docked drawer — no scrim, the table behind is still clickable."}
            </p>

            <label className="mt-5 block text-xs font-semibold text-text-muted">
              Product name
              <input
                data-autofocus
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
              />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-text-muted">
                Price ($)
                <input
                  type="number"
                  min={0}
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                  className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
                />
              </label>
              <div className="text-xs font-semibold text-text-muted">
                <span id="stock-label">Stock</span>
                <div
                  role="group"
                  aria-labelledby="stock-label"
                  className="mt-1.5 flex items-center rounded-lg border border-border"
                >
                  <button
                    type="button"
                    aria-label="Decrease stock"
                    onClick={() => setDraft({ ...draft, stock: Math.max(0, draft.stock - 1) })}
                    className="grid h-9 w-9 place-items-center rounded-l-lg text-base text-text-muted hover:bg-surface-alt"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-mono text-sm text-foreground" aria-live="polite">
                    {draft.stock}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase stock"
                    onClick={() => setDraft({ ...draft, stock: draft.stock + 1 })}
                    className="grid h-9 w-9 place-items-center rounded-r-lg text-base text-text-muted hover:bg-surface-alt"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <label className="mt-3 block text-xs font-semibold text-text-muted">
              Category
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <div className="mt-auto flex gap-2 pt-6">
              <button
                type="button"
                onClick={() => close("close-button")}
                className="flex-1 rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-alt hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => close("action")}
                className="flex-1 rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Save product
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Link href="/scenarios/delete-confirmation" className="text-sm font-medium text-accent hover:underline">
          ← Prev: delete confirmation
        </Link>
        <Link href="/scenarios/delivery-filters" className="text-sm font-medium text-accent hover:underline">
          Next: delivery sheet →
        </Link>
      </div>
    </main>
  );
}
