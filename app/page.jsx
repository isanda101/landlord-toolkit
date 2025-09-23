"use client";
import React from "react";
import "@/app/globals.css";
import { classNames, Card, Section } from "@/components/ui";
import { ProratedRent, DepositTracker, NoticeGenerator } from "@/components/tools";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  // Start on the Landing tab
  const [activeTab, setActiveTab] = React.useState("landing");

  // Show email + allow logout when signed in
  const [userEmail, setUserEmail] = React.useState(null);
  React.useEffect(() => {
    let on = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (on) setUserEmail(data?.user?.email ?? null);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const tabs = [
    { id: "landing", label: "Landing" },
    { id: "prorate", label: "Prorated Rent" },
    { id: "deposit", label: "Deposit Tracker" },
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

          <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
            {userEmail ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">{userEmail}</span>
                <a
                  href="/logout"
                  className="px-3 py-1.5 rounded-xl text-sm border border-gray-300 hover:bg-gray-50"
                >
                  Log out
                </a>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-sm border border-gray-300 hover:bg-gray-50"
                >
                  Log in
                </a>
                <a
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-sm bg-black text-white hover:opacity-90"
                >
                  Start free
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Landing */}
      {activeTab === "landing" && (
        <main>
          <Section
            id="hero"
            title="Run rentals in minutes, not hours"
            subtitle="Prorate rent, track security deposits, and generate notices—fast."
          >
            <Card className="p-0 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-10">
                  <ul className="space-y-3 text-sm">
                    <li>• Prorated rent calculator (actual or 30-day method)</li>
                    <li>• One-click security deposit statements</li>
                    <li>• Auto-generated late rent & move-out notices</li>
                    <li>• Export to copy/PDF (coming soon)</li>
                  </ul>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setActiveTab("prorate")}
                      className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
                    >
                      Try a calculator
                    </button>
                    <a
                      href="/login"
                      className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                    >
                      See pricing
                    </a>
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
                <div className="mt-2 text-3xl font-semibold">
                  $0 <span className="text-base font-normal text-gray-500">/ forever</span>
                </div>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• Access calculators</li>
                  <li>• Basic notice templates</li>
                  <li>• Ads supported</li>
                </ul>
                <a
                  href="/login"
                  className="mt-6 inline-block w-full text-center px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                >
                  Get started
                </a>
              </Card>

              <Card>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">Pro</div>
                <div className="mt-2 text-3xl font-semibold">
                  $15 <span className="text-base font-normal text-gray-500">/ month</span>
                </div>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• Unlimited calculators & letters</li>
                  <li>• PDF export, custom branding</li>
                  <li>• No ads, priority support</li>
                </ul>
                <a
                  href="/login"
                  className="mt-6 inline-block w-full text-center px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
                >
                  Start free trial
                </a>
              </Card>
            </div>
          </Section>
        </main>
      )}

      {/* App Tabs */}
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
              Back to landing
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
          © {new Date().getFullYear()} Landlord Toolkit • Built for independent landlords
        </div>
      </footer>
    </div>
  );
}
