'use client';

import Link from "next/link";

export const metadata = {
  title: "Rent Proration Calculator – Landlord Toolkit",
  description: "Quickly calculate prorated rent for move-ins and move-outs.",
};

export default function RentCalculatorPage() {
  const handleStart = () => {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', 'ToolViewed', { tool: 'Rent Calculator' });
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ToolViewed', { tool: 'Rent Calculator' });
    }
  };

  const handleUse = () => {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', 'ToolUsed', { tool: 'Rent Calculator' });
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ToolUsed', { tool: 'Rent Calculator' });
    }
    alert("Example: result goes here (wire in your logic).");
  };

  return (
    <main className="p-4 max-w-xl mx-auto" onLoad={handleStart}>
      <h1 className="text-2xl font-bold">Rent Proration Calculator</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter monthly rent and dates; we’ll compute the prorated amount.
      </p>
      <section className="mt-6 space-y-3">
        <label className="block">
          <span>Monthly Rent</span>
          <input type="number" placeholder="e.g., 1500" className="w-full border p-2 rounded" />
        </label>
        <label className="block">
          <span>Start Date</span>
          <input type="date" className="w-full border p-2 rounded" />
        </label>
        <label className="block">
          <span>End Date</span>
          <input type="date" className="w-full border p-2 rounded" />
        </label>
        <button className="w-full mt-2 border rounded p-2 font-medium" onClick={handleUse}>
          Calculate
        </button>
      </section>
      <div className="mt-8">
        <Link href="/" className="underline">← Back to all tools</Link>
      </div>
    </main>
  );
}
