"use client";
import { trackEvent } from "@/app/lib/trackEvent";
import Link from "next/link";
import React from "react";
import "@/app/globals.css";
import { classNames, Card, Section } from "@/components/ui";
import { ProratedRent } from "@/components/tools"; // Keep live preview for Prorated on Home

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
            {tabs.map((t) => {
              // Route Prorated, Deposit, and Notice to dedicated pages
              if (t.id === "prorate") {
                return (
                  <Link
                    key={t.id}
                    href="/prorated-rent-calculator"
                    onClick={() => trackEvent("TabClicked", { tab: t.id, label: t.label })}
                    className="hover:text-black/70"
                  >
                    {t.label}
                  </Link>
                );
              }
              if (t.id === "deposit") {
                return (
                  <Link
                    key={t.id}
                    href="/deposit-tracker"
                    onClick={() => trackEvent("TabClicked", { tab: t.id, label: t.label })}
                    className="hover:text-black/70"
                  >
                    {t.label}
                  </Link>
                );
              }
              if (t.id === "notice") {
                return (
                  <Link
                    key={t.id}
                    href="/notice-generator"
                    onClick={() => trackEvent("TabClicked", { tab: t.id, label: t.label })}
                    className="hover:text-black/70"
                  >
                    {t.label}
                  </Link>
                );
              }
              // Keep Home as a local tab
              return (
                <button
                  key={t.id}
                  onClick={() => { trackEvent("TabClicked", { tab: t.id, label: t.label }); setActiveTab(t.id); }}
                  className={classNames(
                    "hover:text-black/70",
                    activeTab === t.id && "font-semibold text-black"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Run your rentals smarter — in minutes, not hours.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Free landlord calculators for rent, deposits, and notices. No login. No paywall. Just tools that work.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/prorated-rent-calculator" className="inline-block">
              <button className="px-5 py-3 rounded-xl font-semibold border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]">
                Use the Prorated Rent Calculator
              </button>
            </Link>
            <Link href="/deposit-tracker" className="inline-block">
              <button className="px-5 py-3 rounded-xl font-semibold border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]">
                Use the Deposit Tracker
              </button>
            </Link>
            <Link href="/notice-generator" className="inline-block">
              <button className="px-5 py-3 rounded-xl font-semibold border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]">
                Create a Late Rent Notice
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
                    <Link
                      href="/prorated-rent-calculator"
                      onClick={() => trackEvent("ToolClicked", { tool: "Prorated Rent Calculator" })}
                      className="inline-block"
                    >
                      <button className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">
                        Open Prorated Rent
                      </button>
                    </Link>
                    <Link
                      href="/deposit-tracker"
                      onClick={() => trackEvent("ToolClicked", { tool: "Security Deposit Tracker" })}
                      className="inline-block"
                    >
                      <button className="px-4 py-2 rounded-xl border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700">
                        Open Deposit Tracker
                      </button>
                    </Link>
                    <Link
                      href="/notice-generator"
                      onClick={() => trackEvent("ToolClicked", { tool: "Notice Generator" })}
                      className="inline-block"
                    >
                      <button className="px-4 py-2 rounded-xl border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700">
                        Open Notice Generator
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Live preview</div>
                  {/* Keep a live preview; Prorated is most visual */}
                  <ProratedRent />
                </div>
              </div>
            </Card>
          </Section>
        </main>
      )}

      {/* Tools area now only used for Home -> we removed inline Notice/Prorate/Deposit tabs */}
      {activeTab !== "landing" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            {/* Route the chips too */}
            <Link
              href="/prorated-rent-calculator"
              onClick={() => trackEvent("TabClicked", { tab: "prorate", label: "Prorated Rent" })}
              className="px-3 py-1.5 rounded-full border text-sm border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Prorated Rent
            </Link>
            <Link
              href="/deposit-tracker"
              onClick={() => trackEvent("TabClicked", { tab: "deposit", label: "Security Deposit Tracker" })}
              className="px-3 py-1.5 rounded-full border text-sm border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Security Deposit Tracker
            </Link>
            <Link
              href="/notice-generator"
              onClick={() => trackEvent("TabClicked", { tab: "notice", label: "Notice Generator" })}
              className="px-3 py-1.5 rounded-full border text-sm border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Notice Generator
            </Link>
            <button
              onClick={() => { trackEvent("TabClicked", { tab: "landing", label: "Home" }); setActiveTab("landing"); }}
              className="ml-auto text-sm underline"
            >
              Back to Home
            </button>
          </div>

          {/* No inline tool render here anymore */}
          <div className="text-sm text-gray-500">
            Select a tool above to open its dedicated page.
          </div>
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
