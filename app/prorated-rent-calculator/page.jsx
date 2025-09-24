import { ProratedRent } from "@/components/tools";

export const metadata = {
  title: "Prorated Rent Calculator (Free)",
  description: "Calculate prorated rent by actual days or 30-day method. Fast, accurate, and free.",
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-3">Prorated Rent Calculator</h1>
      <p className="text-sm text-gray-600 mb-6">
        Free calculator for landlords and tenants. Choose the method, set dates, and copy results.
      </p>
      <ProratedRent />
      <section className="mt-10 prose prose-sm">
        <h2>How to calculate prorated rent</h2>
        <ol>
          <li>Choose actual days in month or 30-day method.</li>
          <li>Enter monthly rent and the start/end dates.</li>
          <li>Copy the computed amount for your invoice/lease addendum.</li>
        </ol>
        <h3>FAQ</h3>
        <p><strong>Is 30-day method okay?</strong> Many leases allow it; check your lease/law.</p>
        <p className="text-xs text-gray-500">This tool isn’t legal advice.</p>
      </section>
    </main>
  );
}
