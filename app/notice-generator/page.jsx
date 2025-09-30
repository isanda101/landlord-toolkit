'use client';
import Link from "next/link";

export default function NoticeGeneratorPage() {
  const onView = () => {
    if (typeof window !== 'undefined' && window.va) window.va('event', 'ToolViewed', { tool: 'Notice Generator' });
    if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', 'ToolViewed', { tool: 'Notice Generator' });
  };
  const onUse = () => {
    if (typeof window !== 'undefined' && window.va) window.va('event', 'ToolUsed', { tool: 'Notice Generator' });
    if (typeof window !== 'undefined' && window.fbq) window.fbq('trackCustom', 'ToolUsed', { tool: 'Notice Generator' });
    alert("Example: notice text would be generated here.");
  };

  return (
    <main className="p-4 max-w-xl mx-auto" onLoad={onView}>
      <h1 className="text-2xl font-bold">Notice Generator</h1>
      <p className="mt-2 text-sm text-gray-600">Create clear, ready-to-send notices for tenants.</p>

      <section className="mt-6 space-y-3">
        <label className="block"><span>Notice Type</span>
          <select className="w-full border p-2 rounded">
            <option>Pay Rent or Quit</option>
            <option>Lease Termination</option>
            <option>Entry Notice</option>
          </select>
        </label>
        <button className="w-full mt-2 border rounded p-2 font-medium" onClick={onUse}>Generate</button>
      </section>

      <div className="mt-8"><Link href="/" className="underline">← Back to all tools</Link></div>
    </main>
  );
}
