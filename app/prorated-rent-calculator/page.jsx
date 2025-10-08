"use client";

import React, { useMemo, useState } from "react";
import ResultPanel from "@/components/ui/ResultPanel";
import { trackEvent } from "@/app/lib/trackEvent";

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

  // Auto-calc daysInMonth from startDate (fallback 30)
  const daysInMonth = useMemo(() => daysInMonthFrom(startDate), [startDate]);

  // Compute occupied days inclusively
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

  const [result, setResult] = useState(null);

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
      \`Monthly Rent: $\${rent.toFixed(2)}\`,
      \`Days in Month: \${dim}\`,
      \`Occupied Days: \${occ}\`,
      \`Daily Rate: $\${daily.toFixed(2)}\`,
      \`Prorated Amount: $\${amount.toFixed(2)}\`,
    ];

    setResult({ amount, lines });

    trackEvent("CalculateProrated", {
      monthlyRent: rent,
      daysInMonth: dim,
      occupiedDays: occ,
      amount,
    });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Prorated Rent Calculator</h1>
      <p className="mt-2 text-sm opacity-80">
        Calculate prorated rent (inclusive dates). Copy and share results with one click.
      </p>

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
              onChange={() => {}}
              disabled
              className="w-full rounded-xl border px-3 py-2 bg-gray-50 text-gray-500"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Occupied Days (inclusive)</span>
            <input
              type="number"
              value={occupiedDays}
              onChange={() => {}}
              disabled
              className="w-full rounded-xl border px-3 py-2 bg-gray-50 text-gray-500"
            />
          </label>
        </div>

        <div className="mt-1">
          <button
            onClick={calculate}
            className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 active:scale-[0.99]"
          >
            Calculate
          </button>
        </div>

        {result && (
          <ResultPanel
            title="Prorated Rent Result"
            lines={result.lines}
            onCopy={(text) => trackEvent("CopyResult", { tool: "prorated", textLength: (text || '').length })}
          />
        )}

        <p className="text-xs text-gray-500">
          Tip: Set start and end dates (inclusive). The calculator auto-fills days in month and occupied days.
        </p>
      </div>
    </main>
  );
}
