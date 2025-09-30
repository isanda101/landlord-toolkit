'use client';
import Link from "next/link";

export default function SecurityDepositCalculatorPage() {
  const onView = () => {
    if (typeof window !== 'undefined' && window.va) window.va('event', 'ToolViewed', { tool: 'Security Deposit Calculator' });
    if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', 'ToolViewed', { tool: 'Security Deposit Calculator' });
  };
  const onUse = () => {
    if (typeof window !== 'undefined' && window.va) window.va('event', 'ToolUsed', { tool: 'Security Deposit Calculator' });
    if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', 'ToolUsed', { tool: 'Security Deposit Calculator' });
    alert("Example: deposit calculation result here.");
  };

  return (
    <main className="p-4 max-w-xl mx-auto" onLoad={onView}>
      <h1 className="text-2xl font-bold">Security Deposit Calculator</h1>
      <p className="mt-2 text-sm text-gray-600">Estimate deposit amounts and deduction scenarios.</p>

      <section className="mt-6 space-y-3">
        <label className="block"><span>Monthly Rent</span><input type="number" className="w-full border p-2 rounded" placeholder="e.g., 1500" /></label>
        <label className="block"><span>Deposit Multiplier</span><input type="number" className="w-full border p-2 rounded" placeholder="e.g., 1.5" step="0.1" /></label>
        <button className="w-full mt-2 border rounded p-2 font-medium" onClick={onUse}>Calculate</button>
      </section>

      <div className="mt-8"><Link href="/" className="underline">← Back to all tools</Link></div>
    </main>
  );
}
