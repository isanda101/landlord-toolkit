"use client";
export function sendAdsConversion(sendTo) {
  if (typeof window === "undefined") return;
  try {
    if (sendTo && typeof window.gtag === "function") {
      window.gtag('event', 'conversion', { send_to: sendTo });
    }
  } catch {}
}
