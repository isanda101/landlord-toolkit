export const metadata = {
  title: "Security Deposit Tracker | Landlord Toolkit",
  description: "Track and receipt tenant security deposits. Share a prefilled link, copy results, and print/save as PDF.",
  openGraph: {
    title: "Security Deposit Tracker | Landlord Toolkit",
    description: "Track and receipt tenant security deposits.",
    images: ["/og/deposit.png"],
    url: "https://landlord-toolkit.vercel.app/deposit-tracker"
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Deposit Tracker | Landlord Toolkit",
    description: "Track and receipt tenant security deposits.",
    images: ["/og/deposit.png"]
  }
};

import ClientPage from "./ClientPage";
export default function Page() { return <ClientPage />; }
