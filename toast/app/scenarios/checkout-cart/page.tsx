"use client";

import { useState } from "react";
import { useToasts, ToastViewport } from "@/components/toast";
import { ScenarioNav } from "@/components/scenario-nav";

type Product = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  tint: string;
  inStock: boolean;
};

type CartLine = { id: string; name: string; price: number; qty: number };

const PRODUCTS: Product[] = [
  {
    id: "notebook",
    name: "Field Notebook",
    price: 12,
    blurb: "48 pages, dot grid, lies flat.",
    tint: "bg-accent-light",
    inStock: true,
  },
  {
    id: "mug",
    name: "Enamel Mug",
    price: 18,
    blurb: "Campfire-proof, dishwasher-happy.",
    tint: "bg-surface-alt",
    inStock: true,
  },
  {
    id: "tote",
    name: "Canvas Tote",
    price: 28,
    blurb: "16 oz canvas, interior pocket.",
    tint: "bg-surface-alt",
    inStock: true,
  },
  {
    id: "lamp",
    name: "Desk Lamp",
    price: 64,
    blurb: "Warm dimmable LED, brass arm.",
    tint: "bg-accent-light",
    inStock: true,
  },
  {
    id: "throw",
    name: "Wool Throw",
    price: 89,
    blurb: "Lambswool, 130 × 180 cm.",
    tint: "bg-surface-alt",
    inStock: false,
  },
  {
    id: "vase",
    name: "Ceramic Vase",
    price: 42,
    blurb: "Hand-glazed stoneware, matte.",
    tint: "bg-accent-light",
    inStock: true,
  },
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CheckoutCartPage() {
  const { toasts, push, dismiss } = useToasts();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartPeeked, setCartPeeked] = useState(false);

  const count = cart.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => sum + l.qty * l.price, 0);
  const cartVisible = cart.length > 0 || cartPeeked;

  const addToCart = (product: Product) => {
    setCart((lines) => {
      const existing = lines.find((l) => l.id === product.id);
      if (existing) {
        return lines.map((l) =>
          l.id === product.id ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [
        ...lines,
        { id: product.id, name: product.name, price: product.price, qty: 1 },
      ];
    });
    const nextCount = count + 1;
    const nextSubtotal = subtotal + product.price;
    push({
      title: `"${product.name}" added to cart`,
      description: `${nextCount} ${nextCount === 1 ? "item" : "items"} · ${money(nextSubtotal)} subtotal`,
      status: "success",
      duration: 4000,
      action: { label: "View cart", onClick: () => setCartPeeked(true) },
    });
  };

  const notifyWaitlist = (product: Product) => {
    push({
      title: `${product.name} is sold out`,
      description:
        "We'll email you when it's back — tap to join the waitlist.",
      status: "error",
      duration: 0,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <ScenarioNav current="checkout-cart" />

        <header className="mb-10">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            Scenario · Action confirmation
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Checkout cart
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
            Shopping must not stop. Each add confirms itself in a toast that
            stacks when you&apos;re quick — and the one thing you genuinely must
            read (sold out) sticks until you close it.
          </p>
        </header>

        {/* Store chrome */}
        <section
          aria-label="Acme Supply store"
          className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-stone-900/5 sm:p-8"
        >
          <div className="flex items-center justify-between gap-4 pb-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm font-bold text-white">
                A
              </span>
              <div>
                <p className="text-base font-semibold tracking-tight text-foreground">
                  Acme Supply
                </p>
                <p className="text-xs text-text-faint">Goods for slow mornings</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCartPeeked(true)}
              className="flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M3 5h10l-.8 8H3.8L3 5Zm2.5 0a2.5 2.5 0 0 1 5 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Cart
              <span
                aria-label={`${count} items in cart`}
                className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold transition-colors ${
                  count > 0 ? "bg-accent text-white" : "bg-surface-alt text-text-faint"
                }`}
              >
                {count}
              </span>
            </button>
          </div>

          {/* Product grid */}
          <ul className="grid grid-cols-1 gap-5 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md hover:shadow-stone-900/5"
              >
                <div
                  className={`relative grid h-36 place-items-center ${p.tint} ${
                    p.inStock ? "" : "opacity-70 saturate-50"
                  }`}
                >
                  <span className="font-mono text-4xl font-semibold text-accent/40 select-none">
                    {p.name.charAt(0)}
                  </span>
                  {!p.inStock && (
                    <span className="absolute top-3 right-3 rounded-full bg-danger px-2.5 py-1 text-[11px] font-semibold text-white">
                      Sold out
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm font-semibold text-foreground">{money(p.price)}</p>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{p.blurb}</p>
                  {p.inStock ? (
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="mt-4 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                    >
                      Add to cart
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => notifyWaitlist(p)}
                      className="mt-4 w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-danger transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:outline-none"
                    >
                      Notify me
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Cart summary */}
          {cartVisible && (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-stone-900/5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Your cart</h2>
                <button
                  type="button"
                  onClick={() => setCartPeeked(false)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:outline-none"
                >
                  Hide
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="mt-2 text-[13px] text-text-muted">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="mt-3 divide-y divide-border">
                    {cart.map((l) => (
                      <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="text-foreground">
                          {l.name}
                          <span className="ml-2 text-text-faint">×{l.qty}</span>
                        </span>
                        <span className="font-medium text-foreground">{money(l.qty * l.price)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-medium text-text-muted">Subtotal</span>
                    <span className="text-base font-bold text-foreground">{money(subtotal)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Why a toast here */}
        <section
          aria-label="Why a toast here"
          className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2 className="text-base font-semibold text-foreground">Why a toast here?</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-text-muted">
            Shopping is a rapid loop — browse, add, keep browsing — and a modal after every
            add would kill that momentum. The toast confirms each add in the corner while your
            eyes stay on the grid, stacking up when you move fast. The sticky error is reserved
            for the one thing you genuinely must know: this item can&apos;t be bought, so it
            never dismisses itself.
          </p>
        </section>

        {/* Spec strip */}
        <section aria-label="Toast spec" className="mt-6 flex flex-wrap items-center gap-2">
          {[
            'role="status"',
            "ToastAction=View cart",
            "stacking ×3",
            "sticky error (duration=0)",
          ].map((chip) => (
            <code
              key={chip}
              className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted"
            >
              {chip}
            </code>
          ))}
        </section>
      </main>

      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
