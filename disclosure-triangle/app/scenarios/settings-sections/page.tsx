"use client";

import Link from "next/link";
import { useState } from "react";

function Triangle({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="disclosure-tri shrink-0"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M3.2 1.8 7.8 5 3.2 8.2V1.8Z" fill="#57534e" stroke="#57534e" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

function Switch({ on, onFlip, label }: { on: boolean; onFlip: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onFlip}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-[#0a84ff]" : "bg-[#d6d3d1]"}`}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{ left: on ? 22 : 2 }}
      />
    </button>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-[13px] text-text-muted">{k}</span>
      <span className={`text-[13px] font-medium text-[#1c1917] ${mono ? "font-mono text-xs" : ""}`}>{v}</span>
    </div>
  );
}

function Section({
  id,
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button onClick={onToggle} aria-expanded={open} aria-controls={`sec-${id}`} className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors hover:bg-[#fafaf9]">
        <span className="grid h-6 w-6 place-items-center rounded-md hover:bg-black/[0.06]">
          <Triangle open={open} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-[#1c1917]">{title}</span>
          <span className="block truncate text-xs text-text-faint">{summary}</span>
        </span>
        <span className="hidden shrink-0 rounded-full bg-surface-alt px-2 py-0.5 font-mono text-[10px] text-text-faint sm:inline">
          isExpanded = {open ? "true" : "false"}
        </span>
      </button>
      <div id={`sec-${id}`} className={`reveal ${open ? "reveal-open" : "reveal-closed"}`}>
        <div className="reveal-inner">
          <div className="border-t border-border bg-[#fafaf9] px-4 py-2 pl-[50px] pr-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsSectionsPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ network: true, tcpip: false, dns: false, proxy: false });
  const [askToJoin, setAskToJoin] = useState(true);
  const [autoJoin, setAutoJoin] = useState(true);
  const [limitTracking, setLimitTracking] = useState(false);
  const [dnsServers, setDnsServers] = useState(["1.1.1.1", "8.8.8.8"]);
  const [dnsInput, setDnsInput] = useState("");

  const flip = (id: string) => setOpen((p) => ({ ...p, [id]: !p[id] }));
  const openCount = Object.values(open).filter(Boolean).length;

  function addDns() {
    const v = dnsInput.trim();
    if (!v || dnsServers.includes(v)) return;
    setDnsServers((p) => [...p, v]);
    setDnsInput("");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-text-faint">
        <Link href="/" className="rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]">
          ← Learning hub
        </Link>
        <span aria-hidden="true">·</span>
        <span className="px-1 font-semibold text-foreground">Scenario 2 — Settings sections</span>
        <span aria-hidden="true">·</span>
        <Link href="/scenarios/package-navigator" className="rounded-full border border-border bg-surface px-3 py-1.5 transition-colors hover:border-[#0a84ff]/40 hover:text-[#0a84ff]">
          Next: Package navigator →
        </Link>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0a84ff]">Scenario 2 · DisclosureGroup · standalone sections</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Settings sections</h1>
        <p className="mt-4 leading-relaxed text-text-muted">
          A Wi-Fi detail screen where each settings group is its own <span className="font-mono text-sm">DisclosureGroup</span> —
          no outline, no tree, just one triangle per section. Rarely-touched groups stay one quiet line; the one being
          edited unfolds its controls directly beneath its label.
        </p>
      </header>

      <div className="mb-8 rounded-xl border border-[#0a84ff]/20 bg-[#eff6ff] px-5 py-4">
        <p className="text-sm font-semibold text-[#0a84ff]">Why disclosure fits here</p>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          Settings pages must show everything without overwhelming. Each triangle folds an expert-only group (DNS, proxy)
          into a single row until needed — progressive disclosure in its purest form. Sections are independent: opening DNS
          never closes TCP/IP, unlike an accordion.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5 font-mono text-xs text-text-muted">
            <span className="h-2 w-2 rounded-full bg-[#0a84ff]" /> {openCount} of 4 sections open
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setOpen({ network: true, tcpip: true, dns: true, proxy: true })}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              Expand all
            </button>
            <button
              onClick={() => setOpen({ network: true, tcpip: false, dns: false, proxy: false })}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          className="relative overflow-visible rounded-xl border border-border bg-[#fcfcfa] p-3 sm:p-8"
          style={{ backgroundImage: "radial-gradient(circle, #e7e5e4 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          <div className="relative mx-auto max-w-[600px] overflow-hidden rounded-xl border border-[#d6d3d1] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {/* settings header */}
            <div className="border-b border-border bg-[#f5f5f4] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0a84ff] text-sm text-white shadow-sm">⌁</span>
                <div>
                  <p className="text-sm font-semibold text-[#1c1917]">Studio-5G</p>
                  <p className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected · 480 Mb/s
                  </p>
                </div>
                <button className="ml-auto rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-border-strong hover:text-foreground">
                  Disconnect
                </button>
              </div>
            </div>

            <div className="space-y-2.5 bg-[#f5f5f4]/60 p-4">
              <Section id="network" title="Network behaviour" summary="Auto-join · ask before joining · tracking" open={!!open.network} onToggle={() => flip("network")}>
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-[#1c1917]">Auto-join this network</p>
                      <p className="text-xs text-text-faint">Reconnect automatically when in range</p>
                    </div>
                    <Switch on={autoJoin} onFlip={() => setAutoJoin((v) => !v)} label="Auto-join this network" />
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-[#1c1917]">Ask to join networks</p>
                      <p className="text-xs text-text-faint">Prompt before joining unknown networks</p>
                    </div>
                    <Switch on={askToJoin} onFlip={() => setAskToJoin((v) => !v)} label="Ask to join networks" />
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-[#1c1917]">Limit IP address tracking</p>
                      <p className="text-xs text-text-faint">Rotate the private address every 24 hours</p>
                    </div>
                    <Switch on={limitTracking} onFlip={() => setLimitTracking((v) => !v)} label="Limit IP address tracking" />
                  </div>
                </div>
              </Section>

              <Section id="tcpip" title="TCP/IP" summary="IPv4 · DHCP · 192.168.1.42" open={!!open.tcpip} onToggle={() => flip("tcpip")}>
                <div className="divide-y divide-border">
                  <Row k="Configure IPv4" v="Using DHCP" />
                  <Row k="IP address" v="192.168.1.42" mono />
                  <Row k="Subnet mask" v="255.255.255.0" mono />
                  <Row k="Router" v="192.168.1.1" mono />
                  <Row k="IPv6 address" v="Automatic" />
                </div>
                <button className="mb-2 mt-3 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-[#0a84ff] transition-colors hover:border-[#0a84ff]/40">
                  Renew DHCP lease
                </button>
              </Section>

              <Section id="dns" title="DNS" summary={`${dnsServers.length} servers configured`} open={!!open.dns} onToggle={() => flip("dns")}>
                <div className="space-y-1.5 py-2">
                  {dnsServers.map((s) => (
                    <div key={s} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2">
                      <span className="font-mono text-xs text-[#1c1917]">{s}</span>
                      <button
                        onClick={() => setDnsServers((p) => p.filter((x) => x !== s))}
                        aria-label={`Remove DNS server ${s}`}
                        className="ml-auto grid h-5 w-5 place-items-center rounded-full text-text-faint transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <input
                      value={dnsInput}
                      onChange={(e) => setDnsInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addDns()}
                      placeholder="Add server, e.g. 9.9.9.9"
                      className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs outline-none placeholder:text-text-faint focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/20"
                    />
                    <button onClick={addDns} className="shrink-0 rounded-lg bg-[#0a84ff] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0066cc]">
                      Add
                    </button>
                  </div>
                </div>
              </Section>

              <Section id="proxy" title="Proxies" summary="Off · configure manually when needed" open={!!open.proxy} onToggle={() => flip("proxy")}>
                <div className="divide-y divide-border">
                  <Row k="Web proxy (HTTP)" v="Off" />
                  <Row k="Secure web proxy (HTTPS)" v="Off" />
                  <Row k="SOCKS proxy" v="Off" />
                  <Row k="Bypass for" v="*.local, 169.254/16" mono />
                </div>
                <p className="py-3 text-xs leading-relaxed text-text-faint">
                  Proxy settings apply per network. Most home networks leave every proxy off — this whole section folds
                  to one line until the day it doesn&apos;t.
                </p>
              </Section>
            </div>

            <div className="flex items-center justify-between border-t border-border bg-[#f5f5f4] px-5 py-3">
              <span className="font-mono text-[11px] text-text-faint">DisclosureGroup × 4 · independent booleans</span>
              <span className="font-mono text-[11px] text-text-faint">{openCount} open</span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-text-faint">
            Open <span className="font-medium text-foreground">DNS</span>, add a server, then collapse it — your edit survives the
            fold. State lives outside the reveal; the triangle only controls visibility.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">What the user gains</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Four expert groups, one calm screen. Everyday toggles stay a tap away in the first section while DNS and proxy
            addresses wait — visible enough to find, folded enough to ignore. Fewer errors, because the dangerous fields
            aren&apos;t staring at you.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-text-faint">Builder note</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Each section owns one boolean (<span className="font-mono text-xs">open.dns</span>,{" "}
            <span className="font-mono text-xs">open.proxy</span>…) — opening one never closes another, which is exactly what
            separates DisclosureGroup from an accordion. Content stays mounted inside a zero-height grid row, so form input
            isn&apos;t wiped when a section folds.
          </p>
        </div>
      </div>

      <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Link href="/" className="text-sm font-medium text-text-muted transition-colors hover:text-[#0a84ff]">← Learning hub</Link>
        <div className="flex gap-2">
          <Link href="/scenarios/finder-outline" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:border-[#0a84ff]/30 hover:text-[#0a84ff]">← Finder outline</Link>
          <Link href="/scenarios/package-navigator" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:border-[#0a84ff]/30 hover:text-[#0a84ff]">Package navigator →</Link>
        </div>
      </nav>
    </main>
  );
}
