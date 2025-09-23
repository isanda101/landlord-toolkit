"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";

function fmtMoney(n) {
  if (n == null || isNaN(n)) return "—";
  return `$${Number(n).toFixed(2)}`;
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function slug(s = "") {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function DepositsPage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [tenants, setTenants] = React.useState([]);
  const [tenantId, setTenantId] = React.useState("");
  const [entries, setEntries] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState({
    entry_date: today(),
    type: "charge",
    amount: "",
    note: "",
  });

  const printableRef = React.useRef(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      const u = data.user ?? null;
      setUser(u);
      if (u) {
        await fetchTenants();
      } else {
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchTenants();
      else {
        setTenants([]);
        setTenantId("");
        setEntries([]);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchTenants() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tenants")
      .select("id, name, unit, monthly_rent, deposit, created_at")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setTenants(data || []);
    if (!tenantId && data && data.length > 0) {
      setTenantId(data[0].id);
      await fetchEntries(data[0].id);
    }
    setLoading(false);
  }

  async function fetchEntries(tid = tenantId) {
    if (!tid) return;
    const { data, error } = await supabase
      .from("deposit_entries")
      .select("*")
      .eq("tenant_id", tid)
      .order("entry_date", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) setError(error.message);
    setEntries(data || []);
  }

  function parseMoney(v) {
    if (v === "" || v == null) return null;
    const num = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(num) ? num : null;
  }

  async function addEntry(e) {
    e.preventDefault();
    if (!user) return;
    if (!tenantId) {
      setError("Please select a tenant first.");
      return;
    }
    setError("");
    setSaving(true);

    const payload = {
      user_id: user.id,
      tenant_id: tenantId,
      entry_date: form.entry_date || today(),
      type: form.type,
      amount: parseMoney(form.amount),
      note: form.note?.trim() || null,
    };

    if (!payload.amount || payload.amount <= 0) {
      setError("Amount must be greater than zero.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("deposit_entries").insert(payload);
    if (error) {
      setError(error.message);
    } else {
      setForm((f) => ({ ...f, amount: "", note: "" }));
      await fetchEntries();
    }
    setSaving(false);
  }

  async function deleteEntry(id) {
    if (!confirm("Delete this entry?")) return;
    const { error } = await supabase.from("deposit_entries").delete().eq("id", id);
    if (error) alert(error.message);
    else setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const balance = entries.reduce((acc, e) => {
    const amt = Number(e.amount || 0);
    if (e.type === "refund") return acc - amt;
    return acc + amt;
  }, 0);

  const tenant = tenants.find((t) => t.id === tenantId);

  async function exportPdf() {
    if (!printableRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;

    const filename = `deposit-statement_${slug(tenant?.name || "tenant")}_${today()}.pdf`;

    const opt = {
      margin:       0.5,
      filename,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF:        { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak:    { mode: ["css", "legacy"] },
    };

    await html2pdf().set(opt).from(printableRef.current).save();
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <p>Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-2">Deposit Tracker (Saved)</h1>
        <p className="text-sm text-gray-600">
          Please <a className="underline" href="/login">sign in</a> to manage deposits.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Deposit Tracker (Saved)</h1>
        <a href="/" className="text-sm underline">Back to Home</a>
      </div>

      <div className="mt-4 p-4 border rounded-xl">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Tenant</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={tenantId}
              onChange={async (e) => {
                const tid = e.target.value;
                setTenantId(tid);
                setEntries([]);
                if (tid) await fetchEntries(tid);
              }}
            >
              <option value="">Select…</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}{t.unit ? ` • ${t.unit}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={exportPdf}
              disabled={!tenantId}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
              title={tenantId ? "Download PDF" : "Select a tenant first"}
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {tenantId && (
        <>
          <div className="mt-6 p-4 border rounded-xl bg-gray-50">
            <div className="text-sm text-gray-600">Current balance</div>
            <div className="text-2xl font-semibold">{fmtMoney(balance)}</div>
          </div>

          <form onSubmit={addEntry} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-xl">
            <div>
              <label className="text-sm">Date</label>
              <input
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.entry_date}
                onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm">Type</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="charge">Charge (adds to balance)</option>
                <option value="refund">Refund (subtracts)</option>
                <option value="interest">Interest (adds)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Amount</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="e.g., 1200"
                inputMode="decimal"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm">Note</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="optional"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            {error && <div className="sm:col-span-2 text-sm text-red-600">{error}</div>}
            <div className="sm:col-span-2">
              <button disabled={saving} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
                {saving ? "Saving…" : "Add entry"}
              </button>
            </div>
          </form>
        </>
      )}

      {tenantId && (
        <div ref={printableRef} className="mt-8 p-6 border rounded-xl bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Security Deposit Statement</div>
              <div className="text-sm text-gray-600">Generated: {today()}</div>
            </div>
            <div className="text-right text-sm">
              <div className="font-medium">{tenant?.name || "Tenant"}</div>
              {tenant?.unit ? <div className="text-gray-600">Unit: {tenant.unit}</div> : null}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-600">Current balance</div>
            <div className="text-xl font-semibold">{fmtMoney(balance)}</div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium mb-2">History</div>
            {entries.length === 0 ? (
              <p className="text-sm text-gray-500">No entries yet.</p>
            ) : (
              <table className="w-full text-sm border-t border-l">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border-r border-b">Date</th>
                    <th className="text-left p-2 border-r border-b">Type</th>
                    <th className="text-left p-2 border-r border-b">Note</th>
                    <th className="text-right p-2 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id}>
                      <td className="p-2 border-r border-b">{fmtDate(e.entry_date)}</td>
                      <td className="p-2 border-r border-b capitalize">{e.type}</td>
                      <td className="p-2 border-r border-b">{e.note || "—"}</td>
                      <td className="p-2 border-b text-right">{fmtMoney(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tenantId && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Manage entries</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-500">No entries yet.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 border rounded-xl">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{fmtDate(e.entry_date)}</span> • {e.type}
                      {e.note ? <> • <span className="text-gray-600">{e.note}</span></> : null}
                    </div>
                    <div className="text-sm text-gray-600">{fmtMoney(e.amount)}</div>
                  </div>
                  <button onClick={() => deleteEntry(e.id)} className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
