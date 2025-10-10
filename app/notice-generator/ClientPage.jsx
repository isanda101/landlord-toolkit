"use client";

import React, { useEffect, useMemo, useState } from "react";
import ResultPanel from "@/components/ui/ResultPanel";
import { trackEvent } from "@/app/lib/trackEvent";
import { getParam, setParams, buildShareUrl } from "@/app/lib/urlParams";

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);
}
function formatUSD(n) {
  const num = Number(n);
  if (!isFinite(num)) return "";
  return "$" + num.toFixed(2);
}

export default function ClientPage() {
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [property, setProperty] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [noticeDate, setNoticeDate] = useState(todayISO());

  const [noticeLines, setNoticeLines] = useState(null);
  const [copied, setCopied] = useState(false);

  // URL prefill
  useEffect(() => {
    const q = {
      ln: getParam("ln",""), tn: getParam("tn",""), prop: getParam("prop",""),
      rent: getParam("rent",""), due: getParam("due",""), fee: getParam("fee",""), nd: getParam("nd",""),
    };
    if (Object.values(q).some(Boolean)) {
      if (q.ln)  setLandlordName(q.ln);
      if (q.tn)  setTenantName(q.tn);
      if (q.prop) setProperty(q.prop);
      if (q.rent) setRentAmount(q.rent);
      if (q.due) setDueDate(q.due);
      if (q.fee) setLateFee(q.fee);
      if (q.nd)  setNoticeDate(q.nd);
    }
  }, []);

  // Keep URL params updated (light debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      setParams({
        ln: landlordName || undefined,
        tn: tenantName || undefined,
        prop: property || undefined,
        rent: rentAmount || undefined,
        due: dueDate || undefined,
        fee: lateFee || undefined,
        nd: noticeDate || undefined,
      });
    }, 150);
    return () => clearTimeout(t);
  }, [landlordName, tenantName, property, rentAmount, dueDate, lateFee, noticeDate]);

  const canGenerate = useMemo(() => {
    return tenantName && property && Number(rentAmount) > 0 && dueDate;
  }, [tenantName, property, rentAmount, dueDate]);

  function generateNotice() {
    if (!canGenerate) return;

    const lines = [
`${noticeDate}`,
"",
`${tenantName}`,
`${property}`,
"",
`RE: Late Rent Notice`,
"",
`Dear ${tenantName},`,
"",
`Our records indicate that the rent of ${formatUSD(Number(rentAmount))} due on ${dueDate} has not been received.`,
lateFee ? `A late fee of ${formatUSD(Number(lateFee))} may apply as outlined in your lease.` : null,
"",
`Please submit payment in full within 5 calendar days of the date of this notice.`,
`If you have already made payment, please disregard this notice.`,
"",
`You can deliver payment by your usual method. If you need to discuss a payment plan, reply in writing.`,
"",
`Sincerely,`,
`${landlordName || "Landlord/Property Manager"}`,
    ].filter(Boolean);

    setNoticeLines(lines);
    trackEvent?.("NoticeGenerate", {
      rent: Number(rentAmount) || 0,
      fee: Number(lateFee) || 0,
    });
  }

  async function shareLink() {
    const url = buildShareUrl({
      ln: landlordName || undefined,
      tn: tenantName || undefined,
      prop: property || undefined,
      rent: rentAmount || undefined,
      due: dueDate || undefined,
      fee: lateFee || undefined,
      nd: noticeDate || undefined,
    });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      trackEvent?.("ShareLink", { tool: "notice", status: "copied" });
    } catch {
      window.prompt("Copy this link:", url);
      trackEvent?.("ShareLink", { tool: "notice", status: "prompt-fallback" });
    }
  }

  function printPDF() {
    trackEvent?.("Print", { tool: "notice" });
    window.print();
  }

  function resetForm() {
    setLandlordName(""); setTenantName(""); setProperty("");
    setRentAmount(""); setDueDate(""); setLateFee("");
    setNoticeDate(todayISO()); setNoticeLines(null);
    setParams({ ln:undefined, tn:undefined, prop:undefined, rent:undefined, due:undefined, fee:undefined, nd:undefined });
    trackEvent?.("Reset", { tool: "notice" });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 print:max-w-none">
      {/* Toast */}
      <div aria-live="polite" className="fixed inset-x-0 top-4 z-[10000] flex justify-center pointer-events-none">
        {copied && (
          <div className="pointer-events-auto rounded-full border bg-white/95 px-3 py-1 text-sm shadow">
            Link copied
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold">Late Rent Notice Generator</h1>
      <p className="mt-2 text-sm opacity-80">
        Generate a clean, printable notice. Copy, share, or save as PDF.
      </p>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button onClick={shareLink} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Share Link</button>
        <button onClick={printPDF} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Print / Save PDF</button>
        <button onClick={resetForm} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Reset</button>
        <a href="/" className="ml-auto text-sm underline">← Back to Home</a>
      </div>

      {/* Form */}
      <div className="mt-6 grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Landlord / Manager Name</span>
            <input value={landlordName} onChange={(e)=>setLandlordName(e.target.value)} placeholder="e.g., Ibrahim Sanda"
                   className="w-full rounded-xl border px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Tenant Name</span>
            <input value={tenantName} onChange={(e)=>setTenantName(e.target.value)} placeholder="e.g., John Smith"
                   className="w-full rounded-xl border px-3 py-2" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Property Address</span>
          <input value={property} onChange={(e)=>setProperty(e.target.value)} placeholder="e.g., 123 Main St, Apt 2B, City ST"
                 className="w-full rounded-xl border px-3 py-2" />
        </label>

        <div className="grid sm:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Monthly Rent (USD)</span>
            <input type="number" inputMode="decimal" value={rentAmount} onChange={(e)=>setRentAmount(e.target.value)}
                   placeholder="e.g., 1500" className="w-full rounded-xl border px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Rent Due Date</span>
            <input type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)}
                   className="w-full rounded-xl border px-3 py-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Late Fee (optional)</span>
            <input type="number" inputMode="decimal" value={lateFee} onChange={(e)=>setLateFee(e.target.value)}
                   placeholder="e.g., 50" className="w-full rounded-xl border px-3 py-2" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Notice Date</span>
          <input type="date" value={noticeDate} onChange={(e)=>setNoticeDate(e.target.value)}
                 className="w-full rounded-xl border px-3 py-2" />
        </label>

        <div className="mt-1 print:hidden">
          <button
            onClick={generateNotice}
            disabled={!canGenerate}
            className="rounded-xl px-4 py-2 text-white hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-black"
          >
            Generate Notice
          </button>
        </div>

        {noticeLines && (
          <div className="print:mt-8">
            <ResultPanel
              title="Late Rent Notice"
              lines={noticeLines}
              onCopy={(text)=>trackEvent?.("CopyResult", { tool: "notice", textLength: (text||'').length })}
            />
            {/* Print-only footer */}
            <div className="hidden print:block mt-6">
              <div className="text-xs text-gray-500">
                Generated by Landlord Toolkit — https://landlord-toolkit.vercel.app
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 print:hidden">
          Tip: Prefill via URL, e.g. <code>?tn=John+Smith&prop=123+Main&rent=1500&due=2025-10-05&fee=50&ln=Ibrahim</code>
        </p>
      </div>
    </main>
  );
}
