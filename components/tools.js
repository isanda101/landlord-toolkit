"use client";
import React from "react";
import { Card, NumberInput, TextInput, DateInput, CopyButton } from "@/components/ui";

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
function diffDaysInclusive(start, end) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e - s) / msPerDay) + 1;
  return Math.max(0, diff);
}

export function ProratedRent() {
  const [monthlyRent, setMonthlyRent] = React.useState(1500);
  const [periodStart, setPeriodStart] = React.useState("");
  const [periodEnd, setPeriodEnd] = React.useState("");
  const [method, setMethod] = React.useState("actual");

  const result = React.useMemo(() => {
    if (!monthlyRent || !periodStart || !periodEnd) return null;
    const s = new Date(periodStart);
    const e = new Date(periodEnd);
    if (isNaN(s) || isNaN(e) || e < s) return null;

    let perDay;
    if (method === "actual") {
      const dim = daysInMonth(s.getFullYear(), s.getMonth());
      perDay = Number(monthlyRent) / dim;
    } else {
      perDay = Number(monthlyRent) / 30;
    }
    const days = diffDaysInclusive(s, e);
    const amount = Math.round(perDay * days * 100) / 100;
    return { days, perDay, amount };
  }, [monthlyRent, periodStart, periodEnd, method]);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4">
            <NumberInput label="Monthly Rent ($)" value={monthlyRent} onChange={setMonthlyRent} min={0} />
            <DateInput label="Start Date" value={periodStart} onChange={setPeriodStart} />
            <DateInput label="End Date" value={periodEnd} onChange={setPeriodEnd} />
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input type="radio" className="scale-110" checked={method === "actual"} onChange={() => setMethod("actual")} />
              <span className="text-sm text-gray-700">Actual days in month</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" className="scale-110" checked={method === "thirty"} onChange={() => setMethod("thirty")} />
              <span className="text-sm text-gray-700">30-day convention</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-gray-50">
              <div className="text-xs text-gray-500">Days charged</div>
              <div className="text-2xl font-semibold">{result?.days ?? "—"}</div>
            </Card>
            <Card className="bg-gray-50">
              <div className="text-xs text-gray-500">Per-day rate</div>
              <div className="text-2xl font-semibold">{result ? `$${result.perDay.toFixed(2)}` : "—"}</div>
            </Card>
            <Card className="bg-gray-50">
              <div className="text-xs text-gray-500">Prorated amount</div>
              <div className="text-2xl font-semibold">{result ? `$${result.amount.toFixed(2)}` : "—"}</div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DepositTracker() {
  const [deposit, setDeposit] = React.useState(2200);
  const [deductions, setDeductions] = React.useState([
    { label: "Cleaning", value: 0 },
    { label: "Repairs", value: 0 },
    { label: "Unpaid utilities", value: 0 }
  ]);

  const totalDeductions = React.useMemo(
    () => deductions.reduce((sum, d) => sum + (Number(d.value) || 0), 0),
    [deductions]
  );
  const balance = React.useMemo(() => Math.max(0, Number(deposit || 0) - totalDeductions), [deposit, totalDeductions]);

  const [landlord, setLandlord] = React.useState("Landlord Name");
  const [tenant, setTenant] = React.useState("Tenant Name");
  const [property, setProperty] = React.useState("123 Main St, City, ST");
  const [moveOut, setMoveOut] = React.useState("");

  const letter = React.useMemo(() => {
    const lines = [
      `${new Date().toLocaleDateString()}`,
      "",
      `${tenant}`,
      `${property}`,
      "",
      `Security Deposit Return Statement`,
      "",
      `Original deposit: $${Number(deposit || 0).toFixed(2)}`,
      `Total deductions: $${totalDeductions.toFixed(2)}`,
      `Balance owed: $${balance.toFixed(2)}`,
      "",
      `Itemized deductions:`,
      ...deductions.filter(d => Number(d.value) > 0).map(d => `• ${d.label}: $${Number(d.value).toFixed(2)}`),
      "",
      `Move-out date: ${moveOut || "—"}`,
      "",
      `Sincerely,`,
      `${landlord}`,
    ];
    return lines.join("\n");
  }, [tenant, property, deposit, totalDeductions, balance, deductions, moveOut, landlord]);

  function updateDeduction(i, patch) {
    setDeductions((xs) => xs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <NumberInput label="Original Deposit ($)" value={deposit} onChange={setDeposit} min={0} />
          <DateInput label="Move-out Date" value={moveOut} onChange={setMoveOut} />
          <TextInput label="Landlord Name" value={landlord} onChange={setLandlord} />
          <TextInput label="Tenant Name" value={tenant} onChange={setTenant} />
          <TextInput label="Property Address" value={property} onChange={setProperty} />
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-3">Deductions</h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {deductions.map((d, i) => (
              <div key={i} className="space-y-2">
                <TextInput label="Label" value={d.label} onChange={(v) => updateDeduction(i, { label: v })} />
                <NumberInput label="Amount ($)" value={d.value} onChange={(v) => updateDeduction(i, { value: v })} min={0} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gray-50">
            <div className="text-xs text-gray-500">Total deductions</div>
            <div className="text-2xl font-semibold">${totalDeductions.toFixed(2)}</div>
          </Card>
          <Card className="bg-gray-50">
            <div className="text-xs text-gray-500">Balance owed</div>
            <div className="text-2xl font-semibold">${balance.toFixed(2)}</div>
          </Card>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Deposit Return Letter (Preview)</h4>
          <CopyButton text={letter} />
        </div>
        <textarea value={letter} readOnly rows={16} className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black/30 font-mono text-sm" />
      </Card>
    </div>
  );
}

export function NoticeGenerator() {
  const [landlord, setLandlord] = React.useState("Landlord Name");
  const [tenant, setTenant] = React.useState("Tenant Name");
  const [property, setProperty] = React.useState("123 Main St, City, ST");
  const [rentDue, setRentDue] = React.useState(1500);
  const [dueDate, setDueDate] = React.useState("");
  const [lateFee, setLateFee] = React.useState(75);

  const body = React.useMemo(() => {
    const lines = [
      `${new Date().toLocaleDateString()}`,
      "",
      `${tenant}`,
      `${property}`,
      "",
      `RE: Notice of Late Rent`,
      "",
      `This letter is to inform you that your rent in the amount of $${Number(rentDue || 0).toFixed(2)} due on ${dueDate || "—"} has not been received. A late fee of $${Number(lateFee || 0).toFixed(2)} has been applied in accordance with the lease.`,
      "",
      `Total amount due: $${(Number(rentDue || 0) + Number(lateFee || 0)).toFixed(2)}`,
      "",
      `Please remit payment within 3 business days to avoid further action. If you have already paid, please disregard this notice.`,
      "",
      `Sincerely,`,
      `${landlord}`,
    ];
    return lines.join("\n");
  }, [tenant, property, rentDue, dueDate, lateFee, landlord]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextInput label="Landlord Name" value={landlord} onChange={setLandlord} />
          <TextInput label="Tenant Name" value={tenant} onChange={setTenant} />
          <TextInput label="Property Address" value={property} onChange={setProperty} />
          <NumberInput label="Monthly Rent ($)" value={rentDue} onChange={setRentDue} min={0} />
          <DateInput label="Original Due Date" value={dueDate} onChange={setDueDate} />
          <NumberInput label="Late Fee ($)" value={lateFee} onChange={setLateFee} min={0} />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Late Rent Notice (Preview)</h4>
          <CopyButton text={body} />
        </div>
        <textarea value={body} readOnly rows={16} className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-black/10 focus:border-black/30 font-mono text-sm" />
      </Card>
    </div>
  );
}
