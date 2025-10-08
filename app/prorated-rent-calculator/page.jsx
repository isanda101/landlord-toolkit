"use client";

export const metadata = {
  title: "Prorated Rent Calculator | Landlord Toolkit",
  description: "Quickly calculate prorated rent for partial months. Free and easy for landlords.",
};


import React, { useEffect, useMemo, useState } from "react";
import ResultPanel from "@/components/ui/ResultPanel";
import { trackEvent } from "@/app/lib/trackEvent";
import { getParam, setParams, buildShareUrl } from "@/app/lib/urlParams";

function daysInMonthFrom(dateStr) {
  if (!dateStr) return 30;
  const d = new Date(dateStr);
  if (isNaN(d)) return 30;
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export default function ProratedRentCalculatorPage() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false); // toast flag

  // Prefill from URL on first load
  useEffect(() => {
    const rentQ = getParam("rent", "");
    const startQ = getParam("start", "");
    const endQ = getParam("end", "");
    if (rentQ || startQ || endQ) {
      setMonthlyRent(rentQ);
      setStartDate(startQ);
      setEndDate(endQ);
    }
  }, []);

  // Keep URL synced with current inputs (debounced-ish)
  useEffect(() => {
    const t = setTimeout(() => {
      setParams({
        rent: monthlyRent || undefined,
        start: startDate || undefined,
        end: endDate || undefined,
      });
    }, 150);
    return () => clearTimeout(t);
  }, [monthlyRent, startDate, endDate]);

  // JSON-LD (calculator schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Prorated Rent Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://landlord-toolkit.vercel.app/prorated-rent-calculator",
    description:
      "Calculate prorated rent with inclusive dates. Perfect for landlords and property managers.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "Landlord Toolkit" },
  };

  // Derived values
  const daysInMonth = useMemo(() => daysInMonthFrom(startDate), [startDate]);
  const occupiedDays = useMemo(() => {
    if (!startDate && !endDate) return "";
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;

    if (s && !e) {
      const dim = daysInMonthFrom(startDate);
      return dim - s.getDate() + 1;
    }
    if (!s && e) return e.getDate();
    if (!s || !e) return "";

    const ms = e - s;
    if (isNaN(ms)) return "";
    return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)) + 1);
  }, [startDate, endDate]);

  function calculate() {
    const rent = Number(monthlyRent);
    const dim = Number(daysInMonth) || 30;
    const occ = Number(occupiedDays);

    if (!(rent > 0) || !(dim > 0) || !(occ > 0)) {
      setResult(null);
      return;
    }

    const daily = rent / dim;
    const amount = Math.round(daily * occ * 100) / 100;

    const lines = [
      `Monthly Rent: $${rent.toFixed(2)}`,
      `Days in Month: ${dim}`,
      `Occupied Days: ${occ}`,
      `Daily Rate: $${daily.toFixed(2)}`,
      `Prorated Amount: $${amount.toFixed(2)}`
    ];

    setResult({ amount, lines });

    trackEvent("CalculateProrated", {
      monthlyRent: rent,
      daysInMonth: dim,
      occupiedDays: occ,
      amount
    });
  }

  async function shareLink() {
    const url = buildShareUrl({
      rent: monthlyRent || undefined,
      start: startDate || undefined,
      end: endDate || undefined,
    });

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("ShareLink", { tool: "prorated", status: "copied" });
      // auto-hide toast
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback prompt if clipboard API fails
      window.prompt("Copy this link:", url);
      trackEvent("ShareLink", { tool: "prorated", status: "prompt-fallback" });
    }
  }

  function printView() {
    trackEvent("Print", { tool: "prorated" });
    window.print();
  }

  function resetForm() {
    setMonthlyRent("");
    setStartDate("");
    setEndDate("");
    setResult(null);
    setParams({ rent: undefined, start: undefined, end: undefined });
    trackEvent("Reset", { tool: "prorated" });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 print:max-w-none">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Toast (aria-live for screen readers) */}
      <div aria-live="polite" className="fixed inset-x-0 top-4 z-[10000] flex justify-center pointer-events-none">
        {copied && (
          <div className="pointer-events-auto rounded-full border bg-white/95 px-3 py-1 text-sm shadow">
            Link copied
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold">Prorated Rent Calculator</h1>
      <p className="mt-2 text-sm opacity-80">
        Prefill via URL (rent, start, end), copy a shareable link, and print a clean summary.
      </p>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button onClick={shareLink} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
          Share Link
        </button>
        <button onClick={printView} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
          Print
        </button>
        <button onClick={resetForm} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
          Reset
        </button>
        <a href="/" className="ml-auto text-sm underline">← Back to Home</a>
      </div>

      {/* Form */}
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Monthly Rent (USD)</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="e.g., 1500"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>

        <label className="grid gap-1">
            <span className="text-sm font-medium">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Days in Month (auto)</span>
            <input
              type="number"
              value={daysInMonth}
              disabled
              className="w-full rounded-xl border px-3 py-2 bg-gray-50 text-gray-500"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Occupied Days (inclusive)</span>
            <input
              type="number"
              value={occupiedDays}
              disabled
              className="w-full rounded-xl border px-3 py-2 bg-gray-50 text-gray-500"
            />
          </label>
        </div>

        <div className="mt-1 print:hidden">
          <button
            onClick={calculate}
            className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 active:scale-[0.99]"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="print:mt-8">
            <ResultPanel
              title="Prorated Rent Result"
              lines={result.lines}
              onCopy={(text) =>
                trackEvent("CopyResult", { tool: "prorated", textLength: (text || '').length })
              }
            />
            {/* Print header */}
            <div className="hidden print:block mt-6">
              <div className="text-xs text-gray-500">
                Generated by Landlord Toolkit — https://landlord-toolkit.vercel.app
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 print:hidden">
          Tip: Use URL params, e.g. <code>?rent=1500&start=2025-10-01&end=2025-10-10</code>, then click “Share Link”.
        </p>
      </div>
    </main>
  );
}
