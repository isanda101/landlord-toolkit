"use client";
export function getParam(name, fallback = "") {
  if (typeof window === "undefined") return fallback;
  const u = new URL(window.location.href);
  return u.searchParams.get(name) ?? fallback;
}
export function setParams(obj = {}) {
  if (typeof window === "undefined") return;
  const u = new URL(window.location.href);
  Object.entries(obj).forEach(([k,v]) => {
    if (v === undefined || v === null || v === "") u.searchParams.delete(k);
    else u.searchParams.set(k, String(v));
  });
  window.history.replaceState({}, "", u.toString());
  return u.toString();
}
export function buildShareUrl(obj = {}) {
  if (typeof window === "undefined") return "";
  const u = new URL(window.location.href);
  Object.entries(obj).forEach(([k,v]) => {
    if (v === undefined || v === null || v === "") u.searchParams.delete(k);
    else u.searchParams.set(k, String(v));
  });
  return u.toString();
}
