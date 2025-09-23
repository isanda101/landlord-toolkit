"use client";
import React from "react";
import "@/app/globals.css";
import { classNames, Card, Section } from "@/components/ui";
import { ProratedRent, DepositTracker, NoticeGenerator } from "@/components/tools";

export default function Page() {
  const [activeTab, setActiveTab] = React.useState("landing");
  const tabs = [
    { id: "landing", label: "Landing" },
    { id: "prorate", label: "Prorated Rent" },
    { id: "deposit", label: "Deposit Tracker" },
    { id: "notice", label: "Notice Generator" },
  ];

  return (
    <div>
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-black" />
            <span className="font-semibold">Landlord Toolkit</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={classNames("hover:text-black/70", activeTab === t.id && "font-semibold text-black")}>{t.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl text-sm border border-gray-300 hover:bg-gray-50">Log in</button>
            <button className="px-3 py-1.5 rounded-xl text-sm bg-black text-white hover:opacity-90">Start free</button>
          </div>
        </div>
      </header>

      {activeTab === "landing" && (
        <main>
          <Section id="hero" title="Run rentals in minutes, not hours" subtitle="Prorate rent, track security deposits, and generate notices—fast.">
            <Card className="p-0 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <ul className="space-y-3 text-sm">
                    <li>• Prorated rent calculator (actual or 30‑day method)</li>
                    <li>• One‑click security deposit statements</li>
                    <li>• Auto‑generated late rent & move‑out notices</li>
                    <li>• Export to copy/PDF (coming soon)</li>
                  </ul>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setActiveTab("prorate")} className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">Try a calculator</button>
                    <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">See pricing</button>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Live preview</div>
                  <ProratedRent />
                </div>
              </div>
            </Card>
          </Section>

          <Section id="features" title="Everything independent landlords need" subtitle="Start simple. Upgrade as you grow.">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {["Prorated rent", "Deposit tracking", "Notice templates", "Receipts & logs", "Export & PDFs", "Reminders (soon)"].map((f) => (
                <Card key={f}>
                  <div className="text-base font-medium">{f}</div>
                  <p className="text-sm text-gray-500 mt-1">Clean, accurate, and fast.</p>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="pricing" title="Simple pricing" subtitle="Start free. Upgrade when you’re ready.">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">Free</div>
                <div className="mt-2 text-3xl font-semibold">$0 <span className="text-base font-normal text-gray-500">/ forever</span></div>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• Access calculators</li>
                  <li>• Basic notice templates</li>
                  <li>• Ads supported</li>
                </ul>
                <button className="mt-6 w-full px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Get started</button>
              </Card>

              <Card>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pro</div>
                <div className="mt-2 text-3xl font-semibold">$15 <span className="text-base font-normal text-gray-500">/ month</span></div>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• Unlimited calculators & letters</li>
                  <li>• PDF export, custom branding</li>
                  <li>• No ads, priority support</li>
                </ul>
                <button className="mt-6 w-full px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">Start free trial</button>
              </Card>
            </div>
          </Section>
        </main>
      )}

      {activeTab !== "landing" && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            {tabs.filter(t=>t.id!=="landing").map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={classNames("px-3 py-1.5 rounded-full border text-sm", activeTab === t.id ? "bg-black text-white border-black" : "border-gray-300 hover:bg-gray-50")}>{t.label}</button>
            ))}
            <button onClick={() => setActiveTab("landing")} className="ml-auto text-sm underline">Back to landing</button>
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

      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Landlord Toolkit • Built for independent landlords
        </div>
      </footer>
    </div>
  );
}
