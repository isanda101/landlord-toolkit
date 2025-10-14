"use client";
import Script from "next/script";

export default function AdsScripts() {
  return (
    <>
      <Script
        id="ga-ads-src"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17652097077"
        strategy="afterInteractive"
      />
      <Script id="ga-ads-init" strategy="afterInteractive">
        {}
      </Script>
    </>
  );
}
