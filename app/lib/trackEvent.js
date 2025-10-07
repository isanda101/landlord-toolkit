export const trackEvent = (name, data = {}) => {
  if (typeof window === "undefined") return;
  // Vercel Analytics
  if (window.va) window.va("event", name, data);
  // Facebook Pixel (optional)
  if (window.fbq) window.fbq("trackCustom", name, data);
};
