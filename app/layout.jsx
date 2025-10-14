import { Analytics } from '@vercel/analytics/react';
import './globals.css';

import AdsTag from "@/app/components/AdsTag";

export const metadata = {
  title: 'Landlord Toolkit – Free Tools for Property Owners',
  description: 'Simple online tools for independent landlords to manage tenants, leases, and rentals efficiently.',
  keywords: 'landlord tools, rental management, tenant management, lease tracking, property toolkit',
  openGraph: {
    title: 'Landlord Toolkit',
    description: 'Free online tools for independent landlords.',
    url: 'https://landlord-toolkit.vercel.app',
    siteName: 'Landlord Toolkit',
    images: [
      {
        url: 'https://landlord-toolkit.vercel.app/og-image.png', // put this file in /public
        width: 1200,
        height: 630,
        alt: 'Landlord Toolkit preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Landlord Toolkit',
    description: 'Free online tools for independent landlords.',
    images: ['https://landlord-toolkit.vercel.app/og-image.png'], // same as above
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

