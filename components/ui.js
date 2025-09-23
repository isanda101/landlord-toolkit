"use client";
import React from "react";

export function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export function Card({ children, className }) {
  return (
    <div className={classNames("bg-white rounded-2xl shadow-sm border border-gray-100 p-5", className)}>
      {children}
    </div>
  );
}

export function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm sm:text-base text-gray-500 mt-2">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function NumberInput({ label, value, onChange, placeholder, step="any", min }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black/30"
      />
    </label>
  );
}

export function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black/30"
      />
    </label>
  );
}

export function DateInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black/30"
      />
    </label>
  );
}

export function CopyButton({ text }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text || "");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error(e);
        }
      }}
      className="px-3 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90 active:opacity-80"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
