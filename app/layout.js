export const metadata = {
  title: "Landlord Toolkit",
  description: "Run rentals in minutes, not hours.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
