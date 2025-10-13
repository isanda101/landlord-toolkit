"use client";

// Save last-used tool info to localStorage
export function setRecentTool(tool, url) {
  if (typeof window === "undefined") return;
  try {
    const payload = { tool, url, at: new Date().toISOString() };
    localStorage.setItem("lt_recent_tool", JSON.stringify(payload));
  } catch {}
}

// Read last-used tool info
export function getRecentTool() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("lt_recent_tool");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// Nicely format ISO date for display
export function fmtLocalDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch { return iso; }
}
