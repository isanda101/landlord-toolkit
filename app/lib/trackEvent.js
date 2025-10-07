export const trackEvent = (name, data = {}) => {
  if (typeof window === "undefined") return;

  // Facebook Pixel (works now)
  if (window.fbq) {
    try { window.fbq("trackCustom", name, data); } catch {}
  }

  // Optional: GA4 (will work if you add gtag later)
  if (window.gtag) {
    try { window.gtag("event", name, data); } catch {}
  }

  // Console log for free verification
  try { console.log("Event tracked:", name, data); } catch {}
};
