"use client";

import React, { useEffect, useMemo, useState } from "react";
import { setRecentTool } from "@/app/lib/recentTool";
import ResultPanel from "@/components/ui/ResultPanel";
import { trackEvent } from "@/app/lib/trackEvent";
import { getParam, setParams, buildShareUrl } from "@/app/lib/urlParams";

function formatUSD(n) {
  const num = Number(n);
  if (!isFinite(num)) return "";
  return "$" + num.toFixed(2);
}

// very small localStorage persistence for last entry (optional)
const KEY = "lt_last_deposit";

export default function ClientPage() {
  React.useEffect(() => { setRecentTool("deposit", "/deposit-tracker"); }, []);
  const [tenant, setTenant] = useState("");
  const [property, setProperty] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Prefill from URL or localStorage
  useEffect(() => {
    const q = {
      tenant: getParam("tenant", ""),
      property: getParam("property", ""),
      amount: getParam("amount", ""),
      date: getParam("date", ""),
      method: getParam("method", ""),
      ref: getParam("ref", ""),
      notes: getParam("notes", ""),
    };
    const anyQ = Object.values(q).some(Boolean);
    if (anyQ) {
      setTenant(q.tenant); setProperty(q.property); setAmount(q.amount);
      setDate(q.date); setMethod(q.method || "Bank Transfer"); setRef(q.ref); setNotes(q.notes);
      return;
    }
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) || "null");
      if (prev) {
        setTenant(prev.tenant || "");
        setProperty(prev.property || "");
        setAmount(prev.amount || "");
        setDate(prev.date || "");
        setMethod(prev.method || "Bank Transfer");
        setRef(prev.ref || "");
        setNotes(prev.notes || "");
      }
    } catch {}
  }, []);

  // keep URL in sync (light debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      setParams({
        tenant: tenant || undefined,
        property: property || undefined,
        amount: amount || undefined,
        date: date || undefined,
        method: method || undefined,
        ref: ref || undefined,
        notes: notes || undefined,
      });
    }, 150);
    return () => clearTimeout(t);
  }, [tenant, property, amount, date, method, ref, notes]);

  // Derived receipt lines
  const lines = useMemo(() => {
    const a = Number(amount);
    if (!(a > 0) || !date) return null;
    return [
      `Tenant: ${tenant || "-"}`,
      `Property: ${property || "-"}`,
      `Amount: ${formatUSD(a)}`,
      `Received: ${date}`,
      `Method: ${method || "-"}`,
      `Reference: ${ref || "-"}`,
      ...(notes ? [`Notes: ${notes}`] : []),
    ];
  }, [tenant, property, amount, date, method, ref, notes]);

  function saveReceipt() {
    const a = Number(amount);
    if (!(a > 0) || !date) {
      setResult(null);
      return;
    }
    const receipt = { tenant, property, amount: a, date, method, ref, notes };
    setResult(receipt);
    try { localStorage.setItem(KEY, JSON.stringify(receipt)); } catch {}
    trackEvent("DepositSave", { tenant, property, amount: a, method: method || "n/a" });
  }

  async function shareLink() {
    const url = buildShareUrl({
      tenant: tenant || undefined,
      property: property || undefined,
      amount: amount || undefined,
      date: date || undefined,
      method: method || undefined,
      ref: ref || undefined,
      notes: notes || undefined,
    });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      trackEvent("ShareLink", { tool: "deposit", status: "copied" });
    } catch {
      window.prompt("Copy this link:", url);
      trackEvent("ShareLink", { tool: "deposit", status: "prompt-fallback" });
    }
  }

  function printPDF() {
    trackEvent("Print", { tool: "deposit" });
    window.print(); // user can Save as PDF in dialog
  }

  function resetForm() {
    setTenant(""); setProperty(""); setAmount(""); setDate("");
    setMethod("Bank Transfer"); setRef(""); setNotes(""); setResult(null);
    setParams({ tenant: undefined, property: undefined, amount: undefined, date: undefined, method: undefined, ref: undefined, notes: undefined });
    trackEvent("Reset", { tool: "deposit" });
  }

  // JSON-LD for the page rendered from server (metadata handled in server file)

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

      <h1 className="text-2xl font-bold">Security Deposit Tracker</h1>
      <p className="mt-2 text-sm opacity-80">
        Save a clean deposit receipt, share a prefilled link, and print / save as PDF.
      </p>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button onClick={shareLink} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
          Share Link
        </button>
        <button onClick={printPDF} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
          Print / Save PDF
        </button>
        <button onClick={resetForm} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
          Reset
        </button>
        <a href="/" className="ml-auto text-sm underline">← Back to Home</a>
      </div>

      {/* Form */}
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Tenant name</span>
          <input value={tenant} onChange={(e)=>setTenant(e.target.value)} placeholder="e.g., John Smith"
                 className="w-full rounded-xl border px-3 py-2" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Property</span>
          <input value={property} onChange={(e)=>setProperty(e.target.value)} placeholder="e.g., 123 Main St, Apt 2B"
                 className="w-full rounded-xl border px-3 py-2" />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Deposit Amount (USD)</span>
            <input type="number" inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)}
                   placeholder="e.g., 1500" className="w-full rounded-xl border px-3 py-2" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Date received</span>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
                   className="w-full rounded-xl border px-3 py-2" />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Payment method</span>
            <select value={method} onChange={(e)=>setMethod(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2">
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Check</option>
              <option>Money Order</option>
              <option>Other</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Reference / Transaction ID</span>
            <input value={ref} onChange={(e)=>setRef(e.target.value)} placeholder="e.g., ACH#1234"
                   className="w-full rounded-xl border px-3 py-2" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Notes (optional)</span>
          <textarea value={notes} onChange={(e)=>setNotes(e.target.value)}
                    placeholder="Any notes about the deposit" rows={3}
                    className="w-full rounded-xl border px-3 py-2" />
        </label>

        <div className="mt-1 print:hidden">
          <button
            onClick={saveReceipt}
            className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 active:scale-[0.99]"
          >
            Save Receipt
          </button>
        </div>

        {lines && (
          <div className="print:mt-8">
            <ResultPanel
              title="Deposit Receipt"
              lines={lines}
              onCopy={(text)=>trackEvent("CopyResult", { tool: "deposit", textLength: (text||'').length })}
            />
            <div className="hidden print:block mt-6">
              <div className="text-xs text-gray-500">
                Generated by Landlord Toolkit — https://landlord-toolkit.vercel.app
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 print:hidden">
          Tip: Prefill via URL, e.g. <code>?tenant=John&property=123+Main&amount=1500&date=2025-10-15&method=ACH&ref=XYZ</code>
        </p>
      </div>
    </main>
  );
}
