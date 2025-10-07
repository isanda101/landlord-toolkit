"use client";
import { trackEvent } from "@/app/lib/trackEvent";
import Link from "next/link";
import React from "react";
import "@/app/globals.css";
import { classNames, Card, Section } from "@/components/ui";
import { ProratedRent, DepositTracker, NoticeGenerator } from "@/components/tools";

export default function Page() {
  const [activeTab, setActiveTab] = React.useState("landing");

  const tabs = [
    { id: "landing", label: "Home" },
    { id: "prorate", label: "Prorated Rent" },
    { id: "deposit", label: "Security Deposit Tracker" },
    { id: "notice", label: "Notice Generator" },
  ];

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-[9999] bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-black" />
            <span className="font-semibold">Landlord Toolkit</span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={classNames(
                  "hover:text-black/70",
                  activeTab === t.id && "font-semibold text-black"
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
  {/* Hero (auto-added) */}
  <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-2xl sm:text-3xl font-bold">
        Run your rentals smarter — in minutes, not hours.
      </h1>
      <p className="mt-3 text-sm sm:text-base text-gray-600">
        Free landlord calculators for rent, deposits, and notices. No login. No paywall. Just tools that work.
      </p>

      <div className="mt-6">
        <Link href="/prorated-rent-calculator" className="inline-block">
          <button className="px-5 py-3 rounded-xl font-semibold border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]">
            Use the Prorated Rent Calculator
          </button>
        </Link>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Trusted by landlords across the U.S. • 100% free • Instant results
      </p>
    </div>
  </section>

      {/* Home */}
      {activeTab === "landing" && (
        <main>
  <div className="mt-4 grid gap-3">
  </div>

          <Section
            id="hero"
            title="Run rentals in minutes, not hours"
            subtitle="Free tools for independent landlords — no login, no paywall."
          >
            <Card className="p-0 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <ul className="space-y-3 text-sm">
                    <li>• Prorated rent calculator (actual or 30-day method)</li>
                    <li>• Simple security deposit tracker</li>
                    <li>• Late rent / notice generator</li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => { trackEvent("ToolClicked", { tool: "Prorated Rent Calculator" }); setActiveTab("prorate"); }}
                      className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
                    >
                      Open Prorated Rent
                    </button>
                    <button
                      onClick={() => { trackEvent("ToolClicked", { tool: "Security Deposit Calculator" }); setActiveTab("deposit"); }}
                      className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                    >
                      Open Deposit Tracker
                    </button>
                    <button
                      onClick={() => { trackEvent("ToolClicked", { tool: "Notice Generator" }); setActiveTab("notice"); }}
                      className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                    >
                      Open Notice Generator
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Live preview</div>
                  <ProratedRent />
                </div>
              </div>
            </Card>
          </Section>

          <Section id="features" title="Everything you need, free" subtitle="Fast, clean, and accurate.">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {["Prorated rent", "Deposit tracking", "Notice templates"].map((f) => (
                <Card key={f}>
                  <div className="text-base font-medium">{f}</div>
                  <p className="text-sm text-gray-500 mt-1">No accounts. No paywalls.</p>
                </Card>
              ))}
            </div>
          </Section>
        </main>
      )}

      {/* Tools */}
      {activeTab !== "landing" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            {tabs
              .filter((t) => t.id !== "landing")
              .map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={classNames(
                    "px-3 py-1.5 rounded-full border text-sm",
                    activeTab === t.id ? "bg-black text-white border-black" : "border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {t.label}
                </button>
              ))}
            <button onClick={() => setActiveTab("landing")} className="ml-auto text-sm underline">
              Back to Home
            </button>
          </div>

          {activeTab === "prorate" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Prorated Rent Calculator</h3>
              <ProratedRent />
            </div>
          )}

          {activeTab === "deposit" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Security Deposit Tracker</h3>
              <DepositTracker />
            </div>
          )}

          {activeTab === "notice" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Late Rent Notice Generator</h3>
              <NoticeGenerator />
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Landlord Toolkit — free tools for landlords
        </div>
      </footer>
    </div>
  );
}
