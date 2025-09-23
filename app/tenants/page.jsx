"use client";
import React from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TenantsPage() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [tenants, setTenants] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    unit: "",
    monthly_rent: "",
    deposit: "",
  });

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      if (data.user) {
        await fetchTenants();
      } else {
        setLoading(false);
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchTenants();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function fetchTenants() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setTenants(data || []);
    setLoading(false);
  }

  function parseMoney(v) {
    if (v === "" || v == null) return null;
    const num = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(num) ? num : null;
  }

  async function addTenant(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");

    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      unit: form.unit.trim() || null,
      monthly_rent: parseMoney(form.monthly_rent),
      deposit: parseMoney(form.deposit),
    };
    if (!payload.name) {
      setError("Name is required");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("tenants").insert(payload);
    if (error) {
      setError(error.message);
    } else {
      setForm({ name: "", unit: "", monthly_rent: "", deposit: "" });
      await fetchTenants();
    }
    setSaving(false);
  }

  async function removeTenant(id) {
    if (!confirm("Delete this tenant?")) return;
    const { error } = await supabase.from("tenants").delete().eq("id", id);
    if (error) alert(error.message);
    else setTenants((prev) => prev.filter((t) => t.id !== id));
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
        <h1 className="text-2xl font-semibold mb-2">Tenants</h1>
        <p className="text-sm text-gray-600">
          Please <a className="underline" href="/login">sign in</a> to manage tenants.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Tenants</h1>

      <form onSubmit={addTenant} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border rounded-xl">
        <div>
          <label className="text-sm">Name</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="Jane Renter"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm">Unit</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="Apt 3B"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm">Monthly Rent</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="1200"
            inputMode="decimal"
            value={form.monthly_rent}
            onChange={(e) => setForm({ ...form, monthly_rent: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm">Deposit</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="1200"
            inputMode="decimal"
            value={form.deposit}
            onChange={(e) => setForm({ ...form, deposit: e.target.value })}
          />
        </div>
        {error && <div className="sm:col-span-2 text-sm text-red-600">{error}</div>}
        <div className="sm:col-span-2">
          <button
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add tenant"}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {tenants.length === 0 ? (
          <p className="text-sm text-gray-500">No tenants yet.</p>
        ) : (
          tenants.map((t) => (
            <div key={t.id} className="flex items-center justify-between border rounded-xl p-4">
              <div>
                <div className="font-medium">
                  {t.name} {t.unit ? `• ${t.unit}` : ""}
                </div>
                <div className="text-sm text-gray-600">
                  Rent: {t.monthly_rent != null ? `$${Number(t.monthly_rent).toFixed(2)}` : "—"} •{" "}
                  Deposit: {t.deposit != null ? `$${Number(t.deposit).toFixed(2)}` : "—"}
                </div>
              </div>
              <button
                onClick={() => removeTenant(t.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
