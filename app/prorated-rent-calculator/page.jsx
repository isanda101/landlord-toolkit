'use client';
import Link from "next/link";

export default function ProratedRentCalculatorPage() {
  const onView = () => {
    if (typeof window !== 'undefined' && window.va) window.va('event', 'ToolViewed', { tool: 'Prorated Rent Calculator' });
    if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', 'ToolViewed', { tool: 'Prorated Rent Calculator' });
  };
  const onUse = () => {
    if (typeof window !== 'undefined' && window.va) window.va('event', 'ToolUsed', { tool: 'Prorated Rent Calculator' });
    if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', 'ToolUsed', { tool: 'Prorated Rent Calculator' });
    alert("Example: calculation result here.");
  };

  return (
    <main className="p-4 max-w-xl mx-auto" onLoad={onView}>
      <h1 className="text-2xl font-bold">Prorated Rent Calculator</h1>
      <p className="mt-2 text-sm text-gray-600">Enter monthly rent and dates; we’ll compute the prorated amount.</p>

      <section className="mt-6 space-y-3">
        <label className="block"><span>Monthly Rent</span><input type="number" className="w-full border p-2 rounded" placeholder="e.g., 1500" /></label>
        <label className="block"><span>Start Date</span><input type="date" className="w-full border p-2 rounded" /></label>
        <label className="block"><span>End Date</span><input type="date" className="w-full border p-2 rounded" /></label>
        <button className="w-full mt-2 border rounded p-2 font-medium" onClick={onUse}>Calculate</button>
      </section>

      <div className="mt-8"><Link href="/" className="underline">← Back to all tools</Link></div>
    </main>
  );
}
