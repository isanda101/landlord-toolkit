export default function sitemap() {
  const base = 'https://landlord-toolkit.vercel.app';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/prorated-rent-calculator`, lastModified: new Date() },
    { url: `${base}/security-deposit-tracker`, lastModified: new Date() },
    { url: `${base}/late-rent-notice-template`, lastModified: new Date() },
  ];
}
