import { NoticeGenerator } from "@/components/tools";

export const metadata = {
  title: "Late Rent Notice Template (Free)",
  description: "Generate a professional late-rent notice you can copy or print.",
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-3">Late Rent Notice Template</h1>
      <p className="text-sm text-gray-600 mb-6">
        Fill in details and generate a clear, professional notice in seconds.
      </p>
      <NoticeGenerator />
      <p className="text-xs text-gray-500 mt-8">Laws vary by state; this isn’t legal advice.</p>
    </main>
  );
}
