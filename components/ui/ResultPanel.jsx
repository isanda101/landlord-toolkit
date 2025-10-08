"use client";
import React from "react";

export default function ResultPanel({ title, lines = [], onCopy }) {
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines || "");
  return (
    <div className="mt-4 rounded-2xl border p-4 shadow-sm">
      <div className="text-sm font-semibold opacity-80">{title}</div>
      <div className="mt-2 space-y-1 text-sm">
        {(lines || []).map((l, i) => (
          <div key={i} className="font-mono">{l}</div>
        ))}
      </div>
      <div className="mt-3">
        <button
          onClick={() => { navigator.clipboard.writeText(text); onCopy?.(text); }}
          className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50"
        >
          Copy result
        </button>
      </div>
    </div>
  );
}
