import { DepositTracker } from "@/components/tools";

export const metadata = {
  title: "Security Deposit Tracker (Free)",
  description: "Track deposit charges, refunds, and interest. Keep a running balance.",
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-3">Security Deposit Tracker</h1>
      <p className="text-sm text-gray-600 mb-6">
        Keep a clean record of deposit activity for your tenants. Export or copy results.
      </p>
      <DepositTracker />
      <p className="text-xs text-gray-500 mt-8">This tool isn’t legal advice.</p>
    </main>
  );
}
