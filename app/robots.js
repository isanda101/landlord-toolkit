export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://landlord-toolkit.vercel.app/sitemap.xml',
    host: 'landlord-toolkit.vercel.app',
  };
}
